import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import TextareaWidget from '../../components/TextareaWidget';

describe('VAOS Component: TextareaWidget', () => {
  beforeEach(() => mockFetch());
  it('should render character limit', () => {
    const screen = render(
      <TextareaWidget value="Test" schema={{ maxLength: 20 }} />,
    );
    expect(document.querySelector('va-textarea')).to.exist;
    expect(screen.getByTestId('reason-comment-field')).to.have.attribute(
      'maxlength',
      '20',
    );
    expect(screen.getByTestId('reason-comment-field')).to.have.attribute(
      'value',
      'Test',
    );
    expect(document.querySelector('va-textarea[value="Test"]')).to.exist;
  });

  it('should render form label', () => {
    const screen = render(
      <TextareaWidget value="Test" schema={{ title: 'Type your comment' }} />,
    );
    expect(screen.getByTestId('reason-comment-field')).to.have.attribute(
      'label',
      'Type your comment',
    );
    expect(screen.getByTestId('reason-comment-field')).to.have.attribute(
      'value',
      'Test',
    );
  });
});
