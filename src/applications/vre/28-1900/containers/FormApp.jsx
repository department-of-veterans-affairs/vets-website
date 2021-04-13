import React from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';
import formConfig from '../config/form';

function FormApp(props) {
  return (
    <>
      <RoutedSavableApp
        formConfig={formConfig}
        currentLocation={props.location}
      >
        {props.children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </>
  );
}

export default FormApp;
