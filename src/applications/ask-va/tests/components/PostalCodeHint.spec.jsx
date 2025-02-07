import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import PostalCodeHint from '../../components/PostalCodeHint';

describe('PostalCodeHint Component', () => {
  it('renders without crashing', () => {
    render(<PostalCodeHint />);
  });

  it('displays the correct text', () => {
    const screen = render(<PostalCodeHint />);

    const postalCodeHintText = screen.getByText(
      /We ask for this information to send your question to the right place or provide relevant resources./,
    );

    expect(postalCodeHintText).to.exist;
  });
});
