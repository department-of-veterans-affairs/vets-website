import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { BASE_URL } from '../../constants';
import HLRWizard from '../../components/HLRWizard';

const getSelected = tree =>
  tree.subTree('ErrorableRadioButtons').props.value.value;

describe('<HLRWizard>', () => {
  it('should show button and no questions', () => {
    const tree = SkinDeep.shallowRender(<HLRWizard />);
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).to.be.false;
  });
  it('should show button empty choices', () => {
    const tree = SkinDeep.shallowRender(<HLRWizard initExpanded />);
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree)).to.be.null;
    expect(tree.subTree('.usa-button')).to.be.false;
    expect(tree.subTree('AlertBox')).to.be.false;
  });

  // 3 choices
  it('should show link when "disability" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard initExpanded initChoice={'disability'} />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree)).to.equal('disability');
    expect(tree.subTree('.usa-button').props.href).to.equal(BASE_URL);
    expect(tree.subTree('AlertBox')).to.be.false;
  });
  it('should show link when "pension" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard initExpanded initChoice={'pension'} />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree)).to.equal('pension');
    expect(tree.subTree('.usa-button').props.href).to.equal(BASE_URL);
    expect(tree.subTree('AlertBox')).to.be.false;
  });
  it('should show alert when "other" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard initExpanded initChoice={'other'} />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree)).to.equal('other');
    expect(tree.subTree('.usa-button')).to.be.false;
    expect(tree.subTree('AlertBox')).not.to.be.false;
  });
});
