// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

// Relative imports.
import CarefulConsiderationStatement from '../../components/CarefulConsiderationStatement';
import StepOne from '../../components/gpSteps/StepOne';
import StepTwo from '../../components/gpSteps/StepTwo';
import StepThree from '../../components/gpSteps/StepThree';
import { GuidancePage } from '../../containers/GuidancePage';

describe('Discharge Wizard <GuidancePage />', () => {
  const reactRouterStub = {
    push: () => sinon.stub(),
  };
  // This is "formValues" prop from the redux store
  const formValuesAllQuestionsListed = {
    '1_branchOfService': 'army', // 4
    '2_dischargeYear': '2021', // 2
    '3_dischargeMonth': '', // 2a
    '4_reason': '1', // 1
    '5_dischargeType': null, // 1a
    '6_intention': '1', // 1b
    '7_courtMartial': '1', // 3
    '8_prevApplication': '1', // 5
    '9_prevApplicationYear': '1', // 5a
    '10_prevApplicationType': '1', // 5b
    '11_failureToExhaust': null, // 5c
    '12_priorService': '1', // 6
    questions: [
      '1_branchOfService',
      '2_dischargeYear',
      '4_reason',
      '6_intention',
      '7_courtMartial',
      '8_prevApplication',
      '9_prevApplicationYear',
      '10_prevApplicationType',
      '12_priorService',
      'END',
    ],
  };

  it('should mount child CarefulConsiderationStatement component', () => {
    const tree = mount(
      <GuidancePage
        formValues={formValuesAllQuestionsListed}
        router={reactRouterStub}
      />,
    );
    expect(tree.find(CarefulConsiderationStatement)).to.have.lengthOf(1);
    tree.unmount();
  });

  it('should mount 3 instructional steps for Vet', () => {
    const tree = mount(
      <GuidancePage
        formValues={formValuesAllQuestionsListed}
        router={reactRouterStub}
      />,
    );
    expect(tree.find(StepOne)).to.have.lengthOf(1);
    expect(tree.find(StepTwo)).to.have.lengthOf(1);
    expect(tree.find(StepThree)).to.have.lengthOf(1);
    tree.unmount();
  });

  it('should mount 1 button to download DoD form', () => {
    const tree = mount(
      <GuidancePage
        formValues={formValuesAllQuestionsListed}
        router={reactRouterStub}
      />,
    );
    expect(tree.find('va-link[text*="Download Form"]')).to.have.lengthOf(1);
    tree.unmount();
  });

  it('should have 1 button for the vet to print the page', () => {
    const tree = mount(
      <GuidancePage
        formValues={formValuesAllQuestionsListed}
        router={reactRouterStub}
      />,
    );
    const content = tree.find('va-button[text="Print this page"]');
    expect(content).to.not.be.null;
    tree.unmount();
  });
});
