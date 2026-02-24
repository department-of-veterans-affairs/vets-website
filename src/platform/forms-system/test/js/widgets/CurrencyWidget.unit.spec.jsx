import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import CurrencyWidget from '../../../src/js/widgets/CurrencyWidget';

describe('Schemaform <CurrencyWidget>', () => {
  it('should render', () => {
    const { container } = render(<CurrencyWidget options={{}} value={178} />);
    const input = container.querySelector('input');
    expect(input.value).to.equal('178.00');
  });
  it('should call onChange with parsed number when 0 filled', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CurrencyWidget options={{}} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '10.00' } });
    expect(onChange.calledWith(10)).to.be.true;
  });
  it('should parse numbers with commas', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CurrencyWidget options={{}} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '1,000' } });
    expect(onChange.calledWith(1000)).to.be.true;
  });
  it('should parse numbers with decimals', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CurrencyWidget options={{}} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '1,000.00' } });
    expect(onChange.calledWith(1000)).to.be.true;
  });
  it('should parse numbers with dollar symbol', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CurrencyWidget options={{}} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '$1,000.00' } });
    expect(onChange.calledWith(1000)).to.be.true;
  });
  it('should call onChange with string value if invalid number', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CurrencyWidget options={{}} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'abcd' } });
    expect(onChange.calledWith('abcd')).to.be.true;
  });
  it('should call onChange with string value if badly formatted number', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CurrencyWidget options={{}} onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '10.000' } });
    expect(onChange.calledWith('10.000')).to.be.true;
  });
  it('should call onChange with undefined if the value is blank', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CurrencyWidget options={{}} value="100" onChange={onChange} />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange.called).to.be.true;
    expect(onChange.firstCall.args.length).to.equal(0);
  });
});
