import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Ineligible from '../../../components/statuses/Ineligible';

describe('Ineligible', () => {
  it('should render', () => {
    const { container } = render(<Ineligible />);

    expect($('va-alert', container)).to.exist;
    expect($('h2', container)).to.exist;
    expect($('a', container)).to.exist;
  });
});
