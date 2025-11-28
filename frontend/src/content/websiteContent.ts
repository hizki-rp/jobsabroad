/**
 * Single Source of Truth for Website Text Content (Internationalization/i18n).
 *
 * This object (websiteContent) allows the application to dynamically load all UI text
 * based on the active language ('en' or 'am'). Content is organized by section.
 *
 * How to use: websiteContent[currentLanguage].homepage.heroTitle
 */

const websiteContent = {
  // English Content (en)
  en: {
    homepage: {
      heroTitle: " Welcome to Nova Educational Consultancy",
      heroSubtitle: "Have you been worrying that your money might be lost to various agencies and consultancies while planning to go and work and change your life in different European countries? Then, you will find the solution with us!",
      primaryButtonText: "Start Your Application",
      secondaryButtonText: "Get Started Now",
      features: {
        globalOpportunities: {
          title: "Global Opportunities",
          description: "Access job opportunities in top destinations including Germany, Canada, Australia, and more."
        },
        expertGuidance: {
          title: "Expert Guidance", 
          description: "Get personalized support throughout your application process from our experienced team."
        },
        provenSuccess: {
          title: "Proven Success",
          description: "Join thousands of successful applicants who have secured their dream jobs abroad."
        }
      },
      cta: {
        title: "Ready to Begin Your Journey?",
        subtitle: "Complete your application in just 3 simple steps and unlock access to exclusive job resources."
      }
    },
    onboardingForm: {
      formTitle: "Application Form - Step",
      step1Instructions: "Please fill out the following basic information to create your application.",
      personalInfo: "Personal Information",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      usernameLabel: "Username",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      passwordLabel: "Create Password",
      dobLabel: "Date of Birth",
      submitButtonText: "Continue to Next Step",
      nextButtonText: "Next",
      backButtonText: "Back",
      privacyNotice: "By clicking continue, you agree to our Terms and Conditions.",
      // Step 2 - Work Experience
      workExperienceTitle: "Work Experience",
      workExperienceSubtitle: "Share your professional background",
      currentRoleLabel: "Current / Most Recent Role",
      yearsExperienceLabel: "Years of Experience",
      skillsLabel: "Key Skills",
      // Step 3 - Job Preferences
      jobPreferencesTitle: "Job Preferences",
      jobPreferencesSubtitle: "Let us know your career goals",
      preferredCountryLabel: "Preferred Country",
      desiredStartDateLabel: "Desired Start Date",
      desiredSalaryLabel: "Desired Salary (Optional)",
      continueToPayment: "Continue to Payment"
    },
    dashboard: {
      welcome: "Welcome",
      welcomeSubtitle: "Your personalized job search dashboard is ready. Explore curated opportunities below.",
      targetCountry: "Target Country",
      preferredDestination: "Your preferred destination",
      availableJobSites: "Available Job Sites",
      accountStatus: "Account Status",
      active: "Active",
      premiumAccess: "Premium Access",
      allCountries: "All countries",
      curatedForProfile: "Curated for your profile",
      curatedJobSites: "Curated Job Sites",
      allJobSites: "All Job Sites",
      browseAllCountries: "Browse job platforms from all available countries.",
      handPickedForCountry: "Hand-picked job platforms for",
      handPickedTailored: "Hand-picked job platforms tailored to your preferences and target country.",
      showMyCountry: "Show My Country",
      viewAllCountries: "View All Countries",
      loadingJobSites: "Loading job sites...",
      recommended: "Recommended",
      noJobSitesYet: "No job sites available yet",
      workingOnAdding: "We're working on adding job sites for",
      checkBackSoon: "Check back soon!",
      workingOnCurating: "We're working on curating the best job opportunities for you. Check back soon!",
      popularCountries: "Popular Countries",
      explorePopularDestinations: "Explore job sites from the most popular destinations",
      site: "site",
      sites: "sites",
      goToSite: "Go to Site"
    },
    sites: {
      title: "Job Sites",
      subtitle: "Browse job platforms by country",
      selectCountry: "Select Country",
      allCountries: "All Countries",
      viewSite: "View Site",
      noSitesFound: "No job sites found",
      noSitesForCountry: "No job sites available for",
      loadingSites: "Loading job sites...",
      siteName: "Site Name",
      country: "Country",
      sitesFound: "sites found",
      siteFound: "site found",
      copyLink: "Copy link",
      linkCopied: "Link copied!",
      searchSites: "Search Sites",
      searchPlaceholder: "Search by name, country, or URL...",
      clearSearch: "Clear Search",
      noSitesMatch: "No sites found",
      noSitesMatchQuery: "No job sites match your search query"
    }
  },

  // Amharic Content (am)
  am: {
    homepage: {
      heroTitle: "እንኳን ወደ ኖቫ ኤዱኬሽናል ኮንሰልታንሲ በደህና መጡ",
      heroSubtitle: "የተለያዩ  የአዉሮፓ ሀገራት ላይ ሄደው መስራት እና መለወጥ አስበዉ በተለያዩ ኤጀንሲ እና ኮንሰልታንሲዎች ገንዘቢን ብበላስ ብለው ስጋት ዉስጥ ገብተዋል እንግዲያዉስ መፍትሔውን ከኛ ዘንድ ያገኙታል !",
      primaryButtonText: "መተግበሪያዎን ይጀምሩ",
      secondaryButtonText: "አሁን ይጀምሩ",
      features: {
        globalOpportunities: {
          title: "ዓለም አቀፍ እድሎች",
          description: "ጀርመን፣ ካናዳ፣ አውስትራሊያ እና ሌሎችን ጨምሮ በከፍተኛ መዳረሻዎች የስራ እድሎችን ያግኙ።"
        },
        expertGuidance: {
          title: "የባለሙያ መመሪያ",
          description: "ከተዋጣለት ቡድናችን በመተግበሪያ ሂደትዎ ውስጥ የግል ድጋፍ ያግኙ።"
        },
        provenSuccess: {
          title: "የተረጋገጠ ስኬት",
          description: "በውጭ አገር የህልማቸውን ስራ ያገኙ በሺዎች ከሚቆጠሩ ተሳካ አመልካቾች ጋር ይቀላቀሉ።"
        }
      },
      cta: {
        title: "ጉዞዎን ለመጀመር ዝግጁ ነዎት?",
        subtitle: "በ3 ቀላል ደረጃዎች ብቻ መተግበሪያዎን ይሙሉ እና ልዩ የስራ ሀብቶችን ያግኙ።"
      }
    },
    onboardingForm: {
      formTitle: "የመተግበሪያ ቅጽ - ደረጃ",
      step1Instructions: "መተግበሪያዎን ለመፍጠር የሚከተሉትን መሰረታዊ መረጃዎች ይሙሉ።",
      personalInfo: "የግል መረጃ",
      firstNameLabel: "ስም",
      lastNameLabel: "የአባት ስም",
      usernameLabel: "የተጠቃሚ ስም",
      emailLabel: "ኢሜይል አድራሻ", 
      phoneLabel: "ስልክ ቁጥር",
      passwordLabel: "የይለፍ ቃል ይፍጠሩ",
      dobLabel: "የልደት ቀን",
      submitButtonText: "ወደ ቀጣዩ ደረጃ ይቀጥሉ",
      nextButtonText: "ቀጣይ",
      backButtonText: "ተመለስ",
      privacyNotice: "በመቀጠል የሚለውን ሲጫኑ በእኛ ውሎች እና ሁኔታዎች ይስማማሉ።",
      // Step 2 - Work Experience
      workExperienceTitle: "የስራ ልምድ",
      workExperienceSubtitle: "የሙያዎን ዳራ ያካፍሉ",
      currentRoleLabel: "የአሁኑ / የቅርብ ጊዜ ስራ",
      yearsExperienceLabel: "የስራ ልምድ ዓመታት",
      skillsLabel: "ዋና የሙያ ችሎታዎች",
      // Step 3 - Job Preferences
      jobPreferencesTitle: "የስራ ምርጫዎች",
      jobPreferencesSubtitle: "የሙያ ግቦችዎን ያሳዩን",
      preferredCountryLabel: "ተመራጭ አገር",
      desiredStartDateLabel: "የሚፈለገው የመጀመሪያ ቀን",
      desiredSalaryLabel: "የሚፈለገው ደመወዝ (አማራጭ)",
      continueToPayment: "ወደ ክፍያ ይቀጥሉ"
    },
    dashboard: {
      welcome: "እንኳን ደህና መጣህ",
      welcomeSubtitle: "ለግል የተበጀው የስራ ፍለጋ ዳሽቦርድዎ ዝግጁ ነው። ከዚህ በታች የተመደቡ እድሎችን ያስሱ።",
      targetCountry: "ዒላማ አገር",
      preferredDestination: "የእርስዎ ተመራጭ መድረሻ",
      availableJobSites: "የሚገኙ የስራ ቦታዎች",
      accountStatus: "የመለያ ሁኔታ",
      active: "ንቁ",
      premiumAccess: "ፕሪሚየም መዳረሻ",
      allCountries: "ሁሉም አገሮች",
      curatedForProfile: "ለግል የተበጀ",
      curatedJobSites: "የተመረጡ የስራ ቦታዎች",
      allJobSites: "ሁሉም የስራ ቦታዎች",
      browseAllCountries: "ከሁሉም የሚገኙ አገሮች የሥራ መድረኮችን ያስሱ።",
      handPickedForCountry: "ለ",
      handPickedTailored: "ለግል የተበጀ እና የዒላማ አገርዎ የተመረጡ የስራ መድረኮች።",
      showMyCountry: "ሀገሬን አሳይ",
      viewAllCountries: "ሁሉንም አገሮች ይመልከቱ",
      loadingJobSites: "የስራ ቦታዎችን በመጫን ላይ...",
      recommended: "የሚመከር",
      noJobSitesYet: "እስካሁን ምንም የስራ ቦታዎች የሉም",
      workingOnAdding: "ለ",
      checkBackSoon: "የስራ ቦታዎችን እያክልን ነን። ቆይተው ይመልሱ!",
      workingOnCurating: "ለእርስዎ ምርጥ የስራ እድሎችን እያዘጋጀን ነን። ቆይተው ይመልሱ!",
      popularCountries: "ታዋቂ አገሮች",
      explorePopularDestinations: "ከታዋቂ መድረሻዎች የስራ ቦታዎችን ያስሱ",
      site: "ቦታ",
      sites: "ቦታዎች",
      goToSite: "ወደ ቦታው ይሂዱ"
    },
    sites: {
      title: "የስራ ቦታዎች",
      subtitle: "በአገር የስራ መድረኮችን ያስሱ",
      selectCountry: "አገር ይምረጡ",
      allCountries: "ሁሉም አገሮች",
      viewSite: "ቦታውን ይመልከቱ",
      noSitesFound: "ምንም የስራ ቦታዎች አልተገኙም",
      noSitesForCountry: "ለ",
      loadingSites: "የስራ ቦታዎችን በመጫን ላይ...",
      siteName: "የቦታ ስም",
      country: "አገር",
      sitesFound: "ቦታዎች ተገኝተዋል",
      siteFound: "ቦታ ተገኝቷል",
      copyLink: "ሊንክ ይቅዱ",
      linkCopied: "ሊንክ ተቅድቷል!",
      searchSites: "የስራ ቦታዎችን ያስሱ",
      searchPlaceholder: "በስም፣ አገር ወይም URL ይፈልጉ...",
      clearSearch: "ፍለጋ ያጽዱ",
      noSitesMatch: "ምንም ቦታዎች አልተገኙም",
      noSitesMatchQuery: "የፍለጋ ጥያቄዎ የሚያሟሉ የስራ ቦታዎች አልተገኙም"
    }
  }
};

export default websiteContent;