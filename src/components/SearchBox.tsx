import React from 'react';
import { Form, Col, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  view: string;
  onViewChange: (view: string) => void;
  facilityCount: number; // Add facility count as a prop
  redirectToDashboard?: boolean; // New prop to handle redirection
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
  view,
  onViewChange,
  facilityCount,
  redirectToDashboard = false, // Default to false
}) => {
  const navigate = useNavigate(); // For redirection

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (redirectToDashboard && e.key === 'Enter') {
      // If redirecting, navigate to the dashboard with search term and card view in state
      navigate('/', { state: { searchTerm, view: 'card' } });
    }
  };

  return (
    <>
      <Row className="mb-2">
        <Col xs={12}>
          <p style={{ fontSize: '18px', color: 'var(--text-color)' }}>
            {facilityCount.toLocaleString()} facilities in our network.
          </p>
        </Col>
      </Row>

      <Row className="mb-4 align-items-center">
        <Col xs={12} md={8}>
          <Form.Control
            type="text"
            placeholder="Search by facility name, city, state, zip code, or ownership group..."
            value={searchTerm}
            onChange={onSearchChange}
            onKeyDown={handleKeyDown} // Handle key press for "Enter"
          />
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-end">
          <ToggleButtonGroup
            type="radio"
            name="viewToggle"
            value={view}
            onChange={onViewChange}
          >
            <ToggleButton
              id="tbg-btn-1"
              value="card"
              style={{
                backgroundColor: view === "card" ? 'var(--primary-blue)' : 'transparent',
                color: view === "card" ? 'var(--white)' : 'var(--primary-blue)',
                borderColor: 'var(--primary-blue)',
              }}
            >
              Card View
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-2"
              value="table"
              style={{
                backgroundColor: view === "table" ? 'var(--primary-blue)' : 'transparent',
                color: view === "table" ? 'var(--white)' : 'var(--primary-blue)',
                borderColor: 'var(--primary-blue)',
              }}
            >
              Table View
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
    </>
  );
};

export default SearchBox;
