import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { Available } from '../../../components/statuses';

describe('<Available>', () => {
  const today = new Date();
  it('should render', () => {
    const { container } = render(
      <Available referenceNumber="123456" requestDate={today.getTime()} />,
    );
    expect($('va-alert', container)).to.exist;
    expect($$('h2', container)[2].textContent).to.equal(
      'What if I need to make changes to my COE?',
    );
  });
});
