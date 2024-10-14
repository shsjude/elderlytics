import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Import to handle redirection state
import facilityData from '../data/scoutRentData.json';
import SearchBox from '../components/SearchBox';
import FacilityView from '../components/FacilityView';
import PaginationComponent from '../components/PaginationComponent';
import SidebarFilter from '../components/SidebarFilter';
import { Facility } from '../types/Facility';

interface DashboardProps {
  showSidebar: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ showSidebar }) => {
  const location = useLocation();
  const searchState = location.state as { searchTerm?: string, view?: string }; // Read redirected search state

  const [searchTerm, setSearchTerm] = useState<string>(searchState?.searchTerm || ''); // Initialize with redirected term
  const [currentPage, setCurrentPage] = useState<number>(1); // Tracks the current page for pagination
  const [facilitiesPerPage, setFacilitiesPerPage] = useState<number>(6); // Items per page
  const [view, setView] = useState<string>(searchState?.view || 'card'); // Initialize with redirected view
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]); // Filtered facilities
  const [selectedStates, setSelectedStates] = useState<string[]>([]); // Selected states for filtering
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]); // Selected care types for filtering

  // Initial sorting of facilities based on available data
  useEffect(() => {
    const sortedFacilities = facilityData.sort((a, b) => {
      const hasFullDataA = a.roomType1 && a.roomType1Price && a.careType1;
      const hasFullDataB = b.roomType1 && b.roomType1Price && b.careType1;
      return hasFullDataA === hasFullDataB ? 0 : hasFullDataA ? -1 : 1;
    });
    setFilteredFacilities(sortedFacilities);
  }, []);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to page 1 when searching
  };

  // Handle filter changes (state, care types, and price category)
  const handleFilterChange = useCallback((selectedStates: string[], selectedCareTypes: string[], selectedPriceCategory: string) => {
    setSelectedStates(selectedStates);
    setSelectedCareTypes(selectedCareTypes);

    let filtered = facilityData;

    // Filter by selected states
    if (selectedStates.length > 0) {
      filtered = filtered.filter(facility => selectedStates.includes(facility.state));
    }

    // Filter by care types
    if (selectedCareTypes.length > 0) {
      filtered = filtered.filter(facility =>
        [facility.careType1, facility.careType2, facility.careType3].some(careType =>
          selectedCareTypes.includes(careType)
        )
      );
    }

    // Filter by price category
    if (selectedPriceCategory) {
      filtered = filtered.filter(facility => {
        const roomPrices = [
          parseFloat(facility.roomType1Price.replace(/[^0-9.-]+/g, '')) || 0,
          parseFloat(facility.roomType2Price.replace(/[^0-9.-]+/g, '')) || 0,
          parseFloat(facility.roomType3Price.replace(/[^0-9.-]+/g, '')) || 0,
        ];
        const minPrice = Math.min(...roomPrices.filter(price => price > 0));

        // Filter based on selected price range
        switch (selectedPriceCategory) {
          case '1-3k':
            return minPrice >= 1000 && minPrice <= 3000;
          case '3-5k':
            return minPrice > 3000 && minPrice <= 5000;
          case '5-7k':
            return minPrice > 5000 && minPrice <= 7000;
          case '7k+':
            return minPrice > 7000;
          default:
            return true;
        }
      });
    }

    setFilteredFacilities(filtered);
  }, []);

  // Filter facilities by search term for facility name, city, state, zipcode, and ownership group
  const filteredBySearch = filteredFacilities.filter(facility =>
    facility.facilityName.toLowerCase().includes(searchTerm) ||
    facility.city.toLowerCase().includes(searchTerm) ||
    facility.state.toLowerCase().includes(searchTerm) ||
    facility.zipCode.toString().includes(searchTerm) ||
    facility.ownershipGroup?.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastFacility = currentPage * facilitiesPerPage;
  const indexOfFirstFacility = indexOfLastFacility - facilitiesPerPage;
  const currentFacilities = filteredBySearch.slice(indexOfFirstFacility, indexOfLastFacility);

  const totalPages = Math.ceil(filteredBySearch.length / facilitiesPerPage);

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3} className={showSidebar ? 'd-block' : 'd-none'}>
          <SidebarFilter
            onFilterChange={handleFilterChange}
            initialSelectedStates={selectedStates}
            initialSelectedCareTypes={selectedCareTypes}
          />
        </Col>
        <Col md={9}>
          <Container className="main-content">
            <Typography variant="h4" gutterBottom>
            Facility Dashboard
            </Typography>

            <SearchBox
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              view={view}
              onViewChange={(val: string) => {
                setView(val);
                setFacilitiesPerPage(val === 'table' ? 6 : 6);
              }}
              facilityCount={filteredBySearch.length}
            />

            <FacilityView facilities={currentFacilities} view={view} />

            <Row>
              <Col className="d-flex justify-content-center">
                <PaginationComponent currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
