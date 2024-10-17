import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import BrowserRouter and specify basename for GitHub Pages subpath
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter basename="/elderlytics">  {/* Set basename for GitHub Pages */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Log web vitals for performance monitoring
reportWebVitals();
