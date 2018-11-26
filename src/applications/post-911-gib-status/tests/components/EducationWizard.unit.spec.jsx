import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import EducationWizard from '../../components/EducationWizard';
import { wizardConfig } from '../../utils/helpers';

function getQuestion(tree, name) {
  return tree
    .everySubTree('ErrorableRadioButtons')
    .find(i => i.props.name === name);
}

function answerQuestion(tree, name, value) {
  getQuestion(tree, name).props.onValueChange({ value });
}

describe.only('<EducationWizard>', () => {
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
    expect(tree.everySubTree('ErrorableRadioButtons')).not.to.be.empty;
  });
  it('should show next relevant question', () => {
    const tree = SkinDeep.shallowRender(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    tree.getMountedInstance().setState({ open: true });
    expect(getQuestion(tree, 'existingApplication')).not.to.be.undefined;
    answerQuestion(tree, 'existingApplication', 'true');
    expect(getQuestion(tree, 'recentApplication')).not.to.be.undefined;
  });
  it('should reset after earlier answer changed', () => {
    const tree = SkinDeep.shallowRender(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    tree.getMountedInstance().setState({ open: true });
    expect(getQuestion(tree, 'existingApplication')).not.to.be.undefined;
    answerQuestion(tree, 'existingApplication', 'true');
    expect(getQuestion(tree, 'recentApplication')).not.to.be.undefined;
    answerQuestion(tree, 'recentApplication', 'true');
    answerQuestion(tree, 'existingApplication', 'false');
    answerQuestion(tree, 'existingApplication', 'true');
    expect(getQuestion(tree, 'recentApplication').props.value.value).to.be.null;
  });
  it('should support multiple previous values', () => {
    const tree = SkinDeep.shallowRender(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    tree.getMountedInstance().setState({ open: true });
    answerQuestion(tree, 'existingApplication', 'true');
    answerQuestion(tree, 'recentApplication', 'false');
    answerQuestion(tree, 'veteran', 'true');
    expect(tree.subTree('component')).not.to.be.undefined;
  });
});
