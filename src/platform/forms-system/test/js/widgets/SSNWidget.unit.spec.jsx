import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import SSNWidget from '../../../src/js/widgets/SSNWidget';

const props = {
  schema: {
    type: 'text',
  },
};

describe('Schemaform <SSNWidget>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<SSNWidget value="12345678" />);
    expect(tree.subTree('TextWidget').props.value).to.equal('12345678');
  });
  it('should remove dashes on change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SSNWidget value="" onChange={onChange} />,
    );
    tree.subTree('TextWidget').props.onChange('123-45-5677');
    expect(onChange.calledWith('123455677')).to.be.true;
  });
  it('should call onChange with undefined if the value is blank', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SSNWidget value="123121234" onChange={onChange} />,
    );
    tree.subTree('TextWidget').props.onChange('');
    expect(onChange.calledWith(undefined)).to.be.true;
  });

  it('should call onChange with the value if available', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SSNWidget value="456431098" onChange={onChange} />,
    );
    tree.subTree('TextWidget').props.onChange('432549877');
    expect(onChange.calledWith('432549877')).to.be.true;
  });

  it('should mask all but the last four digits of the SSN onBlur and display with dashes when SSN is entered as all one digit', () => {
    const { container } = render(<SSNWidget value="456431098" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-1098');
  });

  it('should mask all but the last four digits of the SSN onBlur and display with dashes when SSN is entered with dashes', () => {
    const { container } = render(<SSNWidget value="456-43-1098" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-1098');
  });

  it('should mask all but the last four digits of the SSN onBlur and display with dashes when SSN is entered with spaces', () => {
    const { container } = render(<SSNWidget value="456 43 1098" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-1098');
  });

  it('should not mask the SSN onFocus', () => {
    const { container } = render(<SSNWidget value="456431098" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).to.equal('456431098');
  });

  it('should display the SSN with dashes when SSN is entered with dashes', () => {
    const { container } = render(<SSNWidget value="456-43-1098" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).to.equal('456-43-1098');
  });

  it('should display the SSN with spaces when the SSN is entered with spaces', () => {
    const { container } = render(<SSNWidget value="456 43 1098" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    fireEvent.focus(input);
    expect(input.value).to.equal('456 43 1098');
  });

  it('should mask all digits of the SSN onBlur when fewer than 6 digits are entered', () => {
    const { container } = render(<SSNWidget value="4564" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●');
  });

  it('should mask all but the last two digits of the SSN onBlur when 7 digits are entered', () => {
    const { container } = render(<SSNWidget value="4564210" {...props} />);
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(input.value).to.equal('●●●-●●-10');
  });
});
