import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { wrapWithBreadcrumb } from '../components/Breadcrumbs';

import formConfig from '../config/form';
import configService from '../utilities/configService';

function App({ location, children }) {
  const subTitle = useSelector(state => state.flow.subTitle);
  const { pathname } = location || {};
  const [formUseState, setFormUseState] = useState({ ...formConfig });

  useEffect(
    () => {
      configService.setFormConfig({ subTitle });
      setFormUseState(configService.getFormConfig());
    },
    [subTitle],
  );

  const content = (
    <RoutedSavableApp formConfig={formUseState} currentLocation={location}>
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
  };
}

export default connect(
  mapStateToProps,
  null,
)(App);
