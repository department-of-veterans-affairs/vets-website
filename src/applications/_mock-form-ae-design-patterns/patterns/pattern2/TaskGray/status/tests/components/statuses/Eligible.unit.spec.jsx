import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Eligible from '../../../components/statuses/Eligible';

describe('Eligible', () => {
  it('should render', () => {
    const { container } = render(<Eligible />);

    expect($('h2', container)).to.exist;
    expect($('a', container)).to.exist;
  });
});
