import React, { useContext } from 'react';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Outlet, useLoaderData } from 'react-router-dom';
import { UserProvider, UserContext } from '../context/UserContext';
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

const App = () => {
  const user = useLoaderData();

  return (
    <UserProvider initialUser={user}>
      <div className="container">
        <Header />
        <AppContent />
        <Footer />
      </div>
    </UserProvider>
  );
};

export default App;
