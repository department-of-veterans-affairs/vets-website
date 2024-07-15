import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import { fetchUser } from '../../../actions/user';
import Footer from '../../../components/common/Footer/Footer';
import Header from '../../../components/common/Header/Header';
import { selectUserIsLoading } from '../../../selectors/user';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserIsLoading);

  useEffect(
    () => {
      dispatch(fetchUser());
    },
    [dispatch],
  );

  return (
    <>
      <Header />
      {isLoading ? (
        <VaLoadingIndicator message="Loading user information..." />
      ) : (
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      )}
      <Footer />
    </>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
