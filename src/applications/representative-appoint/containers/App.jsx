import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { wrapWithBreadcrumb } from '../components/Breadcrumbs';
import { getRepresentatives as getRepresentativesAction } from '../actions';
import formConfig from '../config/form';
import configService from '../utilities/configService';

function App({ loggedIn, location, children, formData, setFormData }) {
  let subTitle;
  if (formData.repTypeRadio === 'Veterans Service Organization (VSO)') {
    subTitle = 'VA Form 21-22';
  } else if (
    formData.repTypeRadio === 'Attorney' ||
    formData.repTypeRadio === 'Claims Agent'
  ) {
    subTitle = 'VA Form 21-22a';
  } else {
    subTitle = 'VA Forms 21-22 and 21-22a';
  }

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
  formData: state.form?.data || {},
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
  getRepresentatives: getRepresentativesAction,
};

App.propTypes = {
  loggedIn: PropTypes.bool,
  location: PropTypes.object,
  children: PropTypes.node,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  getRepresentatives: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
