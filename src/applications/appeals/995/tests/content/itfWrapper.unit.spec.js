import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { itfExpander } from '../../content/itfWrapper';

describe('contact information page', () => {
  it('should add event when expanded', () => {
    global.window.dataLayer = [];
    const { container } = render(<div>{itfExpander}</div>);

    fireEvent.click($('va-additional-info', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: '995-supplemental-claim---form-help-text-clicked',
      'help-text-label':
        'File a Supplemental Claim - Intent to File - What is an intent to file',
    });
  });
});
