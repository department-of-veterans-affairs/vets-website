import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { COE_ELIGIBILITY_STATUS } from '../../../../shared/constants';
import { Pending } from '../../../components/statuses';

describe('<Pending>', () => {
  it('should render', () => {
    const { container } = render(
      <Pending
        referenceNumber="123456"
        requestDate={new Date().getTime()}
        status={COE_ELIGIBILITY_STATUS.pending}
      />,
    );
    expect($('va-alert', container)).to.exist;
    expect($$('h2', container)[1].textContent).to.equal(
      'Should I make a new request?',
    );
  });
});
