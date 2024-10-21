import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { Eligible } from '../../../components/statuses';

describe('<Eligible>', () => {
  it('should render', () => {
    const { container } = render(<Eligible referenceNumber="123456" />);
    expect($('va-alert', container)).to.exist;
    expect($$('h2', container).pop().textContent).to.equal(
      'What if my COE has errors?',
    );
  });
});
