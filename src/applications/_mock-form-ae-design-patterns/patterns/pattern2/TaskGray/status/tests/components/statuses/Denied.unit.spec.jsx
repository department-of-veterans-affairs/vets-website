import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Denied from '../../../components/statuses/Denied';

describe('Denied', () => {
  it('should render', () => {
    const { container } = render(<Denied />);

    expect($('va-alert', container)).to.exist;
    expect($('h2', container)).to.exist;
    expect($('a', container)).to.exist;
  });
});
