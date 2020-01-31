import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { BASE_URL } from '../../constants';
import HLRWizard from '../../components/HLRWizard';

const getSelected = tree =>
  tree.subTree('ErrorableRadioButtons').props.value.value;

describe('<HLRWizard>', () => {
  it('should show button and no questions (collapsed)', () => {
    const tree = SkinDeep.shallowRender(<HLRWizard />);
    const button = tree.subTree('button');
    expect(button).not.to.be.false;
    expect(button.props['aria-expanded']).to.be.false;
    expect(button.props.className).to.include('va-button-primary');
    expect(tree.subTree('#wizardOptions')).to.be.false;
  });
  it('should show button empty choices (expanded)', () => {
    const tree = SkinDeep.shallowRender(<HLRWizard initExpanded />);
    const button = tree.subTree('button');
    expect(button).not.to.be.false;
    expect(button.props['aria-expanded']).not.to.be.false;
    expect(button.props.className).not.to.include('va-button-primary');
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree)).to.be.null;
    expect(tree.subTree('.usa-button')).to.be.false;
    expect(tree.subTree('AlertBox')).to.be.false;
  });

  // 2 choices
  it('should show link when "compensation" is chosen', () => {
    const tree = SkinDeep.shallowRender(
      <HLRWizard initExpanded initChoice={'compensation'} />,
    );
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions')).not.to.be.false;
    expect(getSelected(tree)).to.equal('compensation');
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
