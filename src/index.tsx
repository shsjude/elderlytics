import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';  // BrowserRouter should only be here

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Only one Router here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Log web vitals for performance monitoring
reportWebVitals();
