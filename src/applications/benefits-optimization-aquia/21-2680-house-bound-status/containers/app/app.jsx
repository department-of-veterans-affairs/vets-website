import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { SaveInProgress } from '@bio-aquia/shared/components';

import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

const breadcrumbList = [
  { href: '/', label: 'Home' },
  { href: '/disability', label: 'Disability benefits' },
  {
    href: '/supporting-forms-for-claims/aid-attendance-housebound',
    label: 'Aid and Attendance or Housebound benefits',
  },
  {
    href: '/21-2680-house-bound-status',
    label: 'Apply for Aid and Attendance or Housebound benefits',
  },
];

/**
 * Main application container component for VA Form 21-2680
 * @module containers/app
 */
export const App = ({ location, router, children }) => {
  return (
    <SaveInProgress formConfig={formConfig} location={location} router={router}>
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        <VaBreadcrumbs breadcrumbList={breadcrumbList} />
        <RoutedSavableApp
          formConfig={formConfig}
          currentLocation={location}
          router={router}
        >
          {children}
        </RoutedSavableApp>
      </div>
    </SaveInProgress>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  router: PropTypes.object,
};
