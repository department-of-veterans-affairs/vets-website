import React from 'react';
import PropTypes from 'prop-types';

import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';

import formConfig from '../config/form';
import FormBreadcrumbs from '../components/breadcrumbs/form';

function Form({ children, location }) {
  return (
    <>
      <FormBreadcrumbs />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </>
  );
}

Form.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default Form;
