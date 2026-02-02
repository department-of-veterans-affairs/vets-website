import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';

import PhoneNumberWidget from '../../components/PhoneNumberWidget';

describe('Pre-need Schemaform <PhoneNumberWidget>', () => {
  const defaultProps = {
    id: 'phone',
    schema: { type: 'string' },
    options: { autocomplete: 'tel' },
    formContext: {},
    onBlur: sinon.spy(),
    onFocus: sinon.spy(),
    disabled: false,
  };

  it('should render', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <PhoneNumberWidget {...defaultProps} value="1234567890" onChange={onChange} />,
    );
    const input = container.querySelector('input[type="tel"]');
    expect(input.value).to.equal('1234567890');
  });

  it('should render a "tel" type input', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <PhoneNumberWidget {...defaultProps} onChange={onChange} />,
    );
    const input = container.querySelector('input[type="tel"]');
    expect(input.type).to.equal('tel');
    expect(input.autocomplete).to.equal('tel');
  });

  it('should strip anything that is not a number on change', async () => {
    const onChange = sinon.spy();
    const { container } = render(
      <PhoneNumberWidget {...defaultProps} value="" onChange={onChange} />,
    );
    const input = container.querySelector('input[type="tel"]');
    await userEvent.clear(input);
    await userEvent.type(input, '+(154) 945-56x77~!@#$%^&*_=');
    expect(onChange.calledWith('1549455677')).to.be.true;
  });

  it('should call onChange with undefined if value is blank', async () => {
    const onChange = sinon.spy();
    const { container } = render(
      <PhoneNumberWidget {...defaultProps} value="1231231234" onChange={onChange} />,
    );
    const input = container.querySelector('input[type="tel"]');
    await userEvent.clear(input);
    expect(onChange.calledWith(undefined)).to.be.true;
  });
});
