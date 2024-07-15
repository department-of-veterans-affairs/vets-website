import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import Footer from '../../../components/common/Footer/Footer';
import Header from '../../../components/common/Header/Header';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  return (
    <>
      <Header />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <Footer />
    </>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
