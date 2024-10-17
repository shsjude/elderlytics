import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';  // Use HashRouter for GitHub Pages
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
      <Router> {/* Wrap the app in HashRouter */}
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
      </Router>
    </div>
  );
};

export default App;
