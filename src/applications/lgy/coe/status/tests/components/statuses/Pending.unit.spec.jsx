import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Pending from '../../../components/statuses/Pending';

describe('Pending', () => {
  it('should render', () => {
    const { container } = render(<Pending />);

    expect($('va-alert', container)).to.exist;
    expect($('h2', container)).to.exist;
  });
  it('should render document uploader', () => {
    const { container } = render(<Pending uploadsNeeded />);

    expect($('va-alert', container)).to.exist;
    expect($('h2', container)).to.exist;
    expect($('va-file-input', container)).to.exist;
  });
});
