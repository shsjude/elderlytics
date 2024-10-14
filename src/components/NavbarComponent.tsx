import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import FilterListIcon from '@mui/icons-material/FilterList';
import shsLogo from '../image/shsLogo.png'; // Adjust the path to where your logo is stored

const NavbarComponent: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle click on the Elderlytics brand
  const handleBrandClick = () => {
    navigate('/'); // Navigate to the dashboard (main) page
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Nav className="mr-auto">
          {/* SHS Logo on the left */}
          <Navbar.Brand href="/">
            <img
              src={shsLogo}
              alt="SHS Logo"
              style={{ height: '45px', width:'170px', cursor: 'pointer' }} // Adjust the height as needed
            />
          </Navbar.Brand>

          {/* Icon that toggles the sidebar */}
          <Nav.Link onClick={onOpenSidebar} style={{ color: 'var(--white)', cursor: 'pointer' }}>
            <FilterListIcon />
          </Nav.Link>
        </Nav>

        {/* Clicking SeniorLink will now redirect to the dashboard (main) page */}
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: 'pointer', color: 'var(--white)' }}>
         ElderLytics
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
