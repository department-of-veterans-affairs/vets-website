import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import SaveInProgressWrapper from '@bio-aquia/shared/components/save-in-progress-wrapper';

import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';

const breadcrumbList = [
  { href: '/', label: 'VA.gov home' },
  { href: '/pension', label: 'Pension benefits' },
  {
    href: '/pension/aid-attendance-housebound',
    label: 'Aid and Attendance or Housebound benefits',
  },
];

export const App = ({ location, router, children }) => {
  return (
    <SaveInProgressWrapper
      formConfig={formConfig}
      location={location}
      router={router}
    >
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
    </SaveInProgressWrapper>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  router: PropTypes.object,
};

export default App;
