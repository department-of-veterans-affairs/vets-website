import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import RadioWidget from '../../../src/js/widgets/RadioWidget';

describe('Schemaform <RadioWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const tree = SkinDeep.shallowRender(
      <RadioWidget value onChange={onChange} options={{ enumOptions }} />,
    );
    expect(tree.everySubTree('input').length).to.equal(2);
    expect(tree.everySubTree('label')[0].text()).to.equal('Testing');
    expect(tree.everySubTree('label')[1].text()).to.equal('Testing2');
  });
  it('should render label from options', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const labels = {
      1: 'Other',
    };
    const tree = SkinDeep.shallowRender(
      <RadioWidget
        value
        onChange={onChange}
        options={{ enumOptions, labels }}
      />,
    );
    expect(tree.everySubTree('label')[0].text()).to.equal('Other');
    expect(tree.everySubTree('label')[1].text()).to.equal('Testing2');
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const tree = SkinDeep.shallowRender(
      <RadioWidget value onChange={onChange} options={{ enumOptions }} />,
    );
    tree.everySubTree('input')[0].props.onChange();
    expect(onChange.calledWith('1')).to.be.true;
  });
  it('should render nested content', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const nestedContent = {
      1: <span>Nested</span>,
    };
    const tree = SkinDeep.shallowRender(
      <RadioWidget
        value="1"
        onChange={onChange}
        options={{ enumOptions, nestedContent }}
      />,
    );

    expect(tree.subTree('.schemaform-radio-indent').text()).to.equal('Nested');
  });
  it('should not render nested content if not selected', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const nestedContent = {
      1: <span>Nested</span>,
    };
    const tree = SkinDeep.shallowRender(
      <RadioWidget
        value="2"
        onChange={onChange}
        options={{ enumOptions, nestedContent }}
      />,
    );

    expect(tree.text()).not.to.contain('Nested');
  });

  it('should add custom props', () => {
    const onChange = sinon.spy();
    const options = {
      enumOptions: [
        { label: 'Testing', value: '1' },
        { label: 'Testing2', value: '2' },
      ],
      widgetProps: {
        1: { 'data-test': 'first' },
        2: { 'data-test': 'second' },
      },
    };
    const tree = SkinDeep.shallowRender(
      <RadioWidget value onChange={onChange} options={options} />,
    );
    const inputs = tree.everySubTree('input');
    expect(inputs[0].props['data-test']).to.equal('first');
    expect(inputs[0].props['data-selected']).to.be.undefined;

    expect(inputs[1].props['data-test']).to.equal('second');
    expect(inputs[1].props['data-selected']).to.be.undefined;
  });
  it('should update selected props on radio inputs', () => {
    const onChange = sinon.spy();
    const options = {
      enumOptions: [
        { label: 'Testing', value: '1' },
        { label: 'Testing2', value: '2' },
        { label: 'Testing3', value: '3' },
      ],
      widgetProps: {
        1: { 'data-test': 'first' },
        2: { 'data-test': 'second' },
        3: { 'data-test': 'third' },
      },
      selectedProps: {
        1: { 'data-selected': 'first_1' },
        2: { 'data-selected': 'second_2' },
        3: { 'data-selected': 'third_3' },
      },
    };
    // first option selected
    const tree = SkinDeep.shallowRender(
      <RadioWidget value="1" onChange={onChange} options={options} />,
    );
    const inputsFirstSelected = tree.everySubTree('input');
    expect(inputsFirstSelected[0].props['data-test']).to.equal('first');
    expect(inputsFirstSelected[0].props['data-selected']).to.equal('first_1');
    expect(inputsFirstSelected[1].props['data-test']).to.equal('second');
    expect(inputsFirstSelected[1].props['data-selected']).to.be.undefined;
    expect(inputsFirstSelected[2].props['data-test']).to.equal('third');
    expect(inputsFirstSelected[2].props['data-selected']).to.be.undefined;

    // second option selected
    tree.reRender({ value: '2', onChange, options });
    const inputsSecondSelected = tree.everySubTree('input');
    expect(inputsSecondSelected[0].props['data-test']).to.equal('first');
    expect(inputsSecondSelected[0].props['data-selected']).to.be.undefined;
    expect(inputsSecondSelected[1].props['data-test']).to.equal('second');
    expect(inputsSecondSelected[1].props['data-selected']).to.equal('second_2');
    expect(inputsSecondSelected[2].props['data-test']).to.equal('third');
    expect(inputsSecondSelected[2].props['data-selected']).to.be.undefined;

    // third option selected
    tree.reRender({ value: '3', onChange, options });
    const inputsThirdSelected = tree.everySubTree('input');
    expect(inputsThirdSelected[0].props['data-test']).to.equal('first');
    expect(inputsThirdSelected[0].props['data-selected']).to.be.undefined;
    expect(inputsThirdSelected[1].props['data-test']).to.equal('second');
    expect(inputsThirdSelected[1].props['data-selected']).to.be.undefined;
    expect(inputsThirdSelected[2].props['data-test']).to.equal('third');
    expect(inputsThirdSelected[2].props['data-selected']).to.equal('third_3');
  });
});
