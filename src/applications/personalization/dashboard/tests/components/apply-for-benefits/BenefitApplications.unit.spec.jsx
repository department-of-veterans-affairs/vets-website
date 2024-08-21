import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';

import BenefitApplications from '../../../components/benefit-application-drafts/BenefitApplications';

describe('BenefitApplications component', () => {
  it('renders correctly', () => {
    const initialState = {};
    const view = renderInReduxProvider(<BenefitApplications />, {
      initialState,
      reducers,
    });

    expect(view.getByTestId('applications-in-progress')).to.exist;
  });
});
