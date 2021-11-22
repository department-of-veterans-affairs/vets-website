// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

// Relative imports.
import FormQuestions from '../../components/FormQuestions';
import { FormPage } from '../../containers/FormPage';

describe('Discharge Wizard <FormPage />', () => {
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

  it('should mount child questions component', () => {
    const tree = shallow(
      <FormPage
        formValues={formValuesAllQuestionsListed}
        updateField={() => sinon.stub()}
      />,
    );
    expect(tree.find(FormQuestions)).to.have.lengthOf(1);
    tree.unmount();
  });
});
