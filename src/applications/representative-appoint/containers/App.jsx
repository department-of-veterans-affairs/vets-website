import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { wrapWithBreadcrumb } from '../components/Breadcrumbs';
import formConfig from '../config/form';
import configService from '../utilities/configService';

import { getFormSubtitle } from '../utilities/helpers';

function App({ loggedIn, location, children, formData, setFormData }) {
  const subTitle = getFormSubtitle(formData);

  const { pathname } = location || {};
  const [updatedFormConfig, setUpdatedFormConfig] = useState({ ...formConfig });

  const isPostLogin = document.location.search?.includes('postLogin=true');

  useEffect(
    () => {
      if (isPostLogin) {
        window.location.replace(
          '/get-help-from-accredited-representative/appoint-rep',
        );
      }
    },
    [isPostLogin],
  );

  useEffect(
    () => {
      configService.setFormConfig({ subTitle });
      setUpdatedFormConfig(configService.getFormConfig());
    },
    [subTitle],
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

  // resetting user query between sessions
  useEffect(() => {
    setFormData({
      ...formData,
      'view:representativeQuery': '',
      'view:representativeSearchResults': [],
    });
  }, []);

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
