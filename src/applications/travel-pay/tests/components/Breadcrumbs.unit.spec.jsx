import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Breadcrumbs from '../../components/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render as expected', () => {
    renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState: {},
    });
    expect($('va-breadcrumbs')).to.exist;
  });

  it('should render for status explainer page', () => {
    renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState: {},
      path: '/help',
    });
    expect($('va-breadcrumbs')).to.exist;
  });

  it('should render for status explainer page', () => {
    renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState: {},
      path: '/claims/3aeafdcc-b5ec-4260-a13f-1b14a17bd3e9',
    });
    expect($('va-link[text="Back to your travel reimbursement claims"]')).to
      .exist;
  });
});
