import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../../utils/helpers';
import Breadcrumbs from '../components/Breadcrumbs';
import manifest from '../manifest.json';
import { TITLE } from '../constants';
import { fetchPersonalInformation } from '../actions';

function App({
  location,
  children,
  userLoggedIn,
  getPersonalInformation,
  user,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);

  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      ['date-released-from-active-duty', 'training-provider-start-date'],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
    document.title = `${TITLE} | Veterans Affairs`;
  });

  useEffect(
    () => {
      if (!userLoggedIn && location.pathname !== '/introduction') {
        window.location.href = manifest.rootUrl;
      }
    },
    [userLoggedIn, location],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }
    },
    [fetchedUserInfo, getPersonalInformation, user?.login?.currentlyLoggedIn],
  );

  return (
    <div className="form-22-10297-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  getPersonalInformation: PropTypes.func,
  location: PropTypes.object,
  user: PropTypes.object,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  userLoggedIn: isLoggedIn(state),
  user: state.user,
});

const mapDispatchToProps = {
  getPersonalInformation: fetchPersonalInformation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
