import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';  // No need to import Router here
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';  // Import the global styles
import Dashboard from './pages/Dashboard';
import FacilityProfile from './pages/FacilityProfile';
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';

const App: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // Manage sidebar state at the App level

  return (
    <div className="App">
      {/* Single Navbar and Footer at App level */}
      <NavbarComponent onOpenSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="app-content">
        <Routes>
          {/* Pass the showSidebar state as a prop to both Dashboard and FacilityProfile */}
          <Route path="/" element={<Dashboard showSidebar={showSidebar} />} />
          <Route path="/facility/:facilityId" element={<FacilityProfile showSidebar={showSidebar} />} />
        </Routes>
      </div>
      <FooterComponent />
    </div>
  );
};

export default App;
