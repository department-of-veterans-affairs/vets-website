import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { Denied } from '../../../components/statuses';

describe('<Denied>', () => {
  const today = new Date();
  it('should render', () => {
    const { container } = render(
      <Denied
        origin="form"
        referenceNumber="123456"
        requestDate={today.getTime()}
      />,
    );

    expect($('va-alert', container)).to.exist;
    expect($$('h2', container)[1].textContent).to.equal(
      'Can I appeal VA’s decision?',
    );
    expect($$('a', container).pop().href).to.contain('/decision-reviews/faq/');
  });
});
