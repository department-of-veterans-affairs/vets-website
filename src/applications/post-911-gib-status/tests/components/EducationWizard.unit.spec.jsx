import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import ReactDOM from 'react-dom';

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
    const dom = document.createElement('div');
    ReactDOM.render(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
      dom,
    );

    expect(dom.querySelector('button')).not.to.be.false;
    expect(dom.querySelector('#wizardOptions').className).to.contain(
      'wizard-content-closed',
    );
  });
  it('should show button and first question', () => {
    const dom = document.createElement('div');
    ReactDOM.render(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
      dom,
    ).setState({ open: true });

    expect(dom.querySelector('button')).not.to.be.false;
    expect(dom.querySelector('#wizardOptions').className).not.to.contain(
      'wizard-content-closed',
    );
    expect(dom.querySelector('va-radio')).not.to.be.empty;
  });
  it.skip('should show next relevant question', () => {
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
  it.skip('should reset after earlier answer changed', () => {
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
