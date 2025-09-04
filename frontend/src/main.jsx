import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'; // Import
import './index.css';

// Optional: Custom theme for a unique look
const theme = extendTheme({
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ChakraProvider theme={theme}> {/* Add this wrapper */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChakraProvider>
    </Router>
  </React.StrictMode>
);