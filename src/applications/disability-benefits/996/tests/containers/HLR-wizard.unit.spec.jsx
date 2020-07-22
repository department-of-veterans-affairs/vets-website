import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { BASE_URL } from '../../constants';
import { HLRWizard, name } from '../../components/HLRWizard';

const getSelected = (tree, group) => {
  // return tree.subTree(`.higher-level-review-${name}`).props.value.value;
  const buttons = tree.everySubTree('ErrorableRadioButtons');
  return buttons.find(
    button => button.props.id === `higher-level-review-${group}`,
  )?.props.value?.value;
};

describe('<HLRWizard>', () => {
  it('should show button and no questions (collapsed)', () => {
    const tree = SkinDeep.shallowRender(<HLRWizard testHlr />);
    const button = tree.subTree('button');
    expect(button).not.to.be.false;
    expect(button.props['aria-expanded']).to.be.false;
    expect(button.props.className).to.include('va-button-primary');
    expect(tree.subTree('#wizardOptions')).to.be.false;
  });

  // Claim choices
  it('should show empty claim button choices (expanded)', () => {
    const tree = SkinDeep.shallowRender(<HLRWizard testHlr initExpanded />);
    const button = tree.subTree('button');
    expect(button).not.to.be.false;
    expect(button.props['aria-expanded']).not.to.be.false;
    expect(button.props.className).not.to.include('va-button-primary');
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree, 'claims')).to.be.undefined;
    expect(tree.subTree(`${name}-legacy`)).to.be.false;
    expect(tree.subTree('.usa-button')).to.be.false;
    expect(tree.subTree('AlertBox')).to.be.false;
  });
  it('should show alert when "other" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard testHlr initExpanded initClaimChoice={'other'} />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree, 'claim')).to.equal('other');
    expect(tree.subTree(`${name}-legacy`)).to.be.false;
    expect(tree.subTree('.usa-button')).to.be.false;
    expect(tree.subTree('AlertBox')).not.to.be.false;
  });

  it('should show legacy choices when "compensation" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard testHlr initExpanded initClaimChoice={'compensation'} />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree, 'claim')).to.equal('compensation');
    expect(getSelected(tree, 'legacy')).to.be.null;
    expect(tree.subTree('.usa-button')).to.be.false;
    expect(tree.subTree('AlertBox')).to.be.false;
  });

  it('should show alert when "other" & "yes" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard
        testHlr
        initExpanded
        initClaimChoice={'compensation'}
        initLegacyChoice={'yes'}
      />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree, 'claim')).to.equal('compensation');
    expect(getSelected(tree, 'legacy')).to.equal('yes');
    expect(tree.subTree('.usa-button')).to.be.false;
    expect(tree.subTree('AlertBox')).not.to.be.false;
  });
  it('should show link to HLR when "compensation" & "no" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard
        testHlr
        initExpanded
        initClaimChoice={'compensation'}
        initLegacyChoice={'no'}
      />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree, 'claim')).to.equal('compensation');
    expect(getSelected(tree, 'legacy')).to.equal('no');
    expect(tree.subTree('.usa-button')).not.to.be.false;
    expect(tree.subTree('.usa-button').props.href).to.equal(BASE_URL);
    expect(tree.subTree('AlertBox')).to.be.false;
  });
});
