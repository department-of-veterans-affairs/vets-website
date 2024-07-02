import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { wrapWithBreadcrumb } from '../components/Breadcrumbs';

import formConfig from '../config/form';
import configService from '../utilities/configService';

function App({ location, children, formData }) {
  const subTitle = useSelector(() => {
    switch (formData.repTypeRadio) {
      case 'Veterans Service Organization (VSO)':
        return 'VA Form 21-22';
      case 'Attorney':
      case 'Claims Agent':
        return 'VA Form 21-22a';
      default:
        return 'VA Forms 21-22 and 21-22a';
    }
  });
  const { pathname } = location || {};
  const [updatedFormConfig, setUpdatedFormConfig] = useState({ ...formConfig });

  useEffect(
    () => {
      configService.setFormConfig({ subTitle });
      setUpdatedFormConfig(configService.getFormConfig());
    },
    [subTitle],
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

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
    flow: state.flow,
    formData: state.form?.data || {},
  };
}
export default connect(
  mapStateToProps,
  null,
)(App);
