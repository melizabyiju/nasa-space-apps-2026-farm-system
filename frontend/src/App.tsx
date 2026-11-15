import React, { useState, useEffect } from 'react';
import { Farm, NASAClimateData, Crop } from './types';
import { api } from './api';
import { DEFAULT_FARMS, FALLBACK_CLIMATE, DEFAULT_CROPS } from './fallbackData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { translations, Language } from './translations';
import { UserAccount, getActiveUser } from './userAccounts';

// Views
import { OverviewView } from './views/OverviewView';
import { FarmsView } from './views/FarmsView';
import { ClimateView } from './views/ClimateView';
import { SoilView } from './views/SoilView';
import { CropExplorerView } from './views/CropExplorerView';
import { CropSuitabilityView } from './views/CropSuitabilityView';
import { RotationPlannerView } from './views/RotationPlannerView';
import { SimulatorView } from './views/SimulatorView';
import { AssistantView } from './views/AssistantView';
import { ReportsAndSourcesView } from './views/ReportsAndSourcesView';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const [currentUser, setCurrentUser] = useState<UserAccount>(getActiveUser());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core Data initialized immediately with valid fallback data for zero initial render lag
  const [farms, setFarms] = useState<Farm[]>(DEFAULT_FARMS);
  const [selectedFarm, setSelectedFarm] = useState<Farm>(DEFAULT_FARMS[0]);
  const [climateData, setClimateData] = useState<NASAClimateData>(FALLBACK_CLIMATE);
  const [crops, setCrops] = useState<Crop[]>(DEFAULT_CROPS);
  const [loadingNASA, setLoadingNASA] = useState<boolean>(false);

  // Initial load: sync fresh data quietly in background
  useEffect(() => {
    api.getFarms().then((fList) => {
      if (Array.isArray(fList) && fList.length > 0) {
        setFarms(fList);
        setSelectedFarm((prev) => {
          const match = fList.find((f) => f.id === prev.id);
          return match || fList[0];
        });
      }
    }).catch(console.error);

    api.getCrops().then((cList) => {
      if (Array.isArray(cList) && cList.length > 0) {
        setCrops(cList);
      }
    }).catch(console.error);
  }, []);

  // Fetch NASA data whenever selectedFarm changes
  useEffect(() => {
    if (selectedFarm) {
      setLoadingNASA(true);
      api.getNASAClimate(selectedFarm.latitude, selectedFarm.longitude)
        .then((data) => {
          if (data) setClimateData(data);
        })
        .catch(console.error)
        .finally(() => setLoadingNASA(false));
    }
  }, [selectedFarm?.id, selectedFarm?.latitude, selectedFarm?.longitude]);

  const handleRefreshNASA = () => {
    if (selectedFarm) {
      setLoadingNASA(true);
      api.getNASAClimate(selectedFarm.latitude, selectedFarm.longitude)
        .then(setClimateData)
        .catch(console.error)
        .finally(() => setLoadingNASA(false));
    }
  };

  const handleRefreshFarms = () => {
    api.getFarms().then((fList) => {
      setFarms(fList);
      if (selectedFarm) {
        const updated = fList.find(f => f.id === selectedFarm.id);
        if (updated) setSelectedFarm(updated);
      }
    }).catch(console.error);
  };

  const tabTitle = t.nav[activeTab as keyof typeof t.nav] || t.appName;

  return (
    <div className="relative h-screen w-screen overflow-hidden flex bg-neutral-100 font-sans">
      {/* FarmFlow Scenic Countryside & Farmhouse Background with subtle transparency */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-700"
        style={{
          backgroundImage: 'url(/farmflow-bg.jpg)',
          opacity: 0.22,
        }}
      />

      {/* Light subtle overlay preserving crystal clear glass card readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white/30 via-transparent to-emerald-950/5 pointer-events-none" />

      {/* Stationary Left Sidebar: stays in place while user browses */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        lang={lang}
      />

      {/* Main Container: Fixed Layout Structure */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Fixed Top Navigation Bar */}
        <Navbar
          farms={farms}
          selectedFarm={selectedFarm}
          onSelectFarm={setSelectedFarm}
          activeTabTitle={tabTitle}
          lang={lang}
          onToggleLang={setLang}
          currentUser={currentUser}
          onUserChanged={setCurrentUser}
        />

        {/* Scrollable Content Pane ONLY */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 pb-16 max-w-7xl w-full mx-auto">
          {selectedFarm ? (
            <>
              {activeTab === 'overview' && (
                <OverviewView 
                  farm={selectedFarm} 
                  climateData={climateData} 
                  onNavigate={setActiveTab} 
                  lang={lang}
                />
              )}

              {activeTab === 'farms' && (
                <FarmsView
                  farms={farms}
                  selectedFarm={selectedFarm}
                  onSelectFarm={setSelectedFarm}
                  onRefreshFarms={handleRefreshFarms}
                  lang={lang}
                />
              )}

              {activeTab === 'climate' && (
                <ClimateView farm={selectedFarm} climateData={climateData} lang={lang} />
              )}

              {activeTab === 'soil' && (
                <SoilView farm={selectedFarm} climateData={climateData} lang={lang} />
              )}

              {activeTab === 'crops' && (
                <CropExplorerView crops={crops} lang={lang} />
              )}

              {activeTab === 'suitability' && (
                <CropSuitabilityView farm={selectedFarm} lang={lang} />
              )}

              {activeTab === 'rotation' && (
                <RotationPlannerView
                  farm={selectedFarm}
                  onNavigateToSimulator={() => setActiveTab('simulator')}
                  lang={lang}
                />
              )}

              {activeTab === 'simulator' && (
                <SimulatorView farm={selectedFarm} lang={lang} />
              )}

              {activeTab === 'assistant' && (
                <AssistantView farm={selectedFarm} lang={lang} currentUser={currentUser} />
              )}

              {activeTab === 'reports' && (
                <ReportsAndSourcesView farm={selectedFarm} climateData={climateData} mode="reports" />
              )}

              {activeTab === 'datasources' && (
                <ReportsAndSourcesView farm={selectedFarm} climateData={climateData} mode="datasources" />
              )}

              {activeTab === 'settings' && (
                <div className="glass-card p-8 border border-white/80 shadow-md max-w-2xl">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {lang === 'ml' ? 'ആപ്ലിക്കേഷൻ സെറ്റിംഗ്സ്' : 'Application Settings & Regional Presets'}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6">
                    {lang === 'ml'
                      ? 'നാസ വിവരങ്ങൾ 48 മണിക്കൂർ കാഷെ ചെയ്തു സൂക്ഷിക്കുന്നു.'
                      : 'NASA Earth observations are stored with 48-hour local cache to protect API limits.'}
                  </p>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-neutral-200">
                      <div>
                        <div className="font-bold text-neutral-800">Language Mode</div>
                        <div className="text-[11px] text-neutral-500">English / മലയാളം</div>
                      </div>
                      <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
                        {lang === 'ml' ? 'മലയാളം' : 'English'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-neutral-200">
                      <div>
                        <div className="font-bold text-neutral-800">NASA POWER Cache</div>
                        <div className="text-[11px] text-neutral-500">48-Hour Persistent Store</div>
                      </div>
                      <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">Active</span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-neutral-200">
                      <div>
                        <div className="font-bold text-neutral-800">Agrometeorological Region</div>
                        <div className="text-[11px] text-neutral-500">Kerala & Humid Tropics (ICAR Zone 11)</div>
                      </div>
                      <span className="font-bold text-neutral-700 bg-neutral-100 px-2 py-1 rounded">Zone 11</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card p-12 text-center text-neutral-500">
              <p className="text-sm font-semibold">Loading farm data...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
