import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import SelectWidget from '../../../../src/js/common/schemaform/widgets/SelectWidget';

describe('Schemaform <SelectWidget>', () => {
  it('should render', () => {
    const enumOptions = [
      {
        label: 'Testing',
        val: 'test'
      }
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
          schema={{}}
          id="testing"
          onChange={onChange}
          options={{ enumOptions }}/>
    );

    expect(tree.everySubTree('option').length).to.equal(2);
  });
  it('should handle change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        val: 'test'
      }
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
          schema={{}}
          id="testing"
          onChange={onChange}
          options={{ enumOptions }}/>
    );

    tree.subTree('select').props.onChange({
      target: {
        value: ''
      }
    });
    expect(onChange.firstCall.args[0]).to.be.undefined;
    tree.subTree('select').props.onChange({
      target: {
        value: 'test'
      }
    });
    expect(onChange.secondCall.args[0]).to.equal('test');
  });
  it('should handle number change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        val: 2
      }
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
          schema={{ type: 'number' }}
          id="testing"
          onChange={onChange}
          options={{ enumOptions }}/>
    );

    tree.subTree('select').props.onChange({
      target: {
        value: '2'
      }
    });
    expect(onChange.calledWith(2)).to.be.true;
  });
  it('should handle boolean change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        val: 2
      }
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
          schema={{ type: 'boolean' }}
          id="testing"
          onChange={onChange}
          options={{ enumOptions }}/>
    );

    tree.subTree('select').props.onChange({
      target: {
        value: 'true'
      }
    });
    expect(onChange.calledWith(true)).to.be.true;
  });
  it('should handle blur', () => {
    const enumOptions = [
      {
        label: 'Testing',
        val: 'test'
      }
    ];
    const onBlur = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
          schema={{}}
          id="testing"
          onBlur={onBlur}
          options={{ enumOptions }}/>
    );

    tree.subTree('select').props.onBlur({
      target: {
        value: 'test'
      }
    });
    expect(onBlur.calledWith('testing', 'test')).to.be.true;
  });
});
