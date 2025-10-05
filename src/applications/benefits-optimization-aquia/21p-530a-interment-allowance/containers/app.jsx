import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
<<<<<<< HEAD
import { SaveInProgress } from '@bio-aquia/shared/components';
=======
import SaveInProgressWrapper from '@bio-aquia/shared/components/save-in-progress-wrapper';
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';

const breadcrumbList = [
<<<<<<< HEAD
  { href: '/', label: 'Home' },
  { href: '/burials-memorials', label: 'Burials and memorials' },
  {
    href: '/burials-memorials/veterans-burial-allowance',
    label: 'Burial allowance',
  },
  {
    href: '/21p-530a-interment-allowance',
    label: 'Apply for burial benefits',
=======
  { href: '/', label: 'VA.gov home' },
  { href: '/burials-memorials', label: 'Burials and memorials' },
  {
    href: '/burials-memorials/veterans-burial-allowance',
    label: 'Veterans burial allowance',
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
  },
];

export const App = ({ location, router, children }) => {
  return (
<<<<<<< HEAD
    <SaveInProgress formConfig={formConfig} location={location} router={router}>
=======
    <SaveInProgressWrapper
      formConfig={formConfig}
      location={location}
      router={router}
    >
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
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
<<<<<<< HEAD
    </SaveInProgress>
=======
    </SaveInProgressWrapper>
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  router: PropTypes.object,
};

export default App;
