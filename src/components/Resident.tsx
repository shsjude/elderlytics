import React, { useState } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import residentData from '../data/tblResident.json';
import facilityData from '../data/scoutRentData.json';
import { soundex } from 'soundex-code';
import { FaPhoneAlt, FaMapMarkerAlt, FaUserCheck, FaUserClock } from 'react-icons/fa'; // Icons for status

interface ResidentProps {
  apfmID: number;
}

const Residents: React.FC<ResidentProps> = ({ apfmID }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const residentsPerPage = 9;

  // Fetch the facility associated with the current apfmID
  const facility = facilityData.find(facility => String(facility.apfmID) === String(apfmID));

  // Filter residents by facility's apfmID and search term, and only include age >= 70
  const filteredResidents = residentData
    .filter(resident => String(resident.apfmID) === String(apfmID))
    .filter(resident =>
      `${resident.firstName} ${resident.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(resident => {
      // Ensure the age is treated as a number and filter out residents under 70
      const age = parseInt(resident.age, 10);
      return !isNaN(age) && age >= 70;
    })
    .map(resident => {
      // Calculate Soundex for resident's current address and facility's address
      const residentAddressSoundex = soundex(resident.currentAddress || '');
      const facilityAddressSoundex = soundex(`${facility?.streetAddress} ${facility?.city} ${facility?.state} ${facility?.zipCode}` || '');

      // Determine whether the resident is a "client" or a "prospect"
      const status = residentAddressSoundex === facilityAddressSoundex ? 'Resident' : 'Lead';
      
      return { ...resident, status };
    });

  // Pagination logic
  const indexOfLastResident = currentPage * residentsPerPage;
  const indexOfFirstResident = indexOfLastResident - residentsPerPage;
  const currentResidents = filteredResidents.slice(indexOfFirstResident, indexOfLastResident);
  const totalPages = Math.ceil(filteredResidents.length / residentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to get color or icon based on status
  const getStatusElement = (status: string) => {
    if (status === 'Resident') {
      return (
        <span style={{ color: 'green' }}>
          <FaUserCheck /> Resident
        </span>
      );
    } else {
      return (
        <span style={{ color: 'orange' }}>
          <FaUserClock /> Lead
        </span>
      );
    }
  };

  return (
    <>
      {/* Search Input */}
      <Form.Group controlId="searchResident">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to the first page when search term changes
          }}
        />
      </Form.Group>

      {/* Show message when no residents found, but keep the search box visible */}
      {!filteredResidents.length ? (
        <p>No residents found for this facility.</p>
      ) : (
        <Table striped bordered hover responsive className="table-custom table-responsive-custom">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Age</th> {/* Added Age column */}
              <th>
                <FaMapMarkerAlt /> Current Address
              </th> {/* Add Current Address Icon */}
              <th>
                <FaMapMarkerAlt /> Prior Address
              </th> {/* Add Prior Address Icon */}
              <th>
                <FaPhoneAlt /> Phone Numbers
              </th> {/* Add Phone Icon */}
              <th>Status</th> {/* New Status Column */}
            </tr>
          </thead>
          <tbody>
            {currentResidents.map((resident, index) => (
              <tr key={index}>
                <td>{`${resident.firstName} ${resident.lastName}`}</td> {/* Full Name */}
                <td>{resident.age}</td> {/* Age */}
                {/* Display Current Address */}
                <td>
                  <FaMapMarkerAlt /> {resident.currentAddress || 'N/A'}
                </td>
                {/* Display Most Recent Prior Address (pastAddress1) */}
                <td>
                  <FaMapMarkerAlt /> {resident.pastAddress1 || 'N/A'}
                </td>
                <td style={{ textAlign: 'left' }}>
                  <div>
                    {resident.phoneNumber1 && (
                      <div>
                        <FaPhoneAlt /> {resident.phoneNumber1}
                      </div>
                    )}
                    {resident.phoneNumber2 && (
                      <div>
                        <FaPhoneAlt /> {resident.phoneNumber2}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {getStatusElement(resident.status)} {/* Display Status with Color/Icons */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {filteredResidents.length > 0 && (
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Residents;
