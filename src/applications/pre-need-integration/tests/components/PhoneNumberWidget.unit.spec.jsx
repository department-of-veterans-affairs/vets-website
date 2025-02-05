import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import PhoneNumberWidget from '../../components/PhoneNumberWidget';

describe('Pre-need Schemaform <PhoneNumberWidget>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget value="1234567890" />,
    );
    expect(tree.subTree('TextWidget').props.value).to.equal('1234567890');
  });

  it('should render a "tel" type input', () => {
    const tree = SkinDeep.shallowRender(<PhoneNumberWidget />);
    const input = tree.subTree('TextWidget').props;
    expect(input.type).to.equal('tel');
    expect(input.autocomplete).to.equal('tel');
  });

  it('should strip anything that is not a number on change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget value="" onChange={onChange} />,
    );
    tree.subTree('TextWidget').props.onChange('+(154) 945-56x77~!@#$%^&*_=');
    expect(onChange.calledWith('1549455677')).to.be.true;
  });

  it('should call onChange with undefined if value is blank', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget value="1231231234" onChange={onChange} />,
    );
    tree.subTree('TextWidget').props.onChange('');
    expect(onChange.calledWith(undefined)).to.be.true;
  });

  it('should handle componentDidUpdate correctly', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget value="1234567890" onChange={onChange} />,
    );

    expect(tree.getMountedInstance().state.firstUpdate).to.be.true;

    tree.getMountedInstance().componentDidUpdate({ value: '1234567890' });

    expect(tree.getMountedInstance().state.firstUpdate).to.be.true;

    expect(onChange.calledWith('1234567890')).to.be.false;
  });
});
