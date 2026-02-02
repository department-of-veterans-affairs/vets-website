import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import SSNWidget from '../../../src/js/widgets/SSNWidget';

const defaultProps = {
  schema: {
    type: 'text',
  },
  onBlur: () => {},
  id: 'ssn-test',
  formContext: {},
  options: {},
};

describe('Schemaform <SSNWidget>', () => {
  it('should render', () => {
    const { container } = render(<SSNWidget value="12345678" onChange={() => {}}  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    expect(input.value).to.equal('12345678');
  });
  it('should remove dashes on change', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <SSNWidget value="" onChange={onChange} {...defaultProps} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '123-45-5677' } });
    expect(onChange.calledWith('123455677')).to.be.true;
  });
  it('should call onChange with undefined if the value is blank', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <SSNWidget value="123121234" onChange={onChange} {...defaultProps} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange.calledWith(undefined)).to.be.true;
  });

  it('should call onChange with the value if available', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <SSNWidget value="456431098" onChange={onChange} {...defaultProps} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '432549877' } });
    expect(onChange.calledWith('432549877')).to.be.true;
  });

  it('should mask all but the last four digits of the SSN onBlur and display with dashes when SSN is entered as all one digit', () => {
    const { container } = render(<SSNWidget value="456431098"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-1098');
  });

  it('should mask all but the last four digits of the SSN onBlur and display with dashes when SSN is entered with dashes', () => {
    const { container } = render(<SSNWidget value="456-43-1098"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-1098');
  });

  it('should mask all but the last four digits of the SSN onBlur and display with dashes when SSN is entered with spaces', () => {
    const { container } = render(<SSNWidget value="456 43 1098"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-1098');
  });

  it('should not mask the SSN onFocus', () => {
    const { container } = render(<SSNWidget value="456431098"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).to.equal('456431098');
  });

  it('should display the SSN with dashes when SSN is entered with dashes', () => {
    const { container } = render(<SSNWidget value="456-43-1098"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).to.equal('456-43-1098');
  });

  it('should display the SSN with spaces when the SSN is entered with spaces', () => {
    const { container } = render(<SSNWidget value="456 43 1098"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).to.equal('456 43 1098');
  });

  it('should mask all digits of the SSN onBlur when fewer than 6 digits are entered', () => {
    const { container } = render(<SSNWidget value="4564"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●');
  });

  it('should mask all but the last two digits of the SSN onBlur when 7 digits are entered', () => {
    const { container } = render(<SSNWidget value="4564210"  onChange={() => {}} {...defaultProps} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-10');
  });
});
