import React from 'react';

const FooterComponent: React.FC = () => {
  return (
    <footer className="footer">
      <p style = {{color:'white'}}>© {new Date().getFullYear()} Safe Harbor Solutions LLC. All Rights Reserved.</p>
    </footer>
  );
};

export default FooterComponent;
