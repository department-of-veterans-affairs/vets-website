import { expect } from 'chai';

import {
  answerReviewLabel,
  determineBoardObj,
  determineAirForceAFRBAPortal,
  determineFormData,
} from '../../../helpers/index';
import {
  RESPONSES,
  SHORT_NAME_MAP,
} from '../../../constants/question-data-map';

describe('Discharge Wizard helpers', () => {
  const formResponses = {
    SERVICE_BRANCH: RESPONSES.ARMY,
    DISCHARGE_YEAR: '2022',
    DISCHARGE_MONTH: '',
    REASON: RESPONSES.REASON_1,
    DISCHARGE_TYPE: null,
    INTENTION: RESPONSES.INTENTION_YES,
    COURT_MARTIAL: RESPONSES.COURT_MARTIAL_YES,
    PREV_APPLICATION: RESPONSES.YES,
    PREV_APPLICATION_YEAR: RESPONSES.PREV_APPLICATION_BEFORE_2014,
    PREV_APPLICATION_TYPE: RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
    FAILURE_TO_EXHAUST: null,
    PRIOR_SERVICE: RESPONSES.PRIOR_SERVICE_PAPERWORK,
  };

  it('helps determine which form number and portal to use', () => {
    const formNumber = determineFormData(formResponses);
    expect(formNumber).to.deep.equal({
      num: 149,
      link:
        'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf',
    });
  });

  it('helps determine which board for the user to seek their request for re-review', () => {
    const boardOfReview = determineBoardObj(formResponses);
    expect(boardOfReview).to.deep.equal({
      name: 'Board for Correction of Military Records (BCMR)',
      abbr: 'BCMR',
    });
  });

  it('determines if the new air force portal shows', () => {
    const isAirForcePortal = determineAirForceAFRBAPortal({
      SERVICE_BRANCH: RESPONSES.AIR_FORCE,
      DISCHARGE_YEAR: '2020',
      DISCHARGE_MONTH: '',
      REASON: RESPONSES.REASON_4,
      DISCHARGE_TYPE: null,
      INTENTION: RESPONSES.INTENTION_NO,
      COURT_MARTIAL: RESPONSES.COURT_MARTIAL_YES,
      PREV_APPLICATION: RESPONSES.YES,
      PREV_APPLICATION_YEAR: null,
      PREV_APPLICATION_TYPE: null,
      FAILURE_TO_EXHAUST: null,
      PRIOR_SERVICE: RESPONSES.PRIOR_SERVICE_NO,
    });
    expect(isAirForcePortal).to.equal(true);
  });

  it('determines correct answer review label', () => {
    const serviceBranchLabel = answerReviewLabel(
      SHORT_NAME_MAP.SERVICE_BRANCH,
      formResponses,
    );
    const dischargeYearLabel = answerReviewLabel(
      SHORT_NAME_MAP.DISCHARGE_YEAR,
      formResponses,
    );

    const prevApplicationLabel = answerReviewLabel(
      SHORT_NAME_MAP.PREV_APPLICATION,
      formResponses,
    );
    const courtMartialLabel = answerReviewLabel(
      SHORT_NAME_MAP.COURT_MARTIAL,
      formResponses,
    );

    const prevApplicationTypeLabel = answerReviewLabel(
      SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
      formResponses,
    );

    expect(serviceBranchLabel).to.equal('I served in the Army.');
    expect(dischargeYearLabel).to.equal('I was discharged in  2022.');
    expect(prevApplicationLabel).to.equal(
      'I have previously applied for a discharge upgrade for this period of service.',
    );
    expect(courtMartialLabel).to.equal(RESPONSES.COURT_MARTIAL_YES);
    expect(prevApplicationTypeLabel).to.equal(
      RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
    );
  });
});
