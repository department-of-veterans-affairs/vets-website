import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { wrapWithBreadcrumb } from '../components/Breadcrumbs';
import formConfig from '../config/form';
import configService from '../utilities/configService';

import { getFormSubtitle, getFormSubmitUrlSuffix } from '../utilities/helpers';

function App({ loggedIn, location, children, formData, setFormData }) {
  const subTitle = getFormSubtitle(formData);
  const submitUrlSuffix = getFormSubmitUrlSuffix(formData);

  const { pathname } = location || {};
  const [updatedFormConfig, setUpdatedFormConfig] = useState({ ...formConfig });

  useEffect(
    () => {
      configService.setFormConfig({ subTitle });
      setUpdatedFormConfig(configService.getFormConfig());
    },
    [subTitle],
  );

  useEffect(
    () => {
      configService.setFormConfig({ submitUrlSuffix });
      setUpdatedFormConfig(configService.getFormConfig());
    },
    [submitUrlSuffix],
  );

  useEffect(
    () => {
      const defaultViewFields = {
        'view:isLoggedIn': loggedIn,
      };
      setFormData({
        ...formData,
        ...defaultViewFields,
      });
    },
    [loggedIn],
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
  formData: state.form?.data || {},
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  loggedIn: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
