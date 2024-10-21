import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { formatDateLong } from 'platform/utilities/date';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { Available } from '../../../components/StatusAlert/statuses';

describe('<Available>', () => {
  const today = new Date().getTime();
  const testUrl = 'va.gov/test';
  it('should render', () => {
    const { container } = render(
      <Available
        referenceNumber="123456"
        requestDate={today}
        testUrl={testUrl}
      />,
    );

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal('You already have a COE');
    expect($('a', container).href).to.contain(testUrl);
    expect($('p', container).textContent).to.contain(formatDateLong(today));
    expect($$('div p', container).pop().textContent).to.contain('123456');
  });
});
