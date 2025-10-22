import { Scene3D } from './components/Scene3D';
import { Header } from './components/Header';
import { UploadPanel } from './components/UploadPanel';
import { GarageProvider, useGarageContext } from './contexts/GarageContext';

function AppContent() {
  const { handleFileUpload } = useGarageContext();
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-black" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <Scene3D />
      <Header />
      <UploadPanel onFileUpload={handleFileUpload} />
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
