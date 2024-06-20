import React from 'react';
import { render } from '@testing-library/react';

import Payments from '../../../components/claim-status-tab/Payments';

describe('<Payments>', () => {
  it('should render payments section', () => {
    const { getByText } = render(<Payments />);
    getByText('Payments');
    const text =
      'If you are entitled to back payment (based on an effective date), you can expect to receive payment within 1 month of your claim’s decision date.';
    getByText(text);
  });
});
