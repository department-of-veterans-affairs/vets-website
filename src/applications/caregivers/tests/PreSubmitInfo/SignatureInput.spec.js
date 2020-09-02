import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SignatureInput from '../../components/PreSubmitInfo/SignatureInput';

describe('VAOS <SignatureInput>', () => {
  it('should render a SignatureInput', async () => {
    const component = render(<SignatureInput />);
    // console.log('SignatureInput', SignatureInput);

    expect(component).to.exist;
  });
});
