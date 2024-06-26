import React from 'react';

import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';
import formConfig from '../config/form';

const breadcrumbList = [
  { href: '/', label: 'Home' },
  {
    href: `/family-and-caregiver-benefits`,
    label: `Family and caregiver benefits`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/`,
    label: `Health and disability benefits for family and caregivers`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/champva`,
    label: `CHAMPVA benefits`,
  },
];

export default function App({ location, children }) {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.form1010d}>
        <Toggler.Enabled>
          <VaBreadcrumbs breadcrumbList={breadcrumbList} />
          <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
            {children}
          </RoutedSavableApp>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <br />
          <h1>This form is currently disabled.</h1>
          <p>This form is still under development.</p>
        </Toggler.Disabled>
      </Toggler>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
