import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table, Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaBed, FaMapMarkerAlt, FaBuilding, FaExternalLinkAlt } from 'react-icons/fa';
import facilityData from '../data/scoutRentData.json';
import contactsData from '../data/contactsData.json'; // Assuming you have this file
import SearchBox from '../components/SearchBox';
import SidebarFilter from '../components/SidebarFilter';
import { Line } from 'react-chartjs-2';
import { Facility } from '../types/Facility';
import PaginationComponent from '../components/PaginationComponent'; // Importing Pagination Component
import OrgChart from '../components/OrgChart'; // Importing OrgChart component for the new tab
//import Residents from '../components/Resident'; // Importing the new Residents module
import '../styles/global.css'; // Assuming your global styles file

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

// Job title categorization
const jobTitleCategories = {
  "Executive Director": /executive director/i,
  "Community Sales": /community sales|sales director|director of sales/i,
  "Vice President": /vice president|vp/i,
  "Regional Director": /regional director|area director/i,
  "C-Level Executives": /ceo|chief executive officer|president|cfo|coo|cio|chief (financial|operating|information) officer/i,
  "Other": /don|director of nursing|chief nursing officer|cno|operations|program director|strategy|analytics/i
};

// Function to match job titles to categories
const categorizeJobTitle = (jobTitle: string) => {
  for (const [category, regex] of Object.entries(jobTitleCategories)) {
    if (regex.test(jobTitle)) {
      return category;
    }
  }
  return "Other";
};

// Helper function to remove duplicates based on a unique combination of firstName, lastName, and email
const removeDuplicateContacts = (contacts: any[]) => {
  const uniqueContacts = contacts.reduce((acc, contact) => {
    const key = `${contact.firstName}-${contact.lastName}-${contact.email}`;
    if (!acc[key]) {
      acc[key] = contact;
    }
    return acc;
  }, {});
  return Object.values(uniqueContacts);
};

// Helper function to correct the ownership group if necessary
const correctOwnershipGroup = (facility: Facility | undefined) => {
  if (!facility || !facility.ownershipGroup) {
    return ''; // Return an empty string or any default value if facility or ownershipGroup is undefined
  }

  const knownOwnerships = [
    { pattern: /atria/i, correctName: 'Atria Senior Living' },
    { pattern: /brookdale/i, correctName: 'Brookdale Senior Living' },
    { pattern: /sunrise/i, correctName: 'Sunrise Senior Living' },
    { pattern: /discovery/i, correctName: 'Discovery Senior Living' },
    { pattern: /holiday/i, correctName: 'Atria Senior Living' },
    { pattern: /legend/i, correctName: 'Legend Senior Living' },
    { pattern: /morada/i, correctName: 'Morada Senior Living' },
    { pattern: /erickson/i, correctName: 'Erickson Senior Living' },
    { pattern: /five star/i, correctName: 'Five Star Senior Living' },
    { pattern: /fivestar/i, correctName: 'Five Star Senior Living' },
    { pattern: /integral/i, correctName: 'Integral Senior Living' },
    { pattern: /solstice/i, correctName: 'Integral Senior Living' },
    { pattern: /benchmark/i, correctName: 'Benchmark Senior Living' },
    { pattern: /pegasus/i, correctName: 'Pegasus Senior Living' },
  ];

  for (const ownership of knownOwnerships) {
    if (ownership.pattern.test(facility.ownershipGroup)) {
      return ownership.correctName;
    }
  }

  return facility.ownershipGroup; // Return the original if no match is found
};

const FacilityProfile: React.FC<{ showSidebar: boolean }> = ({ showSidebar }) => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredFacility, setFilteredFacility] = useState<Facility | undefined>(() =>
    facilityData.find((fac) => fac.id === parseInt(facilityId || '0'))
  );
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [view, setView] = useState<string>('card');
  const [selectedRole, setSelectedRole] = useState<string | null>(null); // Track selected role for modal
  const [showModal, setShowModal] = useState<boolean>(false); // Track modal visibility

  // Pagination state for employees tab
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [contactsPerPage] = useState<number>(10); // Display 10 contacts per page

  // Correct ownership group
  const correctedOwnershipGroup = correctOwnershipGroup(filteredFacility)?.toLowerCase() || '';

  // Filter contacts using both companyName and ownershipGroup
  const filteredContacts = removeDuplicateContacts(
    contactsData.filter(contact => {
      const companyNameLower = contact.companyName.toLowerCase();
      return companyNameLower.includes(correctedOwnershipGroup) ||
             companyNameLower.includes(filteredFacility?.facilityName.toLowerCase() || '');
    })
  );

  // Count job titles by category
  const jobTitleCounts = filteredContacts.reduce((counts: Record<string, number>, contact) => {
    const category = categorizeJobTitle(contact.jobTitle);
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

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

  // Handle KPI card click and open modal
  const handleKPIClick = (role: string) => {
    setSelectedRole(role); // Set the selected role for modal display
    setShowModal(true); // Show the modal
  };

  // Handle modal close
  const handleCloseModal = () => setShowModal(false);

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
        borderColor: '#2c3968',
        tension: 0.1,
      },
    ],
  };

  const limitedAmenities = filteredFacility?.facAmenities
    ? filteredFacility.facAmenities.split('<li>').slice(1, 26)
    : [];

  const columns: string[][] = [[], [], [], []];
  limitedAmenities.forEach((amenity, index) => {
    const colIndex = Math.floor(index / 5);
    if (columns[colIndex]) {
      columns[colIndex].push(amenity);
    }
  });

  // Pagination Logic for employees
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Filter contacts based on selected role for modal
  const contactsForSelectedRole = selectedRole
    ? filteredContacts.filter(contact => categorizeJobTitle(contact.jobTitle) === selectedRole)
    : [];

  // Filter out "N/A" care types and decide whether to render the care type section
  const careTypes = [
    filteredFacility?.careType1 !== 'N/A' ? filteredFacility?.careType1 : null,
    filteredFacility?.careType2 !== 'N/A' ? filteredFacility?.careType2 : null,
    filteredFacility?.careType3 !== 'N/A' ? filteredFacility?.careType3 : null,
  ].filter(Boolean);

  return (
    <Container fluid className="facility-dashboard" style={{ transform: 'scale(0.95)' }}>
      <Row>
        <Col md={3} className={showSidebar ? 'd-block' : 'd-none'}>
          <SidebarFilter onFilterChange={() => { }} />
        </Col>
        <Col md={9}>
          <Container>
            <SearchBox
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              facilityCount={facilityData.length}
              view={view}
              onViewChange={(newView) => setView(newView)}
              redirectToDashboard={true} // Redirect to dashboard when searching
            />

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || 'overview')}
              className="blue-tabs mb-3"
              style={{ listStyleType: 'none', paddingLeft: '0' }}
            >
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

                      {/* New section to display Care Types, only if there are valid care types */}
                      {careTypes.length > 0 && (
                        <p>
                          <strong>Care Types Provided:</strong>
                          {careTypes.map((careType, index) => (
                            <span key={index}>- {careType} <br /></span>
                          ))}
                        </p>
                      )}

                      <p><strong>Ownership Group:</strong> {correctedOwnershipGroup}</p>
                      <p><strong>Employees:</strong> 501 - 1000</p>
                      <p><strong>Total Beds:</strong> </p>
                      <p><strong>Revenue:</strong> $</p>
                    </div>

                    <div className="kpi-card-container">
                      {Object.keys(jobTitleCategories).map((role, index) => (
                        <Card className="kpi-card" key={index} onClick={() => handleKPIClick(role)}>
                          <Card.Body className="text-center">
                            <h6>{role}</h6>
                            <h4>{jobTitleCounts[role] || 0}</h4> {/* Display the actual count */}
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

              <Tab eventKey="about" title="About Us">
                <Card className="mt-3">
                  <Card.Body>
                    <h5>About {filteredFacility?.facilityName}</h5>
                    <p>{filteredFacility?.facilityProfileURL ? (
                   <a href={filteredFacility.facilityProfileURL} target="_blank" rel="noopener noreferrer">
                   <FaExternalLinkAlt /> LinkedIn Profile
                 </a>                 
                    ) : (
                      "No profile available."
                    )}</p>
                    <p><strong>Facility Bio:</strong></p>
                    <p dangerouslySetInnerHTML={{ __html: filteredFacility?.facilityBio || 'No bio available.' }} />
                    <p><strong>Amenities:</strong></p>
                    {/* Corrected section for rendering amenities */}
                    <div className="amenities-grid">
                      {columns.map((column, colIndex) => (
                        <div key={colIndex} className="amenities-column">
                          {column.map((amenity, index) => (
                            <div key={index} dangerouslySetInnerHTML={{ __html: `<li>${amenity}</li>` }} />
                          ))}
                        </div>
                      ))}
                    </div>

                    <p><strong>Overall Review:</strong> {filteredFacility?.averageReviewScore || 'N/A'}</p>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="employees" title="Employees">
                <Card className="mt-3">
                  <Card.Body>
                    <h5>Employees at {filteredFacility?.facilityName}</h5>
                    <p><strong>Total Employees:</strong> 501 - 1000</p>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Job Title</th>
                          <th>Email</th>
                          <th>Phone Numbers</th>
                          <th>LinkedIn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentContacts.map((contact, index) => (
                          <tr key={index}>
                            <td>{contact.firstName} {contact.lastName}</td>
                            <td>{contact.jobTitle}</td>
                            <td>{contact.email}</td>
                            <td>{[contact.phoneNumber1, contact.phoneNumber2, contact.phoneNumber3].filter(Boolean).join(', ')}</td>
                            <td>{contact.linkedInProfileURL ? (
                             <a href={contact.linkedInProfileURL} target="_blank" rel="noopener noreferrer">
                             <FaExternalLinkAlt /> LinkedIn Profile
                           </a>                           
                            ) : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    {/* Add Pagination Component */}
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredContacts.length / contactsPerPage)}
                      paginate={paginate}
                    />
                  </Card.Body>
                </Card>
              </Tab>

              {/* New Org Chart Tab */}
              <Tab eventKey="orgChart" title="Org Chart">
                <Card className="mt-3">
                  <Card.Body>
                    <h5>Organizational Chart for {filteredFacility?.facilityName}</h5>
                    <OrgChart contacts={filteredContacts} />
                  </Card.Body>
                </Card>
              </Tab>

          
            </Tabs>

            {/* Modal for displaying employees based on selected role */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" dialogClassName="wide-modal">
              <Modal.Header closeButton>
                <Modal.Title>{selectedRole} Employees</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-body-custom">
                <div className="table-responsive"> {/* Make the table responsive */}
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Job Title</th>
                        <th>Email</th>
                        <th>Phone Numbers</th>
                        <th>LinkedIn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactsForSelectedRole.length > 0 ? (
                        contactsForSelectedRole.map((contact, index) => (
                          <tr key={index}>
                            <td>{contact.firstName} {contact.lastName}</td>
                            <td>{contact.jobTitle}</td>
                            <td>{contact.email}</td>
                            <td>
                              {[contact.phoneNumber1, contact.phoneNumber2, contact.phoneNumber3].filter(Boolean).join(', ')}
                            </td>
                            <td>
                              {contact.linkedInProfileURL ? (
                                <a href={contact.linkedInProfileURL} target="_blank" rel="noopener noreferrer">
                                  Visit LinkedIn Profile
                                </a>
                              ) : (
                                'N/A'
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>No employees found for this role.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='button-custom' variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default FacilityProfile;