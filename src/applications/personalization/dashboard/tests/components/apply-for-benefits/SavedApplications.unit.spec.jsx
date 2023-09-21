import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';

import SavedApplications from '../../../components/apply-for-benefits/SavedApplications';

describe('SavedApplications component', () => {
  it('renders correctly', () => {
    const initialState = {};
    const view = renderInReduxProvider(<SavedApplications />, {
      initialState,
      reducers,
    });

    expect(view.getByTestId('dashboard-all-benefits')).to.exist;
    expect(view.getByTestId('applications-in-progress')).to.exist;
  });
});
