import React, { useContext } from 'react';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Outlet } from 'react-router-dom-v5-compat';
import { UserProvider, UserContext } from '../context/UserContext';
import { AppProvider } from '../context/AppContext';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';

const AppContent = () => {
  const { isUserLoading, error } = useContext(UserContext);

  if (isUserLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading user information..." />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <Outlet />;
};

const App = () => (
  <AppProvider>
    <UserProvider>
      <div className="container">
        <Header />
        <AppContent />
        <Footer />
      </div>
    </UserProvider>
  </AppProvider>
);

export default App;
