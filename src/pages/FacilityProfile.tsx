import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaUser, FaBed, FaMapMarkerAlt, FaBuilding, FaExternalLinkAlt } from 'react-icons/fa';
import facilityData from '../data/scoutRentData.json';
import SearchBox from '../components/SearchBox';
import SidebarFilter from '../components/SidebarFilter';
import { Line } from 'react-chartjs-2';
import { Facility } from '../types/Facility';
import '../styles/global.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FacilityProfile: React.FC<{ showSidebar: boolean }> = ({ showSidebar }) => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredFacility, setFilteredFacility] = useState<Facility | undefined>(() =>
    facilityData.find((fac) => fac.id === parseInt(facilityId || '0'))
  );
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [view, setView] = useState<string>('card');

  useEffect(() => {
    if (searchTerm) {
      const closestFacility = facilityData.find(fac =>
        fac.facilityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFacility(closestFacility);
    } else {
      setFilteredFacility(facilityData.find((fac) => fac.id === parseInt(facilityId || '0')));
    }
  }, [searchTerm, facilityId]);

  if (!filteredFacility) return <div>No facility found matching your search.</div>;

  // Helper function to clean and parse prices
  const parsePrice = (price: string | undefined) => {
    if (!price || price === 'N/A') return 'N/A';
    return `$${parseFloat(price.replace(/[^0-9.-]+/g, '')).toLocaleString()}`;
  };

  const employeeGrowthData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Employee Growth Rate',
        data: [750, 760, 770, 780, 785, 800, 820, 840, 860, 880, 900, 920],
        fill: false,
        borderColor: '#2c3968',  // Updated to match the primary theme color
        tension: 0.1,
      },
    ],
  };
  

  // Split and limit amenities to display only 25 items, 5 per column
  const limitedAmenities = filteredFacility?.facAmenities
    ? filteredFacility.facAmenities.split('<li>').slice(1, 26) // Get first 25 items
    : [];

  const columns: string[][] = [[], [], [], []]; // Ensure columns is initialized with 4 empty arrays
  limitedAmenities.forEach((amenity, index) => {
    const colIndex = Math.floor(index / 5); // Calculate column index (0-3 for 4 columns)
    if (columns[colIndex]) {
      columns[colIndex].push(amenity);
    }
  });

  return (
    <Container fluid className="facility-dashboard" style={{ transform: 'scale(0.95)' }}>
      <Row>
        <Col md={3} className={showSidebar ? 'd-block' : 'd-none'}>
          <SidebarFilter onFilterChange={() => {}} />
        </Col>
        <Col md={9}>
          <Container>
            <SearchBox
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              facilityCount={facilityData.length}
              view={view}
              onViewChange={(newView) => setView(newView)}
            />

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || 'overview')}
              className="blue-tabs mb-3"
              style={{ listStyleType: 'none', paddingLeft: '0' }}
            >
              {/* Overview Tab */}
              <Tab eventKey="overview" title="Overview">
                <Card className="mt-3">
                  <Card.Body>
                    <div className="facility-info">
                      <p>
                        <FaBuilding /> <strong>Facility:</strong> {filteredFacility?.facilityName}
                      </p>

                      <p>
                        <FaMapMarkerAlt /> <strong>Location:</strong> {filteredFacility?.streetAddress}, {filteredFacility?.city}, {filteredFacility?.state}, {filteredFacility?.zipCode}
                      </p>

                      <p>
                        <FaBed /> <strong>Room Types and Rates:</strong>
                        {filteredFacility?.roomType1 && filteredFacility?.roomType1Price !== 'N/A' ? (
                          <span>
                            - {filteredFacility.roomType1}: {parsePrice(filteredFacility.roomType1Price)} <br />
                          </span>
                        ) : (
                          <span>- {filteredFacility?.roomType1 || 'Room Type 1'}: N/A <br /></span>
                        )}
                        {filteredFacility?.roomType2 && filteredFacility?.roomType2Price !== 'N/A' ? (
                          <span>
                            - {filteredFacility.roomType2}: {parsePrice(filteredFacility.roomType2Price)} <br />
                          </span>
                        ) : (
                          <span>- {filteredFacility?.roomType2 || 'Room Type 2'}: N/A <br /></span>
                        )}
                        {filteredFacility?.roomType3 && filteredFacility?.roomType3Price !== 'N/A' ? (
                          <span>
                            - {filteredFacility.roomType3}: {parsePrice(filteredFacility.roomType3Price)} <br />
                          </span>
                        ) : (
                          <span>- {filteredFacility?.roomType3 || 'Room Type 3'}: N/A <br /></span>
                        )}
                      </p>

                      <p><strong>Ownership Group:</strong> {filteredFacility?.ownershipGroup}</p>
                      <p><strong>Employees:</strong> 501 - 1000</p>
                      <p><strong>Total Beds:</strong> 125</p>
                      <p><strong>Revenue:</strong> $108.5M</p>
                    </div>

                    <div className="kpi-card-container">
                      {['Executive Director', 'DON', 'Community Sales', 'VP', 'Regional Director', 'C-Level'].map((role, index) => (
                        <Card className="kpi-card" key={index}>
                          <Card.Body className="text-center">
                            <h6>{role}</h6>
                            <h4>{Math.floor(Math.random() * 50) + 1}</h4> {/* Placeholder values */}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>

                    <h6 className="mt-3"><strong>Employee Growth Rate:</strong></h6>
                    <div className="chart-container" style={{ display: 'flex', justifyContent: 'center' }}>
                      <Line data={employeeGrowthData} />
                    </div>
                  </Card.Body>
                </Card>
              </Tab>

              {/* About Us Tab */}
              <Tab eventKey="about" title="About Us">
                <Card className="mt-3">
                  <Card.Body>
                    <h5>About {filteredFacility?.facilityName}</h5>
                    <p>{filteredFacility?.facilityProfileURL ? (
                      <a href={filteredFacility.facilityProfileURL} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt /> Visit our profile
                      </a>
                    ) : (
                      "No profile available."
                    )}</p>
                    <p><strong>Facility Bio:</strong></p>
                    <p dangerouslySetInnerHTML={{ __html: filteredFacility?.facilityBio || 'No bio available.' }} />
                    <p><strong>Amenities:</strong></p>
                    <div className="amenities-grid">
                      {columns.map((column, colIndex) => (
                        <div key={colIndex} className="amenities-column">
                          {column.map((amenity, index) => (
                            <div key={index} dangerouslySetInnerHTML={{ __html: `<li>${amenity}` }} />
                          ))}
                        </div>
                      ))}
                    </div>
                    <p><strong>Overall Review:</strong> {filteredFacility?.averageReviewScore || 'N/A'}</p>
                  </Card.Body>
                </Card>
              </Tab>

              {/* Employees Tab */}
              <Tab eventKey="employees" title="Employees">
                <Card className="mt-3">
                  <Card.Body>
                    <h5>Employees at {filteredFacility?.facilityName}</h5>
                    <p><strong>Total Employees:</strong> 501 - 1000</p>
                    <p><strong>Key Roles:</strong></p>
                    <ul>
                      <li>Executive Director</li>
                      <li>Director of Nursing</li>
                      <li>Community Sales</li>
                      <li>Vice President</li>
                      <li>Regional Director</li>
                      <li>C-Level Executives</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default FacilityProfile;
