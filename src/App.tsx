import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';  // Use HashRouter for GitHub Pages
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';  // Import the global styles
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FacilityProfile = lazy(() => import('./pages/FacilityProfile'));

const App: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // Manage sidebar state at the App level

  return (
    <div className="App">
      <Router> {/* Wrap the app in HashRouter */}
        <NavbarComponent onOpenSidebar={() => setShowSidebar(!showSidebar)} />
        <div className="app-content">
          <Suspense fallback={<div>Loading...</div>}>  {/* Suspense for lazy-loaded components */}
            <Routes>
              <Route path="/" element={<Dashboard showSidebar={showSidebar} />} />
              <Route path="/facility/:facilityId" element={<FacilityProfile showSidebar={showSidebar} />} />
            </Routes>
          </Suspense>
        </div>
        <FooterComponent />
      </Router>
    </div>
  );
};

export default App;
