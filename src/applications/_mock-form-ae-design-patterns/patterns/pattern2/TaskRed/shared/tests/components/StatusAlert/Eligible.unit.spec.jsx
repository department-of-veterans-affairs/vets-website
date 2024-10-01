import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { Eligible } from '../../../components/StatusAlert/statuses';

describe('<Eligible>', () => {
  it('should render', () => {
    const { container } = render(<Eligible referenceNumber="123456" />);

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal(
      'Congratulations on your automatic COE',
    );
    expect($$('div p', container).pop().textContent).to.contain('123456');
  });
});
