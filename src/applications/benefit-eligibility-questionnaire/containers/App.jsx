import React from 'react';
import PropTypes from 'prop-types';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import SubmitHelper from '../components/SubmitHelper';
import formConfig from '../config/form';

export default function App({ location, children }) {
  const breadcrumb = location.pathname.split('/')[1];

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'VA.gov Home',
          },
          {
            href: '/benefit-eligibility-questionnaire',
            label: 'Complete the benefit eligibility questionnaire',
          },
          {
            href: `/benefit-eligibility-questionnaire/${breadcrumb}`,
            label: capitalizeFirstLetter(breadcrumb),
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <SubmitHelper />
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
