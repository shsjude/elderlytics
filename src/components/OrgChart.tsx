import React from 'react';
import { Card } from 'react-bootstrap';
import { FaPhoneAlt, FaEnvelope, FaLinkedin } from 'react-icons/fa'; // Import icons
import '../styles/global.css'; // Ensure you have the corresponding CSS

// Job title categorization logic
const jobTitleCategories = {
  "Executive Director": /executive director/i,
  "Community Sales": /community sales|sales director|director of sales/i,
  "Vice President": /vice president|vp/i,
  "Regional Director": /regional director|area director/i,
  "C-Level Executives": /ceo|chief executive officer|president|cfo|coo|cio|chief (financial|operating|information) officer/i,
  "Other": /don|director of nursing|chief nursing officer|cno|operations|program director|strategy|analytics/i,
};

// Helper function to categorize job titles
const categorizeJobTitle = (jobTitle: string) => {
  for (const [category, regex] of Object.entries(jobTitleCategories)) {
    if (regex.test(jobTitle)) {
      return category;
    }
  }
  return "Other";
};

const OrgChart: React.FC<{ contacts: any[] }> = ({ contacts }) => {
  // Group contacts by their categorized job titles
  const groupedContacts = contacts.reduce((acc: any, contact) => {
    const category = categorizeJobTitle(contact.jobTitle);
    if (!acc[category]) acc[category] = [];
    acc[category].push(contact);
    return acc;
  }, {});

  // Sorting the hierarchy levels
  const hierarchyOrder = [
    'C-Level Executives',
    'Vice President',
    'Executive Director',
    'Regional Director',
    'Community Sales',
    'Other',
  ];

  return (
    <div className="org-chart">
      {hierarchyOrder.map((category, index) => (
        <div key={category} className={`org-level org-level-${index}`}>
          <h5 className="org-category-title">{category}</h5>
          <hr className="category-divider" /> {/* Horizontal line separating each category */}
          <div className="org-category">
            {groupedContacts[category]?.map((contact: any, idx: number) => (
              <Card key={idx} className="org-card">
                <p><strong>{contact.firstName} {contact.lastName}</strong></p>
                <p>{contact.jobTitle}</p>

                {/* Email with icon */}
                {contact.email && (
                  <p>
                    <FaEnvelope style={{ marginRight: '8px' }} />
                    <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer">
                      {contact.email}
                    </a>
                  </p>
                )}

                {/* Display phone numbers with a single icon */}
                {([contact.phoneNumber1, contact.phoneNumber2, contact.phoneNumber3].filter(Boolean).length > 0) && (
                  <p>
                    <FaPhoneAlt style={{ marginRight: '8px' }} />
                    {[contact.phoneNumber1, contact.phoneNumber2, contact.phoneNumber3].filter(Boolean).join(', ')}
                  </p>
                )}

                {/* LinkedIn with icon */}
                {contact.linkedInProfileURL && (
                  <p>
                    <FaLinkedin style={{ marginRight: '8px', color: '#0e76a8' }} />
                    <a href={contact.linkedInProfileURL} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrgChart;
