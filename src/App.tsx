import { Scene3D } from './components/Scene3D';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { GarageProvider, useGarageContext } from './contexts/GarageContext';
import { useRef } from 'react';

function AppContent() {
  const { 
    cars, 
    selectedCar, 
    setSelectedCar, 
    handleFileUpload, 
    updateCar, 
    deleteCar, 
    resetPosition,
    sceneMode,
    setSceneMode
  } = useGarageContext();
  
  const uploadInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-black" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <Scene3D />
      <Header />
      <ConfigPanel
        cars={cars}
        selectedCar={selectedCar}
        onSelectCar={setSelectedCar}
        onUpdateCar={updateCar}
        onDeleteCar={deleteCar}
        onResetPosition={resetPosition}
        onUploadClick={() => uploadInputRef.current?.click()}
        sceneMode={sceneMode}
        onSceneModeChange={setSceneMode}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = '';
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}

function App() {
  return (
    <GarageProvider>
      <AppContent />
    </GarageProvider>
  );
}

export default App;
