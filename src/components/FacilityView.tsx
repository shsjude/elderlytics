import React from 'react';
import { Col, Row, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { FaBed, FaDollarSign } from 'react-icons/fa';
import { Facility } from '../types/Facility';

interface FacilityViewProps {
  facilities: Facility[];
  view: string;
}

const LinkButton: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <Button className="button-custom">
      {children}
    </Button>
  </Link>
);

const FacilityView: React.FC<FacilityViewProps> = ({ facilities, view }) => {
  const getCareTypes = (facility: Facility) => {
    return [facility.careType1, facility.careType2, facility.careType3].filter(type => type !== 'N/A');
  };

  const getRoomTypesAndRates = (facility: Facility) => {
    return [
      { roomType: facility.roomType1, rentalRate: facility.roomType1Price },
      { roomType: facility.roomType2, rentalRate: facility.roomType2Price },
      { roomType: facility.roomType3, rentalRate: facility.roomType3Price },
    ].filter(({ roomType, rentalRate }) => roomType !== 'N/A' && rentalRate !== 'N/A');
  };

  if (view === 'card') {
    return (
      <Row>
        {facilities.map(facility => (
          <Col xs={12} sm={6} md={4} key={facility.id}>
            <Card className="card">
              <Card.Body>
                <Card.Title>{facility.facilityName}</Card.Title>
                <Card.Text>{facility.city}, {facility.state}, {facility.zipCode}</Card.Text>
                <Card.Text><strong>Care Types:</strong> {getCareTypes(facility).join(', ')}</Card.Text>
                <Card.Text><strong>Room Types and Rates:</strong></Card.Text>
                <ul>
                  {getRoomTypesAndRates(facility).map(({ roomType, rentalRate }, index) => (
                    <li key={index}><FaBed /> {roomType} - <FaDollarSign /> ${rentalRate}</li>
                  ))}
                </ul>
                <LinkButton to={`/facility/${facility.id}`}>View Details</LinkButton>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead style={{ backgroundColor: 'var(--primary-blue)', color: 'white' }}>
        <tr>
          <th>Facility Name</th>
          <th>Location</th>
          <th>Care Types</th>
          <th>Room Types and Rates</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {facilities.map(facility => (
          <tr key={facility.id}>
            <td>{facility.facilityName}</td>
            <td>{facility.city}, {facility.state}, {facility.zipCode}</td>
            <td>
              <ul>
                {getCareTypes(facility).map((careType, index) => (
                  <li key={index}>{careType}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul>
                {getRoomTypesAndRates(facility).map(({ roomType, rentalRate }, index) => (
                  <li key={index}><FaBed /> {roomType} - <FaDollarSign /> ${rentalRate}</li>
                ))}
              </ul>
            </td>
            <td>
              <LinkButton to={`/facility/${facility.id}`}>View Details</LinkButton>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default FacilityView;
