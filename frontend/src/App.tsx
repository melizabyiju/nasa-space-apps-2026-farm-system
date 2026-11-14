import React, { useState, useEffect } from 'react';
import { Farm, NASAClimateData, Crop } from './types';
import { api } from './api';
import { Sidebar, navItems } from './components/Sidebar';
import { Navbar } from './components/Navbar';

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
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core Data
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [climateData, setClimateData] = useState<NASAClimateData | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loadingNASA, setLoadingNASA] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    // Load farms
    api.getFarms().then((fList) => {
      setFarms(fList);
      if (fList.length > 0) {
        setSelectedFarm(fList[0]);
      }
    }).catch(console.error);

    // Load crops
    api.getCrops().then(setCrops).catch(console.error);
  }, []);

  // Fetch NASA data whenever selectedFarm changes
  useEffect(() => {
    if (selectedFarm) {
      setLoadingNASA(true);
      api.getNASAClimate(selectedFarm.latitude, selectedFarm.longitude)
        .then(setClimateData)
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

  const activeNav = navItems.find((n) => n.id === activeTab);
  const tabTitle = activeNav ? activeNav.label : 'AGROVERSE Dashboard';

  return (
    <div className="relative min-h-screen w-full flex overflow-x-hidden font-sans bg-neutral-100">
      {/* Full-Screen FARMFLOW Landscape Background with subtle blur and 28% opacity */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: 'url(/farm-bg.jpg)',
          opacity: 0.28,
          filter: 'blur(3px)',
        }}
      />

      {/* Decorative gradient overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-amber-900/10 pointer-events-none" />

      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Floating Top Navbar */}
        <Navbar
          farms={farms}
          selectedFarm={selectedFarm}
          onSelectFarm={setSelectedFarm}
          onRefreshNASA={handleRefreshNASA}
          isRefreshing={loadingNASA}
          activeTabTitle={tabTitle}
        />

        {/* Page Content Body */}
        <main className="p-4 md:p-6 max-w-7xl w-full mx-auto pb-16">
          {selectedFarm ? (
            <>
              {activeTab === 'overview' && (
                <OverviewView 
                  farm={selectedFarm} 
                  climateData={climateData} 
                  onNavigate={setActiveTab} 
                />
              )}

              {activeTab === 'farms' && (
                <FarmsView
                  farms={farms}
                  selectedFarm={selectedFarm}
                  onSelectFarm={setSelectedFarm}
                  onRefreshFarms={handleRefreshFarms}
                />
              )}

              {activeTab === 'climate' && (
                <ClimateView farm={selectedFarm} climateData={climateData} />
              )}

              {activeTab === 'soil' && (
                <SoilView farm={selectedFarm} climateData={climateData} />
              )}

              {activeTab === 'crops' && (
                <CropExplorerView crops={crops} />
              )}

              {activeTab === 'suitability' && (
                <CropSuitabilityView farm={selectedFarm} />
              )}

              {activeTab === 'rotation' && (
                <RotationPlannerView
                  farm={selectedFarm}
                  onNavigateToSimulator={() => setActiveTab('simulator')}
                />
              )}

              {activeTab === 'simulator' && (
                <SimulatorView farm={selectedFarm} />
              )}

              {activeTab === 'assistant' && (
                <AssistantView farm={selectedFarm} />
              )}

              {activeTab === 'reports' && (
                <ReportsAndSourcesView farm={selectedFarm} climateData={climateData} mode="reports" />
              )}

              {activeTab === 'datasources' && (
                <ReportsAndSourcesView farm={selectedFarm} climateData={climateData} mode="datasources" />
              )}

              {activeTab === 'settings' && (
                <div className="glass-card p-8 border border-white/80 shadow-lg max-w-2xl">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Platform Settings & Cache Management</h3>
                  <p className="text-xs text-neutral-500 mb-6">
                    Manage NASA API query cache lifetimes and platform regional presets.
                  </p>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200">
                      <div>
                        <div className="font-bold text-neutral-800">NASA POWER Cache Duration</div>
                        <div className="text-[11px] text-neutral-500">Currently set to 48 hours for rate-limit protection</div>
                      </div>
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">48 Hours</span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200">
                      <div>
                        <div className="font-bold text-neutral-800">Default Region Profile</div>
                        <div className="text-[11px] text-neutral-500">Kerala & Humid Tropics Agrometeorological Zone</div>
                      </div>
                      <span className="font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded">Zone 11</span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/70 border border-neutral-200">
                      <div>
                        <div className="font-bold text-neutral-800">Database Engine</div>
                        <div className="text-[11px] text-neutral-500">Persistent SQLite/Spatial Store</div>
                      </div>
                      <span className="font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card p-12 text-center text-neutral-500">
              <p className="text-sm">Loading farm profiles...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
