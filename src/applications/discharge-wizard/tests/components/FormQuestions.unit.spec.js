// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Link } from 'react-router';

// Relative imports
import FormQuestions from '../../components/FormQuestions';

describe('Discharge Wizard <FormQuestions />', () => {
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

  it('should render all questions', () => {
    const tree = mount(
      <FormQuestions
        formValues={formValuesAllQuestionsListed}
        updateField={sinon.stub()}
      />,
    );
    const html = tree.html();

    expect(html).to.include('In which branch of service did you serve?');
    expect(html).to.include('What year were you discharged from the military?');
    expect(html).to.include(
      'Which of the following best describes why you want to change your discharge paperwork? Choose the one that’s closest to your situation.',
    );
    expect(html).to.include(
      'Do you want to change your name, discharge date, or anything written in the “other remarks” section of your DD214?',
    );
    expect(html).to.include(
      `Was your discharge the outcome of a general court-martial?`,
    );
    expect(html).to.include(
      'Have you previously applied for and been denied a discharge upgrade for this period of service?',
    );
    expect(html).to.include(
      'Note: You can still apply. Your answer to this question simply changes where you send your application.',
    );
    expect(html).to.include('What year did you apply for a discharge upgrade?');
    expect(html).to.include(
      `What type of application did you make to upgrade your discharge previously?`,
    );
    expect(html).to.include(
      'Did you complete a period of service in which your character of service was Honorable or General Under Honorable Conditions?',
    );
    expect(html).to.include('Review your answers');
    expect(html).to.include('Get my results');
    tree.unmount();
  });

  it('should render the "Get my results button" to navigate vet to their results ', () => {
    const wrapper = mount(
      <FormQuestions
        formValues={formValuesAllQuestionsListed}
        updateField={sinon.stub()}
      />,
    );
    expect(
      wrapper.find(
        <Link to="/guidance" className="usa-button-primary va-button">
          Get my results »
        </Link>,
      ),
    );

    wrapper.unmount();
  });

  it('should only render first two questions', () => {
    const wrapper = mount(
      <FormQuestions
        formValues={{
          '1_branchOfService': 'army', // 4
          '2_dischargeYear': '', // 2
          '3_dischargeMonth': '', // 2a
          '4_reason': null, // 1
          '5_dischargeType': null, // 1a
          '6_intention': null, // 1b
          '7_courtMartial': null, // 3
          '8_prevApplication': null, // 5
          '9_prevApplicationYear': null, // 5a
          '10_prevApplicationType': null, // 5b
          '11_failureToExhaust': null, // 5c
          '12_priorService': null, // 6
          questions: ['1_branchOfService', '2_dischargeYear'],
        }}
        updateField={sinon.stub()}
      />,
    );

    expect(
      wrapper.find('va-radio[name="1_branchOfService"] va-radio-option'),
    ).to.have.lengthOf(5);
    expect(wrapper.find('va-select[name="2_dischargeYear"]')).to.have.lengthOf(
      1,
    );
    expect(wrapper.find('select[name="4_reason"]')).to.have.lengthOf(0);

    wrapper.unmount();
  });
});
