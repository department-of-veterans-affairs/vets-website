import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { NoneSelectedAlert } from '../../components/NoneSelectedAlert';

describe('NoneSelectedAlert', () => {
  it('should render & show default title & class', () => {
    const { container } = render(<NoneSelectedAlert count={0} />);
    const content = container.innerHTML;

    expect($('va-alert[status="error"]', container)).to.exist;
    expect(content).to.contain('<h3');
    expect(content).to.contain('to add, and select, an issue');
    expect(content).to.contain('select at least 1 issue');
    expect(content).to.contain('vads-u-margin-bottom--2');
  });

  it('should change title when count more than zero', () => {
    const { container } = render(<NoneSelectedAlert count={2} />);
    const content = container.innerHTML;
    expect(content).to.contain('to select an issue');
  });

  it('should render review page class', () => {
    const { container } = render(<NoneSelectedAlert inReviewMode />);
    const content = container.innerHTML;
    expect(content).to.contain('vads-u-margin-y--2');
  });
});
