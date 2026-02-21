import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  answerReviewLabel,
  determineBoardObj,
  determineVenueAddress,
  determineAirForceAFRBAPortal,
  determineFormData,
  handleDD215Update,
  isPreviousApplicationYear,
  shouldReapplyToBoard,
  isDocumentaryOrNotSure,
  handleDRBExplanation,
  renderMedicalRecordInfo,
  getBoardExplanation,
} from '../../helpers/index';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

describe('Discharge Wizard helpers', () => {
  it('helps determine which form number and portal to use', () => {
    const formResponses = {
      SERVICE_BRANCH: RESPONSES.ARMY,
      DISCHARGE_YEAR: '2022',
      DISCHARGE_MONTH: '',
      REASON: RESPONSES.REASON_PTSD,
      DISCHARGE_TYPE: null,
      INTENTION: RESPONSES.INTENTION_YES,
      COURT_MARTIAL: RESPONSES.COURT_MARTIAL_YES,
      PREV_APPLICATION: RESPONSES.YES,
      PREV_APPLICATION_YEAR: RESPONSES.PREV_APPLICATION_BEFORE_2014,
      PREV_APPLICATION_TYPE: RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
      FAILURE_TO_EXHAUST: null,
      PRIOR_SERVICE: RESPONSES.PRIOR_SERVICE_PAPERWORK_YES,
    };
    const formNumber = determineFormData(formResponses);
    expect(formNumber).to.deep.equal({
      formDescription:
        'Correction of Military Record Under the Provisions of Title 10, U.S. Code, Section 1552 (DD Form 149)',
      num: 149,
      link:
        'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf',
    });
  });

  it('helps determine which board for the user to seek their request for re-review', () => {
    const formResponses = {
      SERVICE_BRANCH: RESPONSES.ARMY,
      DISCHARGE_YEAR: '2022',
      DISCHARGE_MONTH: '',
      REASON: RESPONSES.REASON_PTSD,
      DISCHARGE_TYPE: null,
      INTENTION: RESPONSES.INTENTION_YES,
      COURT_MARTIAL: RESPONSES.COURT_MARTIAL_YES,
      PREV_APPLICATION: RESPONSES.YES,
      PREV_APPLICATION_YEAR: RESPONSES.PREV_APPLICATION_BEFORE_2014,
      PREV_APPLICATION_TYPE: RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
      FAILURE_TO_EXHAUST: null,
      PRIOR_SERVICE: RESPONSES.PRIOR_SERVICE_PAPERWORK_YES,
    };
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
      DISCHARGE_MONTH: '2',
      REASON: RESPONSES.REASON_SEXUAL_ASSAULT,
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
    const formResponses = {
      SERVICE_BRANCH: RESPONSES.ARMY,
      DISCHARGE_YEAR: '2022',
      DISCHARGE_MONTH: '',
      REASON: RESPONSES.REASON_PTSD,
      DISCHARGE_TYPE: null,
      INTENTION: RESPONSES.INTENTION_YES,
      COURT_MARTIAL: RESPONSES.COURT_MARTIAL_YES,
      PREV_APPLICATION: RESPONSES.YES,
      PREV_APPLICATION_YEAR: RESPONSES.PREV_APPLICATION_BEFORE_2014,
      PREV_APPLICATION_TYPE: RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
      FAILURE_TO_EXHAUST: null,
      PRIOR_SERVICE: RESPONSES.PRIOR_SERVICE_PAPERWORK_YES,
    };

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

    const dischargeMonthLabel = answerReviewLabel(
      SHORT_NAME_MAP.DISCHARGE_MONTH,
      formResponses,
    );

    const prevApplicationTypeLabel = answerReviewLabel(
      SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
      formResponses,
    );

    const notSureCourtMartialLabel = answerReviewLabel(
      SHORT_NAME_MAP.COURT_MARTIAL,
      { [SHORT_NAME_MAP.COURT_MARTIAL]: RESPONSES.NOT_SURE },
    );

    const prevAppYearLabel = answerReviewLabel(
      SHORT_NAME_MAP.PREV_APPLICATION_YEAR,
      {
        [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]:
          RESPONSES.PREV_APPLICATION_AFTER_2014,
      },
    );

    const notSurePrevAppTypeLabel = answerReviewLabel(
      SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
      { [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.NOT_SURE },
    );

    expect(serviceBranchLabel).to.equal('I served in the Army.');
    expect(dischargeYearLabel).to.equal('I was discharged in 2022.');
    expect(notSureCourtMartialLabel).to.equal(
      `I'm not sure if my discharge was the outcome of a general court-martial.`,
    );
    expect(notSurePrevAppTypeLabel).to.equal(
      `I'm not sure what kind of discharge upgrade application I previously made.`,
    );
    expect(dischargeMonthLabel).to.equal('');
    expect(prevAppYearLabel).to.equal(
      'I made my previous application after 2014.',
    );
    expect(prevApplicationLabel).to.equal(
      'I have previously applied for a discharge upgrade for this period of service.',
    );
    expect(courtMartialLabel).to.equal(RESPONSES.COURT_MARTIAL_YES);
    expect(prevApplicationTypeLabel).to.equal(
      RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
    );
  });

  describe('determineVenueAddress', () => {
    it('should render Army Review Boards Agency address for Army with DRB', () => {
      const formResponses = {
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.ARMY,
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.YES,
      };
      const noDRB = false;

      const { container } = render(determineVenueAddress(formResponses, noDRB));

      expect(container.textContent).to.contain('Army Review Boards Agency');
      expect(container.textContent).to.contain('251 18th Street South');
      expect(container.textContent).to.contain('Suite 385');
      expect(container.textContent).to.contain('Arlington, VA 22202-3531');
    });

    it('should render Air Force Discharge Review Board address for Air Force with AFDRB', () => {
      const formResponses = {
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.AIR_FORCE,
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.YES,
      };
      const noDRB = false;

      const { container } = render(determineVenueAddress(formResponses, noDRB));

      expect(container.textContent).to.contain(
        'Air Force Board for Correction of Military Records',
      );
      expect(container.textContent).to.contain('3351 Celmers Lane');
      expect(container.textContent).to.contain(
        'Joint Base Andrews, MD 20762-6435',
      );
    });

    it('should render Coast Guard address when Coast Guard is selected with DRB', () => {
      const formResponses = {
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.COAST_GUARD,
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.YES,
        [SHORT_NAME_MAP.COURT_MARTIAL]: RESPONSES.COURT_MARTIAL_YES,
      };
      const noDRB = false;

      const { container } = render(determineVenueAddress(formResponses, noDRB));

      expect(container.textContent).to.contain(
        'DHS Office of the General Counsel',
      );
      expect(container.textContent).to.contain(
        'Board for Correction of Military Records, Stop 0485',
      );
      expect(container.textContent).to.contain(
        '2707 Martin Luther King Jr. Ave., SE',
      );
      expect(container.textContent).to.contain('Washington, DC 20528');
    });

    it('should render Navy address when Navy or Marines is selected with DRB', () => {
      const formResponses = {
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.NAVY,
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.YES,
        [SHORT_NAME_MAP.COURT_MARTIAL]: RESPONSES.COURT_MARTIAL_NO,
      };
      const noDRB = true;

      const { container } = render(determineVenueAddress(formResponses, noDRB));

      expect(container.textContent).to.contain(
        'Board for Correction of Naval Records',
      );
      expect(container.textContent).to.contain(
        '701 S. Courthouse Road, Suite 1001',
      );
      expect(container.textContent).to.contain('Arlington, VA 22204-2490');
    });

    it('should render the Board for Correction of Military Records address if no DRB', () => {
      const formResponses = {
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.ARMY,
      };
      const noDRB = true;

      const { container } = render(determineVenueAddress(formResponses, noDRB));

      expect(container.textContent).to.contain('Army Review Boards Agency');
      expect(container.textContent).to.contain('251 18th Street South');
      expect(container.textContent).to.contain('Suite 385');
      expect(container.textContent).to.contain('Arlington, VA 22202-3531');
    });

    it('should return null if no formResponses are provided', () => {
      const { container } = render(determineVenueAddress(null, false));
      expect(container).to.be.empty;
    });
  });

  describe('handleDD215Update', () => {
    it('should return the appropriate message when old discharge is provided', () => {
      const boardToSubmit = {
        name: 'Board for Correction of Military Records (BCMR)',
        abbr: 'BCMR',
      };
      const prevAppType = RESPONSES.PREV_APPLICATION_BCMR;
      const oldDischarge = true;

      const result = handleDD215Update(
        boardToSubmit,
        prevAppType,
        oldDischarge,
      );
      expect(result).to.equal(
        'the Board for Correction of Military Records (BCMR). The BCMR was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.',
      );
    });

    it('should return the appropriate message when old discharge is provided', () => {
      const boardToSubmit = {
        name: 'Discharge Review Board (DRB)',
        abbr: 'DRB',
      };
      const prevAppType = RESPONSES.PREV_APPLICATION_DRB_PERSONAL;
      const oldDischarge = true;

      const result = handleDD215Update(
        boardToSubmit,
        prevAppType,
        oldDischarge,
      );
      expect(result).to.equal(
        'the Discharge Review Board (DRB). The Board handles all cases from 15 or more years ago.',
      );
    });
  });

  describe('isPreviousApplicationYear', () => {
    it('should return true for valid previous application years', () => {
      const result = isPreviousApplicationYear(
        RESPONSES.PREV_APPLICATION_BEFORE_2011,
      );
      expect(result).to.be.true;
    });

    it('should return false for invalid previous application years', () => {
      const result = isPreviousApplicationYear(
        RESPONSES.PREV_APPLICATION_BEFORE_2020,
      );
      expect(result).to.be.false;
    });
  });

  describe('shouldReapplyToBoard', () => {
    it('should return true if prevAppType and failure conditions are met', () => {
      const prevAppType = RESPONSES.PREV_APPLICATION_BCMR;
      const formResponses = {
        [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]:
          RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
      };

      const result = shouldReapplyToBoard(prevAppType, formResponses);
      expect(result).to.be.true;
    });

    it('should return false if failure condition is not met', () => {
      const prevAppType = RESPONSES.PREV_APPLICATION_BCMR;
      const formResponses = {
        [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]: RESPONSES.NO,
      };

      const result = shouldReapplyToBoard(prevAppType, formResponses);
      expect(result).to.be.false;
    });
  });

  describe('isDocumentaryOrNotSure', () => {
    it('should return true if prevAppType is DOCUMENTARY or NOT_SURE', () => {
      let prevAppType = RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY;
      expect(isDocumentaryOrNotSure(prevAppType)).to.be.true;

      prevAppType = RESPONSES.NOT_SURE;
      expect(isDocumentaryOrNotSure(prevAppType)).to.be.true;
    });

    it('should return false if prevAppType is neither DOCUMENTARY nor NOT_SURE', () => {
      const prevAppType = RESPONSES.PREV_APPLICATION_BCMR;
      expect(isDocumentaryOrNotSure(prevAppType)).to.be.false;
    });
  });

  describe('handleDRBExplanation', () => {
    it('should return the correct DRB explanation for the given service branch', () => {
      const boardToSubmit = {
        abbr: 'DRB',
        name: 'Discharge Review Board (DRB)',
      };
      const serviceBranch = 'Army';
      const prevAppType = RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY;

      const result = handleDRBExplanation(
        boardToSubmit,
        serviceBranch,
        prevAppType,
      );
      expect(result).to.include(
        'the Discharge Review Board (DRB) for the Army',
      );
      expect(result).to.include(
        'Because your application was rejected by the DRB on Documentary Review',
      );
    });

    it('should return the correct explanation if no documentary rejection', () => {
      const boardToSubmit = {
        abbr: 'DRB',
        name: 'Discharge Review Board (DRB)',
      };
      const serviceBranch = 'Army';
      const prevAppType = RESPONSES.PREV_APPLICATION_DRB_PERSONAL;

      const result = handleDRBExplanation(
        boardToSubmit,
        serviceBranch,
        prevAppType,
      );
      expect(result).to.include(
        'the Discharge Review Board (DRB) for the Army',
      );
      expect(result).to.not.include(
        'Because your application was rejected by the DRB on Documentary Review',
      );
    });
  });

  describe('getBoardExplanation', () => {
    it('should return explanation for DD215 update', () => {
      const formResponses = {
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.YES,
        [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]:
          RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).to.include(
        `the Discharge Review Board (DRB). The DRB was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.`,
      );
    });

    it('should return explanation for DRB Personal', () => {
      const formResponses = {
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_PTSD,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]:
          RESPONSES.PREV_APPLICATION_DRB_PERSONAL,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.YES,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).to.include(
        `This is because your application was denied by the Discharge Review Board (DRB) on a Personal Appearance Review.`,
      );
    });

    it('should return explanation for should reapply', () => {
      const formResponses = {
        [SHORT_NAME_MAP.COURT_MARTIAL]: RESPONSES.COURT_MARTIAL_YES,
        [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]:
          RESPONSES.PREV_APPLICATION_AFTER_2014,
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.COAST_GUARD,
        [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]:
          RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).to.include(
        'If you’ve applied before, you must re-apply to the BCMR for reconsideration.',
      );
    });

    it('should return explanation for should reapply to the AFDRB', () => {
      const formResponses = {
        [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]:
          RESPONSES.PREV_APPLICATION_AFTER_2014,
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.AIR_FORCE,
        [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]:
          RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).to.include(
        'the AFDRB. If you’ve applied before, you must re-apply to the AFDRB for reconsideration.',
      );
    });

    it('should return explanation for previous application year before 2011', () => {
      const formResponses = {
        [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]:
          RESPONSES.PREV_APPLICATION_BEFORE_2011,
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.ARMY,
        [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]:
          RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).to.include('the Discharge Review Board (DRB)');
      expect(explanation).to.include(
        'the Boards may treat your application as a new case',
      );
    });

    it('should return explanation for a court martial', () => {
      const formResponses = {
        [SHORT_NAME_MAP.COURT_MARTIAL]: RESPONSES.COURT_MARTIAL_YES,
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.NAVY,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.NO,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
        [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]:
          RESPONSES.PREV_APPLICATION_AFTER_2014,
        [SHORT_NAME_MAP.DISCHARGE_YEAR]: 2024,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).to.include('the BCNR for the Navy.');
      expect(explanation).to.include(
        'This is because your discharge was the result of a general court-martial.',
      );
    });

    it('should return explanation for failure to exhaust and DRB', () => {
      const formResponses = {
        [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]:
          RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.ARMY,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).to.include(
        'the Discharge Review Board (DRB) for the Army',
      );
      expect(explanation).to.include(
        'The DRB is a panel of commissioned officers, or a mix of senior non-commissioned officers (NCOs) and officers',
      );
    });

    it('should return explanation for discharge', () => {
      const formResponses = {
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_TRANSGENDER,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.NOT_SURE,
        [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.NAVY,
        [SHORT_NAME_MAP.PREV_APPLICATION]: RESPONSES.NO,
        [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: RESPONSES.PREV_APPLICATION_BCMR,
        [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]:
          RESPONSES.PREV_APPLICATION_AFTER_2014,
        [SHORT_NAME_MAP.DISCHARGE_YEAR]: 2024,
      };

      const explanation = getBoardExplanation(formResponses);

      expect(explanation).include(
        'the BCNR for the Navy. This is because you want to change information other than your characterization of discharge, re-enlistment code, separation code, and narrative reason for discharge.',
      );
    });
  });

  describe('renderMedicalRecordInfo', () => {
    it('should render medical records information for PTSD', () => {
      const formResponses = {
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_PTSD,
        [SHORT_NAME_MAP.DISCHARGE_YEAR]: '2000',
      };

      const { getByText } = render(renderMedicalRecordInfo(formResponses));

      expect(getByText('You’ll need to submit copies of your medical records.'))
        .to.exist;
      expect(
        getByText(
          'If you’ve seen a non-VA health care provider for diagnosis or treatment of PTSD or another mental health condition,',
          { exact: false },
        ),
      ).to.exist;
    });

    it('should render medical records information for TBI', () => {
      const formResponses = {
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_TBI,
        [SHORT_NAME_MAP.DISCHARGE_YEAR]: '2000',
      };

      const { getByText } = render(renderMedicalRecordInfo(formResponses));

      expect(
        getByText(
          'If you’ve seen a non-VA health care provider for diagnosis or treatment of TBI,',
          { exact: false },
        ),
      ).to.exist;
    });

    it('should render medical records information for sexual assault', () => {
      const formResponses = {
        [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_SEXUAL_ASSAULT,
        [SHORT_NAME_MAP.DISCHARGE_YEAR]: '2000',
      };

      const { getByText } = render(renderMedicalRecordInfo(formResponses));

      expect(
        getByText(
          'If you’ve seen a non-VA health care provider for for treatment after your assault or harassment,',
          { exact: false },
        ),
      ).to.exist;
    });

    it('should not render anything if reason is not related to medical records', () => {
      const formResponses = {
        [SHORT_NAME_MAP.REASON]: 'Other Reason',
        [SHORT_NAME_MAP.DISCHARGE_YEAR]: '2000',
      };

      const { queryByText } = render(renderMedicalRecordInfo(formResponses));

      expect(
        queryByText('You’ll need to submit copies of your medical records.'),
      ).to.not.exist;
    });
  });
});
