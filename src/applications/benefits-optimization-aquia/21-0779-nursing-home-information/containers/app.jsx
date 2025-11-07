import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '@bio-aquia/21-0779-nursing-home-information/config/form';
import { SaveInProgress } from '@bio-aquia/shared/components';

/**
 * Breadcrumb navigation configuration for the nursing home information form
 * @type {Array<{href: string, label: string}>}
 */
const breadcrumbList = [
  { href: '/', label: 'VA.gov home' },
  {
    href: '/supporting-forms-for-claims/',
    label: 'Supporting forms for claims',
  },
  {
    href: '/supporting-forms-for-claims/aid-attendance-housebound',
    label: 'Aid and Attendance or Housebound benefits',
  },
];

/**
 * Main application component for VA Form 21-0779 Nursing Home Information.
 * The RoutedSavableApp component handles all save-in-progress and prefill functionality.
 *
 * @param {Object} props - Component props
 * @param {Object} props.location - React router location object
 * @param {Object} props.router - React router instance
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactElement} The application container component
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
