import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '@/content/LanguageContext'
import { useAuth } from '../auth/AuthContext'
import { fetchJobSites, fetchPopularCountries } from '../../services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, ExternalLink, MapPin, Briefcase, Copy, Check, Search, LayoutDashboard } from 'lucide-react'
import { getCountryFlag } from '@/lib/countryFlags'

interface JobSite { 
  id: number
  country: string
  site_name: string
  site_url: string
}

interface PopularCountry {
  country: string
  site_count: number
}

export default function SitesPage() {
  const { content } = useLanguage()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState<string>(searchParams.get('country') || 'all')
  const [sites, setSites] = useState<JobSite[]>([])
  const [popularCountries, setPopularCountries] = useState<PopularCountry[]>([])
  const [loading, setLoading] = useState(true)
  const [allCountries, setAllCountries] = useState<string[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  useEffect(() => {
    // Read country from URL params on initial load
    const countryParam = searchParams.get('country')
    const countryValue = countryParam || 'all'
    if (countryValue !== selectedCountry) {
      setSelectedCountry(countryValue)
    }
    // Load all sites on initial mount if no country in URL
    if (!countryParam) {
      loadAllSites()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Fetch popular countries first, then load sites
    const fetchInitialData = async () => {
      try {
        const popularRes = await fetchPopularCountries()
        if (popularRes.ok && popularRes.popular_countries) {
          setPopularCountries(popularRes.popular_countries)
          // Extract unique countries from popular countries
          const countries = popularRes.popular_countries.map((c: PopularCountry) => c.country)
          setAllCountries(countries)
        }
      } catch (error) {
        console.error('Error fetching popular countries:', error)
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    // Load sites when country selection changes
    const loadSites = async () => {
      if (selectedCountry && selectedCountry !== 'all') {
        await loadSitesForCountry(selectedCountry)
      } else {
        // If 'all' selected or no country, show all sites
        await loadAllSites()
      }
    }

    loadSites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry])

  const loadSitesForCountry = async (country: string) => {
    setLoading(true)
    try {
      const res = await fetchJobSites(country)
      console.log('Job sites response for country:', country, res)
      
      // Handle different response formats
      let jobSites: JobSite[] = []
      if (res.results && Array.isArray(res.results)) {
        jobSites = res.results
      } else if (res.data && Array.isArray(res.data)) {
        jobSites = res.data
      } else if (Array.isArray(res)) {
        jobSites = res
      } else if (res.ok || res.status === 200) {
        // If response is ok but no data structure, try to extract from response
        jobSites = []
      }
      
      console.log('Parsed job sites:', jobSites)
      setSites(jobSites)
    } catch (error) {
      console.error('Error fetching job sites:', error)
      setSites([])
    } finally {
      setLoading(false)
    }
  }

  const loadAllSites = async () => {
    setLoading(true)
    try {
      // Fetch all sites without country filter
      const res = await fetchJobSites()
      console.log('All job sites response:', res)
      
      // Handle different response formats
      let jobSites: JobSite[] = []
      if (res.results && Array.isArray(res.results)) {
        jobSites = res.results
      } else if (res.data && Array.isArray(res.data)) {
        jobSites = res.data
      } else if (Array.isArray(res)) {
        jobSites = res
      } else if (res.ok || res.status === 200) {
        // If response is ok but no data structure, try to extract from response
        jobSites = []
      }
      
      console.log('Parsed all job sites:', jobSites)
      setSites(jobSites)
      
      // Extract unique countries from all sites and add to country list
      if (jobSites.length > 0) {
        const uniqueCountries = [...new Set(jobSites.map(site => site.country).filter(Boolean))].sort()
        setAllCountries(prev => {
          const combined = [...new Set([...prev, ...uniqueCountries])]
          return combined.sort()
        })
      }
    } catch (error) {
      console.error('Error fetching all job sites:', error)
      setSites([])
    } finally {
      setLoading(false)
    }
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    // Update URL when country changes
    if (country && country !== 'all') {
      setSearchParams({ country: country })
    } else {
      setSearchParams({})
    }
  }

  // Filter sites based on search query
  const filteredSites = sites.filter(site => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      site.site_name.toLowerCase().includes(query) ||
      site.country.toLowerCase().includes(query) ||
      site.site_url.toLowerCase().includes(query)
    )
  })

  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {content.sites.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.sites.subtitle}
              </p>
            </div>
            {user && (
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Search and Country Selector */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Search Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {content.sites.searchSites}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  type="text"
                  placeholder={content.sites.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Country Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {content.sites.selectCountry}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={content.sites.allCountries} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{content.sites.allCountries}</SelectItem>
                    {allCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{getCountryFlag(country)}</span>
                          {country}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCountry && selectedCountry !== 'all' && (
                  <Badge variant="secondary" className="text-sm whitespace-nowrap">
                    {sites.length} {sites.length === 1 ? content.sites.siteFound : content.sites.sitesFound}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sites Grid */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">{content.sites.loadingSites}</p>
              </div>
            </CardContent>
          </Card>
        ) : sites.length > 0 ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedCountry && selectedCountry !== 'all'
                    ? `${content.sites.title} - ${selectedCountry}`
                    : `${content.sites.title} - ${content.sites.allCountries}`}
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `${filteredSites.length} of ${sites.length} ${filteredSites.length === 1 ? content.sites.siteFound : content.sites.sitesFound}`
                    : `${sites.length} ${sites.length === 1 ? content.sites.siteFound : content.sites.sitesFound}`}
                </p>
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  {content.sites.clearSearch}
                </Button>
              )}
            </div>
            {filteredSites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSites.map(site => (
                <Card key={site.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{site.site_name}</CardTitle>
                        {site.country && (
                          <Badge variant="outline" className="text-xs">
                            <span className="mr-1 text-sm">{getCountryFlag(site.country)}</span>
                            <MapPin className="h-3 w-3 mr-1 inline" />
                            {site.country}
                          </Badge>
                        )}
                      </div>
                      <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        className="flex-1"
                      >
                        <a
                          href={site.site_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {content.sites.viewSite}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(site.site_url)}
                        title={copiedUrl === site.site_url ? content.sites.linkCopied : content.sites.copyLink}
                        className="flex-shrink-0"
                      >
                        {copiedUrl === site.site_url ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{content.sites.noSitesMatch}</h3>
                    <p className="text-muted-foreground mb-4">
                      {content.sites.noSitesMatchQuery} "{searchQuery}"
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      {content.sites.clearSearch}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{content.sites.noSitesFound}</h3>
                <p className="text-muted-foreground">
                  {selectedCountry && selectedCountry !== 'all'
                    ? `${content.sites.noSitesForCountry} ${selectedCountry}. ${content.dashboard.checkBackSoon}`
                    : content.dashboard.workingOnCurating}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Countries Section */}
        {popularCountries.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {content.dashboard.popularCountries}
              </CardTitle>
              <CardDescription>
                {content.dashboard.explorePopularDestinations}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {popularCountries.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center gap-3 h-auto py-4 px-4 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 group"
                    onClick={() => {
                      setSelectedCountry(item.country)
                      navigate(`/sites?country=${encodeURIComponent(item.country)}`)
                    }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {getCountryFlag(item.country)}
                    </span>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm">{item.country}</div>
                      <div className="text-xs text-muted-foreground group-hover:text-white/80">
                        {item.site_count} {item.site_count === 1 ? content.dashboard.site : content.dashboard.sites}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

