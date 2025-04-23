import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as recordEventModule from 'platform/monitoring/record-event';

import SubmissionErrorPage from '../../../../components/submit-flow/pages/SubmissionErrorPage';

describe('SubmissionErrorPage', () => {
  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('should render submission error page with expected links and record pageview', () => {
    const screen = render(<SubmissionErrorPage />);
    expect(screen.getByText('We couldn’t file your claim')).to.exist;
    expect(
      recordEventStub.calledWith({
        event: 'smoc-pageview',
        action: 'view',
        /* eslint-disable camelcase */
        heading_1: 'error',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;

    // Text only found in HelpTextGeneral used in SubmissionErrorPage
    expect(
      screen.getByText(
        'Or call your VA health facility’s Beneficiary Travel contact.',
      ),
    ).to.exist;

    expect($('va-link[href="/health-care/get-reimbursed-for-travel-pay/"]')).to
      .exist;
    expect($('va-link[text="Find out how to file for travel reimbursement"]'))
      .to.exist;

    expect($('va-link[href="https://dvagov-btsss.dynamics365portals.us/"]')).to
      .exist;
    expect($('va-link[text="File a travel claim online"]')).to.exist;

    expect($('va-link[href="/find-forms/about-form-10-3542/"]')).to.exist;
    expect($('va-link[text="Learn more about VA Form 10-3542"]')).to.exist;

    expect($('va-link[href="/HEALTHBENEFITS/vtp/beneficiary_travel_pocs.asp"]'))
      .to.exist;
    expect($('va-link[text="Find the travel contact for your facility"]')).to
      .exist;
  });
});
