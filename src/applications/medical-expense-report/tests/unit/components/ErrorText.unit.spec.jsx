import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ErrorText from '../../../components/ErrorText';

describe('ErrorText', () => {
  it('should display the error message text', () => {
    const { container } = render(<ErrorText />);

    const paragraph = container.querySelector('p');
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.include(
      'If it still doesn’t work, please',
    );
  });

  it('should contain CallVBACenter component', () => {
    const { container } = render(<ErrorText />);

    const callVBACenter = container.querySelector('span');
    expect(callVBACenter).to.exist;
  });
});
