import React from 'react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import { UnconnectedHealthCare } from '../../../components/health-care/HealthCare';

describe('<UnconnectedHealthCare />', () => {
  it('should render', () => {
    const tree = renderWithStoreAndRouter(<UnconnectedHealthCare />, {});

    tree.getByText('Health care');
    tree.getByTestId('dashboard-section-health-care');
  });
});
