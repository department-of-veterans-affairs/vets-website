import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';

import TravelClaimsSection from '../../components/TravelClaimsSection';

describe('<TravelClaimsSection>', () => {
  it('renders the travel claims section', () => {
    const { getByRole, getByText } = render(<TravelClaimsSection />);
    const heading = getByRole('heading', {
      name: 'Your travel claims',
    });
    const link = getByRole('link', {
      name: 'Review and file travel claims',
    });
    const details = getByText(
      'File new claims for travel reimbursement and review the status of all your travel claims.',
    );

    expect(heading).to.be.visible;
    expect(link).to.be.visible;
    expect(link).to.have.attribute('href', '/my-health/travel-pay/claims');
    expect(details).to.be.visible;
  });

  it('records an analytics event when the link is clicked', async () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { getByRole } = render(<TravelClaimsSection />);
    const link = getByRole('link', {
      name: 'Review and file travel claims',
    });

    await userEvent.click(link);

    expect(
      recordEventStub.calledWith({
        event: 'nav-link-click',
        'link-label': 'Review and file travel claims',
        'link-destination': '/my-health/travel-pay/claims',
      }),
    ).to.be.true;

    recordEventStub.restore();
  });
});
