import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { formatDateLong } from 'platform/utilities/date';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { Pending } from '../../../components/StatusAlert/statuses';
import { COE_ELIGIBILITY_STATUS } from '../../../constants';

describe('<Pending>', () => {
  const today = new Date().getTime();
  const testUrl = 'va.gov/test';
  const refNumber = '123456';
  it('should render pending form', () => {
    const { container } = render(
      <Pending
        origin="form"
        status={COE_ELIGIBILITY_STATUS.pending}
        referenceNumber={refNumber}
        requestDate={today}
        testUrl={testUrl}
      />,
    );

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal(
      'We’re reviewing your request',
    );
    expect($('p', container).textContent).to.contain(formatDateLong(today));
    expect($$('p', container)[1].textContent).to.contain('If you qualify for');
    expect($('a', container).href).to.contain(testUrl);
    expect($('a', container).textContent).to.contain('review the details');
    expect($$('div p', container).pop().textContent).to.contain('123456');
  });
  it('should render pending status', () => {
    const { container } = render(
      <Pending
        origin="status"
        status={COE_ELIGIBILITY_STATUS.pending}
        referenceNumber={refNumber}
        requestDate={today}
        testUrl={testUrl}
      />,
    );

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal(
      'We’re reviewing your request for a COE',
    );
    expect($('a', container)).to.not.exist;
  });
  it('should render pending-upload form', () => {
    const { container } = render(
      <Pending
        origin="form"
        status={COE_ELIGIBILITY_STATUS.pendingUpload}
        referenceNumber={refNumber}
        requestDate={today}
        testUrl={testUrl}
      />,
    );

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal(
      'We need more information from you',
    );
    expect($('p', container).textContent).to.contain(formatDateLong(today));
    expect($$('p', container)[1].textContent).to.contain(
      'documents before we can',
    );
    expect($('a', container).href).to.contain(testUrl);
    expect($('a', container).textContent).to.contain('upload documents');
    expect($$('div p', container).pop().textContent).to.contain('123456');
  });
  it('should render pending-upload status', () => {
    const { container } = render(
      <Pending
        origin="status"
        status={COE_ELIGIBILITY_STATUS.pendingUpload}
        referenceNumber={refNumber}
        requestDate={today}
        testUrl={testUrl}
      />,
    );

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal(
      'We need more information from you',
    );
    expect($('p', container).textContent).to.contain(formatDateLong(today));
    expect($$('p', container)[1].textContent).to.contain('listed on this page');
    expect($('a', container)).to.not.exist;
    expect($$('div p', container).pop().textContent).to.contain('123456');
  });
});
