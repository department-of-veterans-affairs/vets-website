import React from 'react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import { UnconnectedHealthCareV2 } from '../../../components/health-care-v2/HealthCareV2';

describe('<UnconnectedHealthCareV2 />', () => {
  it('should render', () => {
    const tree = renderWithStoreAndRouter(<UnconnectedHealthCareV2 />, {});

    tree.getByText('Health care');
    tree.getByTestId('dashboard-section-health-care-v2');
  });
});
