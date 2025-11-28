import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Globe, Users, CheckCircle, Sparkles, Plane, Shield, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/content/LanguageContext'
import { getCountryFlag } from '@/lib/countryFlags'

function App() {
  const { content } = useLanguage();
  
  const popularCountries = ['Germany', 'Canada', 'Australia', 'United States', 'United Kingdom', 'Netherlands']
  
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 mt-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-md border border-blue-100">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Trusted by Thousands</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block mb-2">
              {content.homepage.heroTitle.split('Nova Educational Consultancy')[0] || 'Welcome to'}
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              NOVA Educational Consultancy
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            {content.homepage.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold"
            >
              <Link to="/apply" className="flex items-center justify-center gap-2">
                {content.homepage.primaryButtonText}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Popular Countries */}
          <div className="mt-16">
            <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Popular Destinations</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularCountries.map((country) => (
                <div
                  key={country}
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-blue-100"
                >
                  <span className="text-2xl">{getCountryFlag(country)}</span>
                  <span className="text-sm font-medium text-gray-700">{country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">{content.homepage.features.globalOpportunities.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 leading-relaxed">
                {content.homepage.features.globalOpportunities.description}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">{content.homepage.features.expertGuidance.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 leading-relaxed">
                {content.homepage.features.expertGuidance.description}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">{content.homepage.features.provenSuccess.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 leading-relaxed">
                {content.homepage.features.provenSuccess.description}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm opacity-90">Successful Applications</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <Globe className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">50+</div>
              <div className="text-sm opacity-90">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-sm opacity-90">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-90">Secure & Trusted</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white border-0 shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <CardContent className="p-12 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Plane className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{content.homepage.cta.title}</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-2xl mx-auto leading-relaxed">
              {content.homepage.cta.subtitle}
            </p>
            <Button 
              asChild 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl rounded-xl px-8 py-6 text-lg font-semibold"
            >
              <Link to="/apply" className="flex items-center justify-center gap-2">
                {content.homepage.secondaryButtonText}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
