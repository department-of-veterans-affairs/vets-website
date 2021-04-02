import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import YesNoWidget from '../../../src/js/widgets/YesNoWidget';

describe('Schemaform <YesNoWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget value onChange={onChange} />,
    );
    expect(tree.everySubTree('input').length).to.equal(2);
    expect(tree.everySubTree('input')[0].props.checked).to.be.true;
    expect(tree.everySubTree('input')[1].props.checked).not.to.be.true;
  });
  it('should render undefined', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(<YesNoWidget onChange={onChange} />);
    expect(tree.everySubTree('input').length).to.equal(2);
    expect(tree.everySubTree('input')[0].props.checked).not.to.be.true;
    expect(tree.everySubTree('input')[1].props.checked).not.to.be.true;
  });
  it('should render false', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget value={false} onChange={onChange} />,
    );
    expect(tree.everySubTree('input').length).to.equal(2);
    expect(tree.everySubTree('input')[0].props.checked).not.to.be.true;
    expect(tree.everySubTree('input')[1].props.checked).to.be.true;
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget value={false} onChange={onChange} />,
    );
    tree.everySubTree('input')[0].props.onChange();
    expect(onChange.calledWith(true)).to.be.true;
  });
  it('should handle false change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget value={false} onChange={onChange} />,
    );
    tree.everySubTree('input')[1].props.onChange();
    expect(onChange.calledWith(false)).to.be.true;
  });
  it('should render labels', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
        value
        options={{
          labels: {
            Y: 'Whatever',
            N: 'Testing',
          },
        }}
        onChange={onChange}
      />,
    );
    expect(tree.everySubTree('label')[0].text()).to.equal('Whatever');
    expect(tree.everySubTree('label')[1].text()).to.equal('Testing');
  });
  it('should reverse value', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
        value
        options={{
          yesNoReverse: true,
        }}
        onChange={onChange}
      />,
    );

    expect(tree.everySubTree('input')[0].props.checked).to.be.false;
    expect(tree.everySubTree('input')[1].props.checked).to.be.true;
  });
  it('should add custom props', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
        value
        options={{
          yesNoReverse: true,
          widgetProps: {
            Y: { 'data-test': 'yes-input' },
            N: { 'data-test': 'no-input' },
          },
        }}
        onChange={onChange}
      />,
    );

    expect(tree.everySubTree('input')[0].props['data-test']).to.equal(
      'yes-input',
    );
    expect(tree.everySubTree('input')[1].props['data-test']).to.equal(
      'no-input',
    );
  });
  it('should add custom and "yes" selected props', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
        value
        options={{
          widgetProps: {
            Y: { 'data-test': 'yes-input' },
            N: { 'data-test': 'no-input' },
          },
          selectedProps: {
            Y: { 'data-selected': 'yes-selected' },
            N: { 'data-selected': 'no-selected' },
          },
        }}
        onChange={onChange}
      />,
    );

    const inputs = tree.everySubTree('input');
    expect(inputs[0].props['data-test']).to.equal('yes-input');
    expect(inputs[0].props['data-selected']).to.equal('yes-selected');

    expect(inputs[1].props['data-test']).to.equal('no-input');
    expect(inputs[1].props['data-selected']).to.be.undefined;
  });
  it('should add custom and "no" selected props', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
        value={false}
        options={{
          widgetProps: {
            Y: { 'data-test': 'yes-input' },
            N: { 'data-test': 'no-input' },
          },
          selectedProps: {
            Y: { 'data-selected': 'yes-selected' },
            N: { 'data-selected': 'no-selected' },
          },
        }}
        onChange={onChange}
      />,
    );

    const inputs = tree.everySubTree('input');
    expect(inputs[0].props['data-test']).to.equal('yes-input');
    expect(inputs[0].props['data-selected']).to.be.undefined;

    expect(inputs[1].props['data-test']).to.equal('no-input');
    expect(inputs[1].props['data-selected']).to.equal('no-selected');
  });
});
