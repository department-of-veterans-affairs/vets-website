import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { MessageAlert } from '../../components/MessageAlert';

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
