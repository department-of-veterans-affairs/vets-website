import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ErrorAlert from './ErrorAlert';
import { VASS_PHONE_NUMBER } from '../utils/constants';

describe('VASS Component: ErrorAlert', () => {
  it('should render component with correct structure', () => {
    const { container, getByTestId, getByRole } = render(<ErrorAlert />);

    const alert = getByTestId('api-error-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');

    const heading = getByRole('heading', { level: 2 });
    expect(heading).to.exist;
    expect(heading.textContent).to.equal(
      'We can’t schedule your appointment right now',
    );

    expect(alert.textContent).to.contain(
      'There’s a problem with our system. Refresh this page to start over or try again later.',
    );

    const telephone = container.querySelector('va-telephone');
    expect(telephone).to.exist;
    expect(telephone.getAttribute('contact')).to.equal(VASS_PHONE_NUMBER);
  });
});
