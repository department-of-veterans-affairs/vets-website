import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import EducationWizard from '../../components/EducationWizard';
import wizardConfig from '../../utils/wizardConfig';

function getQuestion(tree, name) {
  return tree.everySubTree('RadioButtons').find(i => i.props.name === name);
}

function answerQuestion(tree, name, value) {
  getQuestion(tree, name).props.onValueChange({ value });
}

describe('<EducationWizard>', () => {
  it('should show button and no questions', () => {
    const tree = SkinDeep.shallowRender(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions').props.className).to.contain(
      'wizard-content-closed',
    );
  });
  it('should show button and first question', () => {
    const tree = SkinDeep.shallowRender(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    tree.getMountedInstance().setState({ open: true });
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions').props.className).not.to.contain(
      'wizard-content-closed',
    );
    expect(tree.everySubTree('RadioButtons')).not.to.be.empty;
  });
  it('should show next relevant question', () => {
    const tree = SkinDeep.shallowRender(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    tree.getMountedInstance().setState({ open: true });
    expect(getQuestion(tree, 'recentApplication')).not.to.be.undefined;
    answerQuestion(tree, 'recentApplication', 'false');
    expect(getQuestion(tree, 'veteran')).not.to.be.undefined;
  });
  it('should reset after earlier answer changed', () => {
    const tree = SkinDeep.shallowRender(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    tree.getMountedInstance().setState({ open: true });
    expect(getQuestion(tree, 'recentApplication')).not.to.be.undefined;
    answerQuestion(tree, 'recentApplication', 'false');
    expect(getQuestion(tree, 'veteran')).not.to.be.undefined;
    answerQuestion(tree, 'veteran', 'true');
    answerQuestion(tree, 'recentApplication', 'false');
    expect(getQuestion(tree, 'veteran').props.value.value).to.be.null;
    answerQuestion(tree, 'recentApplication', 'true');
    // we now expect an error message instead of the next question
    expect(getQuestion(tree, 'veteran')).to.be.undefined;
  });
});
