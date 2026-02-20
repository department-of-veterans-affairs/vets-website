import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ErrorAlert from './ErrorAlert';
import { FLOW_TYPES, VASS_PHONE_NUMBER } from '../utils/constants';

describe('VASS Component: ErrorAlert', () => {
  it('should render the error alert with correct structure', () => {
    const { container, getByTestId, getByRole } = render(<ErrorAlert />);

    const alert = getByTestId('api-error-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');

    const heading = getByRole('heading', { level: 2 });
    expect(heading).to.exist;

    expect(alert.textContent).to.contain('problem with our system');

    const telephone = container.querySelector('va-telephone');
    expect(telephone).to.exist;
    expect(telephone.getAttribute('contact')).to.equal(VASS_PHONE_NUMBER);
  });

  it('should display the schedule heading by default', () => {
    const { getByRole } = render(<ErrorAlert />);

    const heading = getByRole('heading', { level: 2 });
    expect(heading.textContent).to.contain('schedule your appointment');
  });

  it('should display the schedule heading when flowType is SCHEDULE', () => {
    const { getByRole } = render(<ErrorAlert flowType={FLOW_TYPES.SCHEDULE} />);

    const heading = getByRole('heading', { level: 2 });
    expect(heading.textContent).to.contain('schedule your appointment');
  });

  it('should display the cancel heading when flowType is CANCEL', () => {
    const { getByRole } = render(<ErrorAlert flowType={FLOW_TYPES.CANCEL} />);

    const heading = getByRole('heading', { level: 2 });
    expect(heading.textContent).to.contain('cancel your appointment');
  });
});
