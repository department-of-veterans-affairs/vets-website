import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { setData } from 'platform/forms-system/src/js/actions';

import { wrapWithBreadcrumb } from '../components/Breadcrumbs';
import formConfig from '../config/form';
import configService from '../utilities/configService';
import { getFormSubtitle } from '../utilities/helpers';

import useV2FeatureToggle from '../hooks/useV2FeatureVisibility';

function App({ loggedIn, location, children, formData, setFormData }) {
  const subTitle = getFormSubtitle(formData);

  const v2FeatureToggle = useV2FeatureToggle();

  const { pathname } = location || {};
  const [updatedFormConfig, setUpdatedFormConfig] = useState({ ...formConfig });

  useEffect(
    () => {
      if (!pathname?.includes('introduction')) {
        scrollTo('topScrollElement');
      }
    },
    [pathname],
  );

  // dynamically updates the form subtitle to 21-22 or 21-22A
  useEffect(
    () => {
      configService.setFormConfig({ subTitle });
      setUpdatedFormConfig(configService.getFormConfig());
    },
    [subTitle],
  );

  useEffect(
    () => {
      const updatedFormData = {
        ...formData,
        v2IsEnabled: v2FeatureToggle,
        'view:isLoggedIn': loggedIn,
        'view:representativeQueryInput': '',
        'view:representativeSearchResults': [],
      };
      setFormData(updatedFormData);
    },
    [v2FeatureToggle, loggedIn],
  );

  const content = (
    <RoutedSavableApp formConfig={updatedFormConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  return wrapWithBreadcrumb(
    <article id="form-21-22" data-location={`${pathname?.slice(1)}`}>
      {content}
    </article>,
  );
}

const mapStateToProps = state => ({
  profile: state.user.profile,
  formData: state.form?.data,
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  location: PropTypes.object,
  loggedIn: PropTypes.bool,
  setFormData: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
