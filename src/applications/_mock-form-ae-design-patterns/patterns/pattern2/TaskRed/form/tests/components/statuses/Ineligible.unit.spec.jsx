import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { Ineligible } from '../../../components/statuses';

describe('<Ineligible>', () => {
  it('should render', () => {
    const { container } = render(<Ineligible />);
    expect($('h2', container).textContent).to.equal(
      'You didn’t automatically receive a COE',
    );
  });
});
