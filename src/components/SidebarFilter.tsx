import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Checkbox, ListItem, ListItemText, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Home, Elderly, LocalHospital, Apartment } from '@mui/icons-material';

const statesInUSA = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const careTypes = [
  { label: 'Independent Living', icon: <Home /> },
  { label: 'Memory Care', icon: <Elderly /> },
  { label: 'Assisted Living', icon: <LocalHospital /> },
  { label: 'Nursing Home', icon: <Home /> },
  { label: 'Home Care', icon: <Apartment /> },
  { label: 'Senior Apartment', icon: <Apartment /> }
];

const priceCategories = [
  { label: '1k - 3k', value: '1-3k' },
  { label: '3k - 5k', value: '3-5k' },
  { label: '5k - 7k', value: '5-7k' },
  { label: '7k and above', value: '7k+' },
];

interface SidebarFilterProps {
  onFilterChange: (selectedStates: string[], selectedCareTypes: string[], selectedPriceCategory: string) => void;
  initialSelectedStates?: string[];
  initialSelectedCareTypes?: string[];
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  onFilterChange,
  initialSelectedStates = [],
  initialSelectedCareTypes = [],
}) => {
  const [selectedStates, setSelectedStates] = useState<string[]>(initialSelectedStates);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>(initialSelectedCareTypes);
  const [selectedPriceCategory, setSelectedPriceCategory] = useState<string>('');

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedStates(prev =>
      checked ? [...prev, value] : prev.filter(state => state !== value)
    );
  };

  const handleCareTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedCareTypes(prev =>
      checked ? [...prev, value] : prev.filter(careType => careType !== value)
    );
  };

  const handlePriceCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPriceCategory(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedStates([]);
    setSelectedCareTypes([]);
    setSelectedPriceCategory('');
  };

  useEffect(() => {
    onFilterChange(selectedStates, selectedCareTypes, selectedPriceCategory);
  }, [selectedStates, selectedCareTypes, selectedPriceCategory, onFilterChange]);

  return (
    <div className="filter-sidebar">
      <h5>Filter by State</h5>
      <Form>
        <Row>
          {statesInUSA.map(state => (
            <Col xs={4} key={state}>
              <Form.Check
                type="checkbox"
                label={state}
                value={state}
                onChange={handleStateChange}
                checked={selectedStates.includes(state)}
                className="form-checkbox"
              />
            </Col>
          ))}
        </Row>
      </Form>
      <hr />
      <h5>Filter by Care Type</h5>
      <Form>
        <Row className="care-types-grid">
          {careTypes.map(careType => (
            <Col key={careType.label}>
              <ListItem>
                <Checkbox
                  value={careType.label}
                  onChange={handleCareTypeChange}
                  checked={selectedCareTypes.includes(careType.label)}
                  icon={careType.icon}
                />
                <ListItemText primary={careType.label} />
              </ListItem>
            </Col>
          ))}
        </Row>
      </Form>
      <hr />
      <h5>Filter by Price</h5>
      <Form>
        <RadioGroup value={selectedPriceCategory} onChange={handlePriceCategoryChange}>
          {priceCategories.map(price => (
            <FormControlLabel
              key={price.value}
              value={price.value}
              control={<Radio />}
              label={price.label}
            />
          ))}
        </RadioGroup>
      </Form>
      <hr />
      <Button variant="outline-secondary" onClick={handleClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};

export default SidebarFilter;
