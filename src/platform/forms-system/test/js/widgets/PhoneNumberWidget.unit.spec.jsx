import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import PhoneNumberWidget from '../../../src/js/widgets/PhoneNumberWidget';

const defaultProps = {
  schema: {},
  onBlur: () => {},
  formContext: {},
  options: {},
};

describe('Schemaform <PhoneNumberWidget>', () => {
  it('should render', () => {
    const { container } = render(
      <PhoneNumberWidget value="1234567890" onChange={() => {}} {...defaultProps} />,
    );
    const input = container.querySelector('input[type="tel"]');
    expect(input.value).to.equal('1234567890');
  });

  it('should render a "tel" type input', () => {
    const { container } = render(<PhoneNumberWidget onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input[type="tel"]');
    expect(input).to.exist;
  });

  it('should strip anything that is not a number on change', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <PhoneNumberWidget value="" onChange={onChange} {...defaultProps} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '+(154) 945-56x77~!@#$%^&*_=' } });
    
    expect(onChange.calledWith('1549455677')).to.be.true;
  });

  it('should call onChange with undefined if value is blank', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <PhoneNumberWidget value="1231231234" onChange={onChange} {...defaultProps} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(onChange.calledWith(undefined)).to.be.true;
  });
});
