export type Language = 'en' | 'ml';

export const translations = {
  en: {
    // App header & brand
    appName: 'AGROVERSE',
    appSubtitle: 'NASA Agricultural Intelligence',
    liveNasa: 'Live NASA Satellite Feed',
    selectFarm: 'Selected Farm',
    syncNasa: 'Sync NASA Data',
    syncing: 'Syncing...',
    currentSeason: 'Season 2026',
    leadAgronomist: 'Farmer / Agronomist',
    
    // Navigation
    nav: {
      overview: 'Overview',
      farms: 'My Farms',
      climate: 'Weather & Climate',
      soil: 'Soil & Moisture',
      crops: 'Crop Guide',
      suitability: 'What Can I Grow?',
      rotation: 'Crop Rotation Plans',
      simulator: 'Weather Risk Test',
      assistant: 'Voice & AI Helper',
      reports: 'Download Records',
      datasources: 'Data Sources',
      settings: 'Settings'
    },

    // Common labels
    readAloud: 'Listen (Audio)',
    stopAudio: 'Stop Audio',
    whatThisMeans: 'What does this mean for your farm?',
    recommendedAction: 'What should you do today?',
    scientificDetails: 'View Scientific Details (NASA & Lab data)',
    closeDetails: 'Hide Scientific Details',
    optimal: 'Ideal / Good',
    moderate: 'Moderate / Caution',
    stress: 'Needs Attention',
    hectares: 'Hectares',
    coordinates: 'Farm Location',
    soilType: 'Soil Type',
    irrigation: 'Water Supply / Irrigation',
    currentCrop: 'Current Crop Growing',

    // Overview Page
    overviewWelcome: 'Welcome to your Farm Dashboard',
    overviewDesc: 'Simple, direct farming advice using NASA satellites and your soil conditions.',
    weatherSummaryTitle: 'Today\'s Weather & Field State',
    tempLabel: 'Air Temperature',
    rainLabel: 'Rainfall & Water',
    soilMoistureLabel: 'Soil Moisture in Field',
    plantHealthLabel: 'Crop Greenness & Health',
    farmerActionTitle: 'Next Steps for Your Farm',
    planRotationBtn: 'View Crop Rotation Plans',
    testWeatherBtn: 'Test Weather Risks',

    // Soil Page
    soilTitle: 'Soil Moisture & Ground Health',
    soilDesc: 'Checks whether your soil has enough moisture for seeds to germinate and crops to thrive.',
    soilMoistureMeaning: 'Soil moisture is currently at a healthy level. Seeds can germinate easily without heavy initial pumping.',
    soilDisclaimer: 'Note: NASA satellites measure ground moisture from space. Soil pH and nutrients come from your local agricultural soil test card.',

    // Rotation Page
    rotationTitle: 'Smart Crop Rotation Plans',
    rotationDesc: 'Growing different crops across seasons prevents soil diseases, saves water, and adds natural nitrogen.',
    strategy1Title: 'Plan 1: Soil Healing & Free Nitrogen',
    strategy1Desc: 'Follow rice with Cowpea or Green Gram to fix natural nitrogen into the soil and break weed cycles.',
    strategy2Title: 'Plan 2: Save Water & Defend Against Drought',
    strategy2Desc: 'Uses 40% less water by switching to drought-hardy maize, groundnut, and sesame.',
    strategy3Title: 'Plan 3: Extra Income with Cash Vegetables',
    strategy3Desc: 'Integrate quick vegetables like Okra between main crops for weekly market income.',
    comparePlans: 'Compare All 3 Plans',
    singlePlan: 'Single Plan View',

    // Simulator
    simulatorTitle: 'Test Future Weather Scenarios',
    simulatorDesc: 'See what happens to your crops if monsoon rainfall drops by 20% or summer temperatures rise.',
    rainSlider: 'Rainfall Change',
    tempSlider: 'Temperature Increase',
    runTestBtn: 'Calculate Impact',

    // Assistant
    assistantTitle: 'Farmer Voice & AI Helper',
    assistantDesc: 'Ask any question in plain English or Malayalam. Get practical advice verified by agricultural research.',
    askPlaceholder: 'Ask anything (e.g., Why should I grow cowpea after rice?)...',
    sendBtn: 'Ask Helper',
    listening: 'Listening to your voice...',
    startVoice: 'Speak Question (Mic)'
  },

  ml: {
    // App header & brand
    appName: 'അഗ്രോവേഴ്സ്',
    appSubtitle: 'നാസ കാർഷിക വിവരങ്ങൾ',
    liveNasa: 'നാസ ഉപഗ്രഹ വിവരങ്ങൾ തത്സമയം',
    selectFarm: 'തിരഞ്ഞെടുത്ത കൃഷിയിടം',
    syncNasa: 'നാസ വിവരങ്ങൾ പുതുക്കുക',
    syncing: 'പുതുക്കുന്നു...',
    currentSeason: 'സീസൺ 2026',
    leadAgronomist: 'കർഷകൻ / കൃഷി ഓഫീസർ',

    // Navigation
    nav: {
      overview: 'പ്രധാന വിവരങ്ങൾ (Overview)',
      farms: 'എന്റെ കൃഷിയിടങ്ങൾ (My Farms)',
      climate: 'കാലാവസ്ഥ വിവരങ്ങൾ (Weather)',
      soil: 'മണ്ണും ഈർപ്പവും (Soil)',
      crops: 'വിള വിവരങ്ങൾ (Crops)',
      suitability: 'ഏതൊക്കെ വിളകൾ നടാം? (Suitability)',
      rotation: 'വിള പരിക്രമണ പദ്ധതികൾ (Rotation Plans)',
      simulator: 'കാലാവസ്ഥ പരീക്ഷണം (Weather Test)',
      assistant: 'ശബ്ദ & സംശയ സഹായി (AI Helper)',
      reports: 'റിപ്പോർട്ട് ഡൗൺലോഡ് (Download)',
      datasources: 'വിവര സ്രോതസ്സുകൾ (Data Sources)',
      settings: 'സെറ്റിംഗ്സ് (Settings)'
    },

    // Common labels
    readAloud: 'കേൾക്കുക (Audio)',
    stopAudio: 'നിർത്തുക (Stop)',
    whatThisMeans: 'ഇത് നിങ്ങളുടെ കൃഷിക്ക് എന്താണ് അർത്ഥമാക്കുന്നത്?',
    recommendedAction: 'നിങ്ങൾ ഇപ്പോൾ എന്ത് ചെയ്യണം?',
    scientificDetails: 'കൂടുതൽ ശാസ്ത്രീയ വിവരങ്ങൾ കാണുക',
    closeDetails: 'വിവരങ്ങൾ ചുരുക്കുക',
    optimal: 'അനുയോജ്യം (നല്ലത്)',
    moderate: 'ശ്രദ്ധിക്കുക (മിതമായത്)',
    stress: 'ശ്രദ്ധ വേണം (പ്രശ്നം)',
    hectares: 'ഹെക്ടർ',
    coordinates: 'കൃഷിയിട സ്ഥലം',
    soilType: 'മണ്ണിന്റെ ഇനം',
    irrigation: 'ജലസേചന രീതി',
    currentCrop: 'നിലവിലെ വിള',

    // Overview Page
    overviewWelcome: 'നിങ്ങളുടെ കൃഷിയിടത്തിലേക്ക് സ്വാഗതം',
    overviewDesc: 'നാസ ഉപഗ്രഹ വിവരങ്ങളും മണ്ണിന്റെ അവസ്ഥയും പരിശോധിച്ച് ലളിതമായ നിർദ്ദേശങ്ങൾ നൽകുന്നു.',
    weatherSummaryTitle: 'ഇന്നത്തെ കാലാവസ്ഥയും കൃഷിയിട നിലയും',
    tempLabel: 'വായുവിലെ ചൂട് (താപനില)',
    rainLabel: 'മഴയുടെ അളവ്',
    soilMoistureLabel: 'മണ്ണിലെ ഈർപ്പം (വെള്ളം)',
    plantHealthLabel: 'വിളകളുടെ പച്ചപ്പും വളർച്ചയും',
    farmerActionTitle: 'ഇന്ന് നിങ്ങൾ ചെയ്യേണ്ട കാര്യങ്ങൾ',
    planRotationBtn: 'വിള പരിക്രമണം കാണുക',
    testWeatherBtn: 'മഴ കുറഞ്ഞാൽ എന്ത് ചെയ്യണം?',

    // Soil Page
    soilTitle: 'മണ്ണിലെ ഈർപ്പവും ആരോഗ്യവും',
    soilDesc: 'വിത്ത് മുളയ്ക്കാനും ചെടികൾ വാടാതിരിക്കാനും ആവശ്യത്തിന് ഈർപ്പം മണ്ണിൽ ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു.',
    soilMoistureMeaning: 'മണ്ണിൽ ആവശ്യത്തിന് ഈർപ്പമുണ്ട്. വിത്ത് നടാനും വേരുകൾ പടരാനും വളരെ അനുകൂലമായ സമയമാണിത്.',
    soilDisclaimer: 'ശ്രദ്ധിക്കുക: നാസ ഉപഗ്രഹങ്ങൾ മുകളിലിരുന്ന് മണ്ണിലെ ഈർപ്പമാണ് അളക്കുന്നത്. മണ്ണിന്റെ pH, വളക്കൂറ് എന്നിവ പ്രാദേശിക മണ്ണ് പരിശോധന കാർഡിൽ നിന്നുള്ളതാണ്.',

    // Rotation Page
    rotationTitle: 'ലാഭകരമായ വിള പരിക്രമണ പദ്ധതികൾ',
    rotationDesc: 'നെല്ല് കഴിഞ്ഞയുടൻ പയറുവർഗ്ഗങ്ങൾ കൃഷി ചെയ്യുന്നത് മണ്ണിന് സ്വാഭാവിക നൈട്രജൻ നൽകുകയും കീടങ്ങളെ അകറ്റുകയും ചെയ്യുന്നു.',
    strategy1Title: 'പദ്ധതി 1: മണ്ണിന്റെ ഫലഭൂയിഷ്ഠതയും സൗജന്യ നൈട്രജനും',
    strategy1Desc: 'നെല്ല് കൊയ്ത ശേഷം പയറോ ചെറുപയറോ നടുക. ഇത് അന്തരീക്ഷത്തിലെ നൈട്രജൻ മണ്ണിൽ ചേർക്കുകയും യൂറിയ വളച്ചെലവ് 35% കുറയ്ക്കുകയും ചെയ്യുന്നു.',
    strategy2Title: 'പദ്ധതി 2: കുറഞ്ഞ വെള്ളത്തിൽ വരൾച്ചയെ പ്രതിരോധിക്കുക',
    strategy2Desc: 'മഴ കുറവാണെങ്കിൽ ചോളം, നിലക്കടല, എള്ള് എന്നിവ കൃഷി ചെയ്യുക. 40% വരെ വെള്ളം ലാഭിക്കാം.',
    strategy3Title: 'പദ്ധതി 3: പച്ചക്കറികളിലൂടെ ആഴ്ചതോറും വരുമാനം',
    strategy3Desc: 'നെല്ലിനു ശേഷം വെണ്ട അല്ലെങ്കിൽ പയർ കൃഷി ചെയ്ത് ആഴ്ചതോറും പ്രാദേശിക മാർക്കറ്റിൽ വിറ്റ് വരുമാനം നേടുക.',
    comparePlans: '3 പദ്ധതികളും താരതമ്യം ചെയ്യുക',
    singlePlan: 'ഒരു പദ്ധതി വിശദമായി കാണുക',

    // Simulator
    simulatorTitle: 'മഴയും ചൂടും മാറിയാൽ എന്ത് സംഭവിക്കും?',
    simulatorDesc: 'മഴ 20% കുറഞ്ഞാലോ കഠിനമായ ചൂട് കൂടിയാലോ വിളകളെ എങ്ങനെ ബാധിക്കുമെന്ന് മുൻകൂട്ടി കണ്ട് പരീക്ഷിക്കാം.',
    rainSlider: 'മഴയിലെ വ്യത്യാസം',
    tempSlider: 'താപനിലയിലെ മാറ്റം',
    runTestBtn: 'പരിശോധിക്കുക',

    // Assistant
    assistantTitle: 'കർഷക ശബ്ദ & സംശയ സഹായി',
    assistantDesc: 'കൃഷിയെക്കുറിച്ചുള്ള ഏത് സംശയവും ലളിതമായ ഭാഷയിൽ ചോദിക്കാം. കൃഷി ശാസ്ത്രജ്ഞരുടെ നിർദ്ദേശങ്ങൾ ലഭിക്കും.',
    askPlaceholder: 'സംശയം ചോദിക്കുക (ഉദാ: നെല്ല് കഴിഞ്ഞയുടൻ പയർ നടുന്നത് എന്തുകൊണ്ട് നല്ലതാണ്?)...',
    sendBtn: 'ചോദിക്കുക',
    listening: 'ശ്രദ്ധിക്കുന്നു, സംസാരിക്കൂ...',
    startVoice: 'സംസാരിച്ചു ചോദിക്കുക (Mic)'
  }
};
