import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { Ineligible } from '../../../components/StatusAlert/statuses';

describe('<Ineligible>', () => {
  it('should render', () => {
    const { container } = render(<Ineligible />);

    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.equal(
      'We don’t have a COE on file for you',
    );
    expect($('a', container).href).to.contain('/housing-assistance/home-loans');
  });
});
