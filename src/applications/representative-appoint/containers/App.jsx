import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { scrollTo } from 'platform/utilities/scroll';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';

import { wrapWithBreadcrumb } from '../components/Breadcrumbs';

function App({ location, children }) {
  const { pathname } = location || {};

  useEffect(
    () => {
      if (!pathname?.includes('introduction')) {
        scrollTo('topScrollElement');
      }
    },
    [pathname],
  );

  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
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
});

const mapDispatchToProps = {
  setFormData: setData,
};

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  location: PropTypes.object,
  setFormData: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
