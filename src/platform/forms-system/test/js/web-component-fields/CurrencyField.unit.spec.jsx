import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '../../../src/js/utilities/ui';

import CurrencyField from '../../../src/js/web-component-fields/CurrencyField';
import {
  currencySchema,
  currencyStringSchema,
} from '../../../src/js/web-component-patterns';

describe('CurrencyField', () => {
  const getProps = ({
    onChange = () => {},
    onBlur = () => {},
    options = {},
    value = '',
    schema = currencySchema,
  } = {}) => ({
    label: 'test',
    childrenProps: {
      name: 'test',
      value,
      onChange,
      onBlur,
      schema,
      uiSchema: {},
      idSchema: { $id: 'test' },
    },
    uiOptions: options,
  });

  it('should render with default props', () => {
    const { container } = render(<CurrencyField {...getProps()} />);
    expect($('va-text-input', container)).to.exist;
  });

  it('should render with custom props', () => {
    const props = {
      ...getProps({
        options: {
          currencySymbol: 'USD',
          classNames: 'test-class',
          width: '2xs',
        },
      }),
    };
    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    expect(input.getAttribute('class')).to.contain('test-class');
    expect(input.getAttribute('input-prefix')).to.equal('USD');
    expect(input.getAttribute('width')).to.equal('2xs');
  });

  it('should render value with 2 decimal places on focus', () => {
    const props = getProps({ value: 1234 });
    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);

    fireEvent.focus(input);
    waitFor(() => {
      expect(input.value).to.equal('1234.00');
    });
  });

  it('should handle input blur and return a parsed numeric value', async () => {
    const onBlur = sinon.spy();
    const onChange = sinon.spy(); // onChange is also called on blur
    const props = getProps({ onBlur, onChange });

    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    input.value = '1,234.56';
    await fireEvent.blur(input, { target: { name: '1,234.56' } });

    expect(onBlur.calledOnce).to.be.true;
    expect(onBlur.args[0][0]).to.equal('test'); // field name
    expect(onChange.args[0][0]).to.equal(1234.56);
  });

  it('should handle input blur and return a string value', async () => {
    const onBlur = sinon.spy();
    const onChange = sinon.spy(); // onChange is also called on blur
    const props = getProps({ onBlur, onChange, schema: currencyStringSchema });

    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    input.value = '123,456';
    await fireEvent.blur(input, { target: { name: '123,456' } });

    expect(onBlur.calledOnce).to.be.true;
    expect(onBlur.args[0][0]).to.equal('test'); // field name
    expect(onChange.args[0][0]).to.equal('123456.00'); // comma removed on blur
  });

  it('should handle input change (submit without blur) and return a parsed numeric value', async () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });

    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    input.value = '1,234.56';
    await fireEvent.input(input, { target: { name: '1,234.56' } });

    expect(onChange.calledOnce).to.be.true;
    expect(onChange.args[0][0]).to.equal(1234.56);
  });

  it('should handle input change (submit without blur) and return a string value', async () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange, schema: currencyStringSchema });

    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    input.value = '123,456';
    await fireEvent.input(input, { target: { name: '123,456' } });

    expect(onChange.calledOnce).to.be.true;
    expect(onChange.args[0][0]).to.equal('123,456'); // comma removed on blur
  });

  it('should round values to 2 decimal places', async () => {
    const onBlur = sinon.spy();
    const onChange = sinon.spy(); // onChange is also called on blur
    const props = getProps({ onBlur, onChange });

    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    input.value = '234.567890';
    await fireEvent.blur(input, { target: { name: '234.567890' } });

    expect(onBlur.calledOnce).to.be.true;
    expect(onBlur.args[0][0]).to.equal('test'); // field name
    expect(onChange.args[0][0]).to.equal(234.57); // rounded up
  });

  it('should ignore dollar sign, commas and other non-digits (expect decimal)', async () => {
    const onBlur = sinon.spy();
    const onChange = sinon.spy(); // onChange is also called on blur
    const props = getProps({ onBlur, onChange });

    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    input.value = '$987.654 USD';
    await fireEvent.blur(input, { target: { name: '$987.654 USD' } });

    expect(onBlur.calledOnce).to.be.true;
    expect(onBlur.args[0][0]).to.equal('test'); // field name
    expect(onChange.args[0][0]).to.equal(987.65);
  });

  it('should handle an invalid value', async () => {
    // error message is not shown at this level, RJSF handles it from the
    // onChange event and depends on the schema
    const onBlur = sinon.spy();
    const onChange = sinon.spy(); // onChange is also called on blur
    const props = getProps({ onBlur, onChange });

    const { container } = render(<CurrencyField {...props} />);
    const input = $('va-text-input', container);
    input.value = 'abcdefg';
    await fireEvent.blur(input, { target: { name: 'abcdefg' } });

    expect(onBlur.calledOnce).to.be.true;
    expect(onBlur.args[0][0]).to.equal('test'); // field name
    expect(onChange.args[0][0]).to.equal('abcdefg');
  });
});
