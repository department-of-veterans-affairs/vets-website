import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import PhoneNumberWidget from '../../../../src/js/common/schemaform/widgets/PhoneNumberWidget';

describe('Schemaform <PhoneNumberWidget>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget
          value="1234567890"/>
    );
    expect(tree.subTree('TextWidget').props.value).to.equal('1234567890');
  });
  it('should remove all non-digit characters on change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget
          value=""
          onChange={onChange}/>
    );
    tree.subTree('TextWidget').props.onChange('(154945 -5677');
    expect(onChange.calledWith('1549455677')).to.be.true;
  });
});
