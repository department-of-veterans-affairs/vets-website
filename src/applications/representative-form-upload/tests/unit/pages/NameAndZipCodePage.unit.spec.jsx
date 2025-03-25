import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { NameAndZipCodePage } from '../../../pages/nameAndZipCode';

describe('NameAndZipCodePage', () => {
  const subject = () => render(<NameAndZipCodePage />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});
