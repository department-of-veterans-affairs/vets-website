import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';

import TravelClaimsSection from '../../components/TravelClaimsSection';

describe('<TravelClaimSection>', () => {
  it('should render a TravelClaimSection section', () => {
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
    expect(details).to.be.visible;
  });

  it('should call recordLinkClick when link is clicked', () => {
    const recordLinkClickStub = sinon.stub(recordEventModule, 'default');
    const { getByRole } = render(<TravelClaimsSection />);
    const link = getByRole('link', {
      name: 'Review and file travel claims',
    });
    fireEvent.click(link);

    expect(
      recordLinkClickStub.calledWith({
        event: 'nav-link-click',
        'link-label': 'Review and file travel claims',
        'link-destination': '/my-health/travel-pay/claims',
      }),
    ).to.be.true;
    recordLinkClickStub.restore();
  });
});
