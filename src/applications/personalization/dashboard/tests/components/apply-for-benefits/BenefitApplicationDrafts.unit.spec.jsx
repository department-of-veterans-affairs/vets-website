import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';

import BenefitApplicationDrafts from '../../../components/benefit-application-drafts/BenefitApplicationDrafts';

describe('BenefitApplicationDrafts component', () => {
  it('renders correctly', () => {
    const initialState = {};
    const view = renderInReduxProvider(<BenefitApplicationDrafts />, {
      initialState,
      reducers,
    });

    expect(view.getByTestId('applications-in-progress')).to.exist;
  });
});
