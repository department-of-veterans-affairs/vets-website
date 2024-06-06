import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import configService from '../utilities/configService';

function App({ location, children }) {
  const subTitle = useSelector(state => state.flow.subTitle);
  const [formUseState, setFormUseState] = useState({ ...formConfig });

  useEffect(
    () => {
      configService.setFormConfig({ subTitle });
      setFormUseState(configService.getFormConfig());
    },
    [subTitle],
  );

  return (
    <RoutedSavableApp formConfig={formUseState} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

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
