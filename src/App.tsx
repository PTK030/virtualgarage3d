import { Scene3D } from './components/Scene3D';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { ToastContainer } from './components/ToastContainer';
import { GarageProvider, useGarageContext } from './contexts/GarageContext';
import { EffectsProvider } from './contexts/EffectsContext';
import { useRef } from 'react';
import './utils/debugStorage'; // Enable debug functions

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
    setSceneMode,
    cameraMode,
    setCameraMode,
    exploreSubMode,
    setExploreSubMode,
    saveGarage,
    clearGarage,
    toasts,
    showToast,
    removeToast
  } = useGarageContext();
  
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleSaveGarage = () => {
    const success = saveGarage();
    if (success) {
      showToast('Garage saved successfully!', 'success');
    } else {
      showToast('Failed to save garage', 'error');
    }
  };

  const handleClearGarage = () => {
    const success = clearGarage();
    if (success) {
      showToast('Garage cleared successfully!', 'success');
    } else {
      showToast('Failed to clear garage', 'error');
    }
  };

  const handleFileUploadWithToast = (file: File) => {
    try {
      handleFileUpload(file);
      showToast(`Model "${file.name}" uploaded successfully!`, 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload model', 'error');
    }
  };

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
        cameraMode={cameraMode}
        onCameraModeChange={setCameraMode}
        exploreSubMode={exploreSubMode}
        onExploreSubModeChange={setExploreSubMode}
        onSaveGarage={handleSaveGarage}
        onClearGarage={handleClearGarage}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <input
        ref={uploadInputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Log file type for debugging
            const isGLB = file.name.toLowerCase().endsWith('.glb');
            console.log(`📁 Uploading ${isGLB ? 'GLB' : 'GLTF'} file:`, file.name, 'Size:', Math.round(file.size / 1024), 'KB');
            handleFileUploadWithToast(file);
          }
          e.target.value = '';
        }}
        style={{ display: 'none' }}
        title="Upload 3D models (.glb preferred for better performance)"
      />
    </div>
  );
}

function App() {
  return (
    <GarageProvider>
      <EffectsProvider>
        <AppContent />
      </EffectsProvider>
    </GarageProvider>
  );
}

export default App;
