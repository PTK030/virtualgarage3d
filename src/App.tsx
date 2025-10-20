import { Scene3D } from './components/Scene3D';
import { Header } from './components/Header';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Header />
      <Scene3D />
    </div>
  );
}

export default App;
