import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import YesNoWidget from '../../../../src/js/common/schemaform/widgets/YesNoWidget';

describe('Schemaform <YesNoWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
          value
          onChange={onChange}/>
    );
    expect(tree.everySubTree('input').length).to.equal(2);
    expect(tree.everySubTree('input')[0].props.checked).to.be.true;
    expect(tree.everySubTree('input')[1].props.checked).not.to.be.true;
  });
  it('should render undefined', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
          onChange={onChange}/>
    );
    expect(tree.everySubTree('input').length).to.equal(2);
    expect(tree.everySubTree('input')[0].props.checked).not.to.be.true;
    expect(tree.everySubTree('input')[1].props.checked).not.to.be.true;
  });
  it('should render false', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
          value={false}
          onChange={onChange}/>
    );
    expect(tree.everySubTree('input').length).to.equal(2);
    expect(tree.everySubTree('input')[0].props.checked).not.to.be.true;
    expect(tree.everySubTree('input')[1].props.checked).to.be.true;
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
          value={false}
          onChange={onChange}/>
    );
    tree.everySubTree('input')[0].props.onChange();
    expect(onChange.calledWith(true)).to.be.true;
  });
  it('should handle false change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <YesNoWidget
          value={false}
          onChange={onChange}/>
    );
    tree.everySubTree('input')[1].props.onChange();
    expect(onChange.calledWith(false)).to.be.true;
  });
});
