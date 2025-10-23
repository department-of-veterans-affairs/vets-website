import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import SelectWidget from '../../../src/js/widgets/SelectWidget';

describe('Schemaform <SelectWidget>', () => {
  it('should render', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    ).dive(['SelectWidget']);

    expect(tree.everySubTree('option').length).to.equal(2);
  });
  it('should render label from options', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const labels = {
      testValue: 'Other',
    };
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions, labels }}
      />,
    ).dive(['SelectWidget']);

    expect(tree.everySubTree('option')[1].text()).to.equal('Other');
  });
  it('should render widgetProps from options', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const widgetProps = { 'aria-label': 'testing' };

    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions, widgetProps }}
      />,
    ).dive(['SelectWidget']);

    expect(tree.subTree('select').props['aria-label']).to.eq('testing');
  });
  it('should render selectedProps from options', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const selectedProps = { testValue: { 'data-value': 'ok-test' } };
    const props = {
      schema: {},
      id: 'testing',
      options: { enumOptions, selectedProps },
    };

    const tree = SkinDeep.shallowRender(<SelectWidget {...props} />).dive([
      'SelectWidget',
    ]);

    expect(tree.subTree('select').props['data-value']).to.not.exist;
    tree.reRender({ value: 'testValue', ...props });
    expect(tree.subTree('select').props['data-value']).to.equal('ok-test');
  });
  it('should handle change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    ).dive(['SelectWidget']);

    tree.subTree('select').props.onChange({
      target: {
        value: '',
      },
    });
    expect(onChange.firstCall.args[0]).to.be.undefined;
    tree.subTree('select').props.onChange({
      target: {
        value: 'testValue',
      },
    });
    expect(onChange.secondCall.args[0]).to.equal('testValue');
  });
  it('should handle number change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 2,
      },
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{ type: 'number' }}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    ).dive(['SelectWidget']);

    tree.subTree('select').props.onChange({
      target: {
        value: '2',
      },
    });
    expect(onChange.calledWith(2)).to.be.true;
  });
  it('should handle boolean change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 2,
      },
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{ type: 'boolean' }}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    ).dive(['SelectWidget']);

    tree.subTree('select').props.onChange({
      target: {
        value: 'true',
      },
    });
    expect(onChange.calledWith(true)).to.be.true;
  });
  it('should handle blur', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onBlur = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{}}
        id="testing"
        onBlur={onBlur}
        options={{ enumOptions }}
      />,
    ).dive(['SelectWidget']);

    tree.subTree('select').props.onBlur({
      target: {
        value: 'testValue',
      },
    });
    expect(onBlur.calledWith('testing', 'testValue')).to.be.true;
  });
  it('should not render blank option when default exists', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <SelectWidget
        schema={{
          default: 'testValue',
        }}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    ).dive(['SelectWidget']);

    expect(tree.everySubTree('option').length).to.equal(1);
  });
});
