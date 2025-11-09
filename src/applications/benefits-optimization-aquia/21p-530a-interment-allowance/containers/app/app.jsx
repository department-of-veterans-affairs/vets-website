import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { SaveInProgress } from '@bio-aquia/shared/components';

import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';

const breadcrumbList = [
  { href: '/', label: 'Home' },
  {
    href: '/submit-state-interment-allowance-form-21p-530a',
    label:
      'Submit a state or tribal organization request for interment allowance',
  },
];

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
