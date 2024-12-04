import './App.css';
import { Outlet } from 'react-router-dom';

import BottomTab from './components/BottomTab.tsx';
import Navbar from './components/Navbar.tsx';

function App() {
  return (
    <>
      <Navbar />
      <div className="WhiteboardsViewPort">
        <Outlet />
      </div>
      <BottomTab />
    </>
  );
}

export default App;
