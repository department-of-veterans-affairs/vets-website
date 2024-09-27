import React from 'react';
import PropTypes from 'prop-types';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import SubmitHelper from '../components/SubmitHelper';
import formConfig from '../config/form';

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function App({ location, children }) {
  const path = location.pathname.split('/')[1];
  const breadcrumb =
    path === 'confirmation'
      ? 'Your benefits and resources'
      : capitalizeFirstLetter(path);

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
            label: 'Benefit and resource recommendation tool',
          },
          {
            href: `/benefit-eligibility-questionnaire/${path}`,
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
