import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Available from '../../../components/statuses/Available';

describe('Available', () => {
  it('should render', () => {
    const { container } = render(<Available />);

    expect($('h2', container)).to.exist;
    expect($('a', container)).to.exist;
  });
});
