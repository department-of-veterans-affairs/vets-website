// Dependencies.
import { expect } from 'chai';
import { shallow } from 'enzyme';

// Relative
import {
  answerReview,
  board,
  branchOfService,
  deriveIsAirForceAFRBAPortal,
  formData,
  shouldShowQuestion,
  venueAddress,
} from '../../helpers';
import { questionLabels } from '../../constants';

describe('Discharge Wizard helpers', () => {
  // This is "formValues" prop from the redux store
  const formValues = {
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

  it('helps determine if the component should render or not based on questions answered', () => {
    // shouldShowQuestion()
    const formValuesAllQuestionsListed = {
      '1_branchOfService': 'airForce',
      '2_dischargeYear': '2020',
      '3_dischargeMonth': '',
      '4_reason': null,
      '5_dischargeType': null,
      '6_intention': null,
      '7_courtMartial': null,
      '8_prevApplication': null,
      '9_prevApplicationYear': null,
      '10_prevApplicationType': null,
      '11_failureToExhaust': null,
      '12_priorService': null,
      questions: ['1_branchOfService', '2_dischargeYear', '4_reason'],
    };

    const shouldShowReasonQuestionComponent = shouldShowQuestion(
      '4_reason',
      formValuesAllQuestionsListed.questions,
    );
    const shouldNoteShowPriorServiceComponent = shouldShowQuestion(
      '12_priorService',
      formValuesAllQuestionsListed.questions,
    );

    expect(shouldShowReasonQuestionComponent).to.equal(true);
    expect(shouldNoteShowPriorServiceComponent).to.equal(false);
  });

  it('helps determine which branch to to set for branchOfService', () => {
    // branchOfService()
    expect(branchOfService('airForce')).to.equal('Air Force');
    expect(branchOfService('marines')).to.equal('Navy');
  });

  it('helps determine which board for the user to seek their request for re-review', () => {
    // board()
    const boardOfReview = board(formValues);
    expect(boardOfReview).to.deep.equal({
      name: 'Board for Correction of Military Records (BCMR)',
      abbr: 'BCMR',
    });
  });

  it('helps determine which venue address for re-review', () => {
    // venueAddress()
    const armyAddress = venueAddress(formValues);
    const tree = shallow(armyAddress);
    expect(tree.html()).to.contain(
      `<p class="va-address-block">Army Review Boards Agency<br/>251 18th Street South<br/>Suite 385<br/>Arlington, VA 22202-3531<br/></p>`,
    );
    tree.unmount();
  });

  it('helps determine which form number and portal to use', () => {
    // formData()
    const formNumber = formData(formValues);
    expect(formNumber).to.deep.equal({
      num: 149,
      link:
        'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf',
    });
  });

  it('helps determine review label from answer review component', () => {
    // answerReview()

    const label = answerReview('6_intention', {
      '1_branchOfService': 'airForce',
      '2_dischargeYear': '2020',
      '3_dischargeMonth': '',
      '4_reason': '4',
      '5_dischargeType': null,
      '6_intention': '2',
      '7_courtMartial': null,
      '8_prevApplication': null,
      '9_prevApplicationYear': null,
      '10_prevApplicationType': null,
      '11_failureToExhaust': null,
      '12_priorService': null,
      questions: [
        '1_branchOfService',
        '2_dischargeYear',
        '4_reason',
        '6_intention',
        '7_courtMartial',
      ],
    });
    expect(label).to.equal(questionLabels['6_intention'][2]);
  });

  it('helps determine if the new air force portal is to show', () => {
    // deriveIsAirForceAFRBAPortal()

    const isAirForcePortal = deriveIsAirForceAFRBAPortal({
      '1_branchOfService': 'airForce',
      '2_dischargeYear': '2020',
      '3_dischargeMonth': '',
      '4_reason': '4',
      '5_dischargeType': null,
      '6_intention': '2',
      '7_courtMartial': '1',
      '8_prevApplication': '1',
      '9_prevApplicationYear': '1',
      '10_prevApplicationType': null,
      '11_failureToExhaust': null,
      '12_priorService': '3',
      questions: [
        '1_branchOfService',
        '2_dischargeYear',
        '4_reason',
        '6_intention',
        '7_courtMartial',
        '8_prevApplication',
        '9_prevApplicationYear',
        '12_priorService',
        'END',
      ],
    });
    expect(isAirForcePortal).to.equal(true);
  });
});
