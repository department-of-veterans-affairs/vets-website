import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { formatDateLong } from 'platform/utilities/date';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { Denied } from '../../../components/StatusAlert/statuses';

describe('<Denied>', () => {
  const today = new Date().getTime();
  const testUrl = 'va.gov/test';
  it('should render', () => {
    const { container } = render(
      <Denied
        origin="form"
        referenceNumber="123456"
        requestDate={today}
        testUrl={testUrl}
      />,
    );

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal(
      'We denied your request for a COE',
    );
    expect($('a', container).href).to.contain(testUrl);
    expect($('p', container).textContent).to.contain(formatDateLong(today));
    expect($$('div p', container).pop().textContent).to.contain('123456');
  });
});
