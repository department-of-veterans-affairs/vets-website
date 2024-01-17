import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import {
  MessageAlert,
  NoneSelectedAlert,
} from '../../content/contestableIssues';

describe('MessageAlert', () => {
  it('should render alert', () => {
    const { container } = render(<MessageAlert />);
    expect($('va-alert[status="error"]', container)).to.exist;
  });
  it('should render props', () => {
    const props = {
      title: 'A title',
      message: 'A message',
      headerLevel: 4,
      classes: 'some-class',
    };
    const { container } = render(<MessageAlert {...props} />);
    const content = $('va-alert', container).outerHTML;
    expect(content).to.contain('A title');
    expect(content).to.contain('A message');
    expect(content).to.contain('<h4');
    expect(content).to.contain('some-class');
  });
  it('should render props', () => {
    global.window.dataLayer = [];
    const props = {
      title: 'A title 2',
      errorKey: 'key-1234',
      errorReason: 'reason-5678',
    };
    const { container } = render(<MessageAlert {...props} />);

    const content = $('va-alert', container).innerHTML;
    const event = global.window.dataLayer.slice(-1)[0];

    expect(content).to.contain('A title');
    expect(event).to.deep.equal({
      event: 'visible-alert-box',
      'alert-box-type': 'error',
      'alert-box-heading': props.title,
      'error-key': props.errorKey,
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': props.errorReason,
    });
  });
});

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
