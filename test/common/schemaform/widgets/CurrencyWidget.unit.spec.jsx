import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import CurrencyWidget from '../../../../src/js/common/schemaform/widgets/CurrencyWidget';

describe('Schemaform <CurrencyWidget>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <CurrencyWidget
          options={{}}
          value={178}/>
    );
    const input = tree.subTree('input');
    expect(input.props.value).to.equal('178.00');
    expect(input.props.type).to.equal('number');
  });
  it('should call onChange with parsed number when 0 filled', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <CurrencyWidget
          options={{}}
          onChange={onChange}/>
    );
    tree.subTree('input').props.onChange({
      target: {
        value: '10.00'
      }
    });
    expect(onChange.calledWith(10)).to.be.true;
  });
  it('should call onChange with undefined if the value is blank', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <CurrencyWidget
          options={{}}
          onChange={onChange}/>
    );
    tree.subTree('input').props.onChange({
      target: {
        value: ''
      }
    });
    expect(onChange.calledWith()).to.be.true;
  });
});
