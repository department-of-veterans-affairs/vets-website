import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import * as scrollUtils from 'platform/utilities/scroll/scroll';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as page from '../../utils/page';
import { ANCHOR_LINKS } from '../../constants';

import {
  groupTimelineActivity,
  isPopulatedClaim,
  getDocTypeDescription,
  displayFileSize,
  getItemDate,
  getUserPhase,
  getUserPhaseDescription,
  getPhaseDescription,
  getStatusDescription,
  getStatusMap,
  getClaimStatusDescription,
  isClaimComplete,
  isClaimOpen,
  isDisabilityCompensationClaim,
  makeAuthRequest,
  getClaimType,
  mockData,
  roundToNearest,
  groupClaimsByDocsNeeded,
  claimAvailable,
  getClaimPhaseTypeHeaderText,
  getPhaseItemText,
  getUploadErrorMessage,
  getClaimPhaseTypeDescription,
  setPageFocus,
  setTabDocumentTitle,
  sentenceCase,
  generateClaimTitle,
  getShowEightPhases,
  getTimezoneDiscrepancyMessage,
  showTimezoneDiscrepancyMessage,
  formatUploadDateTime,
} from '../../utils/helpers';

import {
  getAlertContent,
  getStatusContents,
  getNextEvents,
  makeDecisionReviewContent,
  addStatusToIssues,
  isolateAppeal,
  STATUS_TYPES,
  AOJS,
  getPageRange,
  sortByLastUpdated,
} from '../../utils/appeals-v2-helpers';

describe('Disability benefits helpers: ', () => {
  describe('groupClaimsByDocsNeeded', () => {
    const claims = [
      {
        claimId: 1,
        type: 'evss_claims',
        attributes: {
          updatedAt: '2010-01-01T00:00:00.000Z',
          documentsNeeded: true,
          phase: 3,
        },
      },
      {
        claimId: 2,
        type: 'claim',
        attributes: {
          claimPhaseDates: { phaseChangeDate: '2015-01-01' },
          documentsNeeded: false,
          status: 'evidence_gathering_review_decision',
        },
      },
      {
        claimId: 3,
        type: 'evss_claims',
        attributes: {
          claimPhaseDates: { phaseChangeDate: '2020-01-01' },
          updatedAt: '2020-01-01T00:00:00.000Z',
          documentsNeeded: true,
          phase: 3,
        },
      },
      {
        claimId: 4,
        type: 'claim',
        attributes: {
          claimPhaseDates: { phaseChangeDate: '2013-01-01' },
          documentsNeeded: true,
          status: 'complete',
        },
      },
    ];

    it('should always raise the grouped claims to the top', () => {
      const sortedClaims = claims.sort(sortByLastUpdated);
      const groupedClaims = groupClaimsByDocsNeeded(sortedClaims);

      expect(groupedClaims[0].attributes.documentsNeeded).to.be.true;
      expect(groupedClaims[1].attributes.documentsNeeded).to.be.true;
      expect(groupedClaims[2].attributes.documentsNeeded).to.be.false;
      expect(groupedClaims[3].attributes.documentsNeeded).to.be.true;
    });

    it('should preserve the order within the group and outside it', () => {
      const sortedClaims = claims.sort(sortByLastUpdated);
      const groupedClaims = groupClaimsByDocsNeeded(sortedClaims);

      expect(groupedClaims[0].claimId).to.equal(3);
      expect(groupedClaims[1].claimId).to.equal(1);
      expect(groupedClaims[2].claimId).to.equal(2);
      expect(groupedClaims[3].claimId).to.equal(4);
    });

    it('should not include non-evidence-gathering phased items in the group', () => {
      const sortedClaims = claims.sort(sortByLastUpdated);
      const groupedClaims = groupClaimsByDocsNeeded(sortedClaims);

      expect(groupedClaims[0].claimId).to.equal(3);
      expect(groupedClaims[1].claimId).to.equal(1);
      expect(groupedClaims[2].claimId).to.equal(2);
      expect(groupedClaims[3].claimId).to.equal(4);
    });
  });

  describe('groupTimelineActivity', () => {
    it('should group events before a phase into phase 1', () => {
      const events = [
        {
          type: 'filed',
          date: '2010-05-03',
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[1][0].type).to.equal('filed');
    });

    it('should filter out events without a date', () => {
      const events = [
        {
          type: 'filed',
          date: null,
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity).to.be.empty;
    });

    it('should group events after phase 1 into phase 2', () => {
      const events = [
        {
          type: 'some_event',
          date: '2010-05-05',
        },
        {
          type: 'some_event',
          date: '2010-05-04',
        },
        {
          type: 'phase1',
          date: '2010-05-03',
        },
        {
          type: 'filed',
          date: '2010-05-01',
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[1][0].type).to.equal('filed');
      expect(phaseActivity[2].length).to.equal(3);
    });

    it('should discard micro phases', () => {
      const events = [
        {
          type: 'phase5',
          date: '2010-05-07',
        },
        {
          type: 'phase4',
          date: '2010-05-06',
        },
        {
          type: 'phase3',
          date: '2010-05-05',
        },
        {
          type: 'phase2',
          date: '2010-05-04',
        },
        {
          type: 'phase1',
          date: '2010-05-03',
        },
        {
          type: 'filed',
          date: '2010-05-01',
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[3].length).to.equal(1);
      expect(phaseActivity[3][0].type).to.equal('phase_entered');
    });

    it('should group events into correct bucket', () => {
      const events = [
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'phase5',
          date: '2016-11-02',
        },
        {
          type: 'phase4',
          date: '2016-11-02',
        },
        {
          type: 'phase3',
          date: '2016-11-02',
        },
        {
          type: 'phase2',
          date: '2016-11-02',
        },
        {
          type: 'other_documents_list',
          uploadDate: '2016-03-24',
        },
        {
          type: 'other_documents_list',
          uploadDate: '2015-08-28',
        },
        {
          type: 'other_documents_list',
          uploadDate: '2015-08-28',
        },
        {
          type: 'phase1',
          date: '2015-04-20',
        },
        {
          type: 'filed',
          date: '2015-04-20',
        },
        {
          type: 'other_documents_list',
          uploadDate: null,
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[3].length).to.equal(5);
      expect(phaseActivity[3][4].type).to.equal('phase_entered');
      expect(phaseActivity[2].length).to.equal(4);
      expect(phaseActivity[1].length).to.equal(1);
    });
  });

  describe('isPopulatedClaim', () => {
    it('should return false if any field is empty', () => {
      const claim = {
        attributes: {
          claimType: 'something',
          closeDate: null,
          contentions: [{ name: 'Condition 1' }],
        },
      };

      expect(isPopulatedClaim(claim.attributes)).to.be.false;
    });

    it('should return true if no field is empty', () => {
      const claim = {
        attributes: {
          claimDate: '2023-04-28',
          claimType: 'something',
          contentions: [{ name: 'Condition 1' }],
        },
      };

      expect(isPopulatedClaim(claim.attributes)).to.be.true;
    });

    it('should return false if contention list is empty', () => {
      const claim = {
        attributes: {
          claimDate: '2023-04-28',
          claimType: 'something',
          contentions: [],
        },
      };

      expect(isPopulatedClaim(claim.attributes)).to.be.false;
    });
  });

  describe('getDocTypeDescription', () => {
    it('should get description by type', () => {
      const result = getDocTypeDescription('L070');

      expect(result).to.equal('Photographs');
    });
  });

  describe('displayFileSize', () => {
    it('should show size in bytes', () => {
      const size = displayFileSize(2);

      expect(size).to.equal('2B');
    });

    it('should show size in kilobytes', () => {
      const size = displayFileSize(1026);

      expect(size).to.equal('1KB');
    });

    it('should show size in megabytes', () => {
      const size = displayFileSize(2097152);

      expect(size).to.equal('2MB');
    });
  });

  describe('getUserPhase', () => {
    it('should get phase 3 desc for 4-6', () => {
      const phase = getUserPhase(5);

      expect(phase).to.equal(3);
    });
  });

  describe('getUserPhaseDescription', () => {
    it('should get description for 3', () => {
      const desc = getUserPhaseDescription(3);

      expect(desc).to.equal('Evidence gathering, review, and decision');
    });
  });

  describe('getStatusDescription', () => {
    it('should display status description from map', () => {
      const desc = getStatusDescription('CLAIM_RECEIVED');

      expect(desc).to.equal('Step 1 of 5: Claim received');
    });
  });

  describe('getStatusMap', () => {
    it('should display status map', () => {
      const STATUSES = getStatusMap();

      expect(STATUSES.get('CLAIM_RECEIVED')).to.equal('CLAIM_RECEIVED');
      expect(STATUSES.get('UNDER_REVIEW')).to.equal('UNDER_REVIEW');
      expect(STATUSES.get('GATHERING_OF_EVIDENCE')).to.equal(
        'GATHERING_OF_EVIDENCE',
      );
      expect(STATUSES.get('REVIEW_OF_EVIDENCE')).to.equal('REVIEW_OF_EVIDENCE');
      expect(STATUSES.get('PREPARATION_FOR_DECISION')).to.equal(
        'PREPARATION_FOR_DECISION',
      );
      expect(STATUSES.get('PENDING_DECISION_APPROVAL')).to.equal(
        'PENDING_DECISION_APPROVAL',
      );
      expect(STATUSES.get('PREPARATION_FOR_NOTIFICATION')).to.equal(
        'PREPARATION_FOR_NOTIFICATION',
      );
      expect(STATUSES.get('COMPLETE')).to.equal('COMPLETE');
    });
  });

  describe('getClaimStatusDescription', () => {
    it('should display claim status description from map', () => {
      const desc = getClaimStatusDescription('CLAIM_RECEIVED');

      expect(desc).to.equal(
        'We received your claim. We haven’t assigned the claim to a reviewer yet.',
      );
    });
  });

  describe('getPhaseDescription', () => {
    it('should display description from map', () => {
      const desc = getPhaseDescription(2);

      expect(desc).to.equal('Initial review');
    });
  });

  describe('getItemDate', () => {
    it('should use the received date', () => {
      const date = getItemDate({
        receivedDate: '2010-01-01',
        documents: [{ uploadDate: '2011-01-01' }],
        date: '2012-01-01',
      });

      expect(date).to.equal('2010-01-01');
    });

    it('should use the last document upload date', () => {
      const date = getItemDate({
        receivedDate: null,
        documents: [{ uploadDate: '2011-01-01' }, { uploadDate: '2012-01-01' }],
        date: '2013-01-01',
      });

      expect(date).to.equal('2012-01-01');
    });

    it('should use the date', () => {
      const date = getItemDate({
        receivedDate: null,
        documents: [],
        date: '2013-01-01',
      });

      expect(date).to.equal('2013-01-01');
    });

    it('should use the upload date', () => {
      const date = getItemDate({
        uploadDate: '2014-01-01',
        type: 'other_documents_list',
        date: '2013-01-01',
      });

      expect(date).to.equal('2014-01-01');
    });
  });

  describe('isClaimComplete', () => {
    it('should check if claim is in complete phase', () => {
      const isComplete = isClaimComplete({
        attributes: {
          phase: 8,
        },
      });

      expect(isComplete).to.be.true;
    });

    it('should check if claim has decision letter', () => {
      const isComplete = isClaimComplete({
        attributes: {
          decisionLetterSent: true,
        },
      });

      expect(isComplete).to.be.true;
    });
  });

  describe('isDisabilityCompensationClaim', () => {
    context('when claimTypeCode is a disability compensation claim', () => {
      context('when claimTypeCode is null', () => {
        it('should return false', () => {
          expect(isDisabilityCompensationClaim(null)).to.be.false;
        });
      });
      // Submit Buddy Statement
      context(
        'when claimTypeCode is eBenefits 526EZ-Supplemental (020)',
        () => {
          const claimTypeCode = '020SUPP';
          it('should return true', () => {
            expect(isDisabilityCompensationClaim(claimTypeCode)).to.be.true;
          });
        },
      );
      // 5103 Notice
      context('when claimTypeCode is IDES Initial Live Comp <8 Issues', () => {
        const claimTypeCode = '110LCMP7IDES';
        it('should return true', () => {
          expect(isDisabilityCompensationClaim(claimTypeCode)).to.be.true;
        });
      });
    });

    context('when claimTypeCode is not a disability compensation claim', () => {
      context('when claimTypeCode is a claim for dependency', () => {
        const claimTypeCode = '400PREDSCHRG';
        it('should return true', () => {
          expect(isDisabilityCompensationClaim(claimTypeCode)).to.be.false;
        });
      });
    });
  });

  describe('getShowEightPhases', () => {
    context('when claimTypeCode is a disability compensation claim', () => {
      context('when claimTypeCode is null', () => {
        it('should return false', () => {
          expect(getShowEightPhases(null, true)).to.be.false;
        });
      });
      // Submit Buddy Statement
      context(
        'when claimTypeCode is eBenefits 526EZ-Supplemental (020)',
        () => {
          const claimTypeCode = '020SUPP';
          it('should return true', () => {
            expect(getShowEightPhases(claimTypeCode, true)).to.be.true;
          });
        },
      );
      // 5103 Notice
      context('when claimTypeCode is IDES Initial Live Comp <8 Issues', () => {
        const claimTypeCode = '110LCMP7IDES';
        it('should return true', () => {
          expect(getShowEightPhases(claimTypeCode, true)).to.be.true;
        });
      });
    });

    context('when claimTypeCode is not a disability compensation claim', () => {
      context('when claimTypeCode is a claim for dependency', () => {
        const claimTypeCode = '400PREDSCHRG';
        it('should return false', () => {
          expect(getShowEightPhases(claimTypeCode, true)).to.be.false;
        });
      });
    });
    context('when claimTypeCode is Pension', () => {
      const claimTypeCode = '190ORGDPNPMC';
      it('should return true', () => {
        expect(getShowEightPhases(claimTypeCode, true)).to.be.true;
      });
    });
    context('when claimTypeCode is not Pension', () => {
      const claimTypeCode = '130RD';
      it('should return false', () => {
        expect(getShowEightPhases(claimTypeCode, true)).to.be.false;
      });
    });
  });

  describe('isClaimOpen', () => {
    context('when status is COMPLETE', () => {
      const status = 'COMPLETE';
      context('when closeDate is null', () => {
        it('should return false', () => {
          const isOpen = isClaimOpen(status, null);
          expect(isOpen).to.be.false;
        });
      });

      context('when closeDate exists', () => {
        it('should return false', () => {
          const isOpen = isClaimOpen(status, '2024-01-01');
          expect(isOpen).to.be.false;
        });
      });
    });

    context('when status is not COMPLETE', () => {
      const status = 'CLAIM_RECEIVED';
      context('when closeDate is null', () => {
        it('should return true', () => {
          const isOpen = isClaimOpen(status, null);
          expect(isOpen).to.be.true;
        });
      });

      context('when closeDate exists', () => {
        it('should return false', () => {
          const isOpen = isClaimOpen(status, '2024-01-01');
          expect(isOpen).to.be.false;
        });
      });
    });
  });

  describe('getClaimType', () => {
    it('should return the claim type', () => {
      const claim = {
        attributes: {
          claimType: 'Awesome',
        },
      };
      expect(getClaimType(claim)).to.equal('Awesome');
    });

    it('should return new text for death claims', () => {
      const claim = {
        attributes: {
          claimType: 'Death',
        },
      };
      expect(getClaimType(claim)).to.equal(
        'expenses related to death or burial',
      );
    });

    it('should return the default claim type', () => {
      const claim = {
        attributes: {
          claimType: undefined,
        },
      };
      expect(getClaimType(claim)).to.equal('Disability Compensation');
    });
  });

  describe('makeAuthRequest', () => {
    let expectedUrl;

    before(() => {
      server.events.on('request:start', req => {
        // TODO: After Node 14 support is dropped, simplify to: expectedUrl = req.url.href;
        // The || req.url fallback is only needed for Node 14 compatibility
        expectedUrl = req.url?.href || req.url;
      });
    });

    afterEach(() => {
      server.resetHandlers();
      expectedUrl = undefined;
    });

    it('should make an apiRequest request', done => {
      server.use(
        createGetHandler(
          'https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status',
          () => {
            return jsonResponse({}, { status: 200 });
          },
        ),
      );

      const onSuccess = () => {
        if (expectedUrl) {
          expect(expectedUrl).to.include(
            '/v0/education_benefits_claims/stem_claim_status',
          );
        }
        done();
      };

      makeAuthRequest(
        '/v0/education_benefits_claims/stem_claim_status',
        null,
        sinon.spy(),
        onSuccess,
        done,
      );
    });

    it('should reject promise when there is an error', done => {
      server.use(
        createGetHandler(
          'https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status',
          () => jsonResponse({ error: 'Server Error' }, { status: 500 }),
        ),
      );

      const dispatch = sinon.spy();
      const onSuccess = sinon.spy();

      const onError = () => {
        expect(onSuccess.called).to.be.false;
        expect(dispatch.called).to.be.false;
        done();
      };

      makeAuthRequest(
        '/v0/education_benefits_claims/stem_claim_status',
        null,
        dispatch,
        onSuccess,
        onError,
      );
    });

    it('should dispatch auth error', done => {
      server.use(
        createGetHandler(
          'https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status',
          () => jsonResponse({ status: 401 }, { status: 401 }),
        ),
      );
      const onError = sinon.spy();
      const onSuccess = sinon.spy();
      const dispatch = action => {
        expect(action.type).to.equal('SET_UNAUTHORIZED');
        expect(onError.called).to.be.false;
        expect(onSuccess.called).to.be.false;
        done();
      };

      makeAuthRequest(
        '/v0/education_benefits_claims/stem_claim_status',
        null,
        dispatch,
        onSuccess,
        onError,
      );
    });
  });

  describe('getStatusContents', () => {
    it('returns an object with correct title & description', () => {
      const expectedTitle = 'The Board made a decision on your appeal';
      const expectedDescSnippet = 'Reasonableness of attorney fees';
      const contents = getStatusContents(mockData.data[6]);
      expect(contents.title).to.equal(expectedTitle);

      const descText = shallow(contents.description);
      const decision = descText.find('Decision');
      expect(decision.dive().text()).to.contain(expectedDescSnippet);
      descText.unmount();
    });

    it('returns sane object when given unknown type', () => {
      const contents = getStatusContents({
        attributes: { status: { type: 'fake_type' } },
      });
      expect(contents.title).to.equal('We don’t know your status');
      expect(contents.description.props.children).to.eql(
        'We’re sorry, VA.gov will soon be updated to show your status.',
      );
    });

    describe('appeal decision DDL link', () => {
      let appeal;
      beforeEach(() => {
        appeal = mockData.data.find(a => a.id === 'A106');
      });

      it('returns a link to DDL for a BVA-decided appeal', () => {
        const contents = getStatusContents(appeal);
        const descText = shallow(contents.description);
        const linkToDDL = descText
          .find('Toggler')
          .find('Enabled')
          .find('Link');

        expect(linkToDDL.length).to.equal(1);
        expect(linkToDDL.props().to).to.equal('/your-claim-letters');

        descText.unmount();
      });

      it('returns a link to DDL for a BVA-post-decided appeal', () => {
        const postDecisionAppeal = {
          ...appeal,
          attributes: {
            ...appeal.attributes,
            status: {
              ...appeal.attributes.status,
              type: 'post_bva_dta_decision',
            },
          },
        };

        const contents = getStatusContents(postDecisionAppeal);
        const descText = shallow(contents.description);
        const linkToDDL = descText
          .find('Toggler')
          .find('Enabled')
          .find('Link');

        expect(linkToDDL.length).to.equal(1);
        expect(linkToDDL.props().to).to.equal('/your-claim-letters');

        descText.unmount();
      });
    });
  });

  describe('getNextEvents', () => {
    it('returns an object with a header property', () => {
      const type = STATUS_TYPES.pendingCertificationSsoc;
      const details = {
        certificationTimeliness: [1, 2],
        ssocTimeliness: [1, 1],
      };
      const nextEvents = getNextEvents({
        attributes: { status: { type, details } },
      });
      expect(nextEvents.header).to.equal(
        'What happens next depends on whether you submit new evidence.',
      );
    });

    it('returns an object with an events array property', () => {
      const type = STATUS_TYPES.remandSsoc;
      // 'remandSsoc' status has 2 nextEvents in the array
      const details = {
        returnTimeliness: [1, 2],
        remandSsocTimeliness: [1, 1],
      };
      const nextEvents = getNextEvents({
        attributes: { status: { type, details } },
      });
      const { events } = nextEvents;
      expect(events.length).to.equal(2);
      const firstEvent = events[0];
      const secondEvent = events[1];
      // each of the 2 'remandSsoc' nextEvents has 2 properties
      expect(Object.keys(firstEvent).length).to.equal(2);
      expect(Object.keys(secondEvent).length).to.equal(2);
    });
  });

  describe('getAlertContent', () => {
    it('returns an object with title, desc, displayType, and type', () => {
      const alert = {
        type: 'ramp_eligible',
        details: {
          representative: 'Mr. Spock',
        },
      };

      const alertContent = getAlertContent(alert);
      expect(alertContent.title).to.exist;
      expect(alertContent.description).to.exist;
      expect(alertContent.displayType).to.exist;
      expect(alertContent.type).to.exist;
    });
  });

  describe('addStatusToIssues', () => {
    it('returns an array of same length as input array', () => {
      const { issues } = mockData.data[2].attributes;
      const formattedIssues = addStatusToIssues(issues);
      expect(formattedIssues.length).to.equal(issues.length);
    });

    it('returns an array of objects, each with status and description', () => {
      const { issues } = mockData.data[2].attributes;
      const formattedIssues = addStatusToIssues(issues);
      expect(formattedIssues.every(i => i.status && i.description)).to.be.true;
    });
  });

  describe('makeDecisionReviewContent', () => {
    it('returns the default content if no additional content is provided', () => {
      const decisionReviewContent = makeDecisionReviewContent();
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).to.equal(
        'A Veterans Law Judge will review all of the available evidence and write a decision. For each issue you’re appealing, they can decide to:Grant: The judge disagrees with the original decision and decides in your favor.Deny: The judge agrees with the original decision.Remand: The judge sends the issue back to the Veterans Benefits Administration to gather more evidence or to fix a mistake before deciding whether to grant or deny.Note: About 60% of all cases have at least 1 issue remanded.',
      );
      descText.unmount();
    });

    it('returns additional content when provided', () => {
      const decisionReviewContent = makeDecisionReviewContent({
        prop:
          'Once your representative has completed their review, your case will be ready to go to a Veterans Law Judge.',
      });
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).to.equal(
        'Once your representative has completed their review, your case will be ready to go to a Veterans Law Judge. The judge will review all of the available evidence and write a decision. For each issue you’re appealing, they can decide to:Grant: The judge disagrees with the original decision and decides in your favor.Deny: The judge agrees with the original decision.Remand: The judge sends the issue back to the Veterans Benefits Administration to gather more evidence or to fix a mistake before deciding whether to grant or deny.Note: About 60% of all cases have at least 1 issue remanded.',
      );
      descText.unmount();
    });

    it('uses the name of the aoj', () => {
      const decisionReviewContent = makeDecisionReviewContent({
        aoj: AOJS.nca,
      });
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).to.contain(
        'National Cemetery Administration',
      );
      descText.unmount();
    });

    it('adjusts language for ama appeals', () => {
      const decisionReviewContent = makeDecisionReviewContent({ isAma: true });
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).to.not.contain(
        '60% of all cases have at least 1 issue remanded.',
      );
      descText.unmount();
    });
  });

  describe('isolateAppeal', () => {
    const state = {
      disability: {
        status: {
          claimsV2: {
            appeals: mockData.data,
          },
        },
      },
    };

    it('should find the right appeal if the given id matches', () => {
      const expectedAppeal = mockData.data[1];
      const appeal = isolateAppeal(state, expectedAppeal.id);
      expect(appeal).to.equal(expectedAppeal);
    });

    it('should find the right appeal if the given v1 id matches a v2 appeal', () => {
      const expectedAppeal = mockData.data[1];
      // appealIds[1] is the fake v1 id
      const appeal = isolateAppeal(
        state,
        expectedAppeal.attributes.appealIds[1],
      );
      expect(appeal).to.equal(expectedAppeal);
    });

    it('should return undefined if no appeal matches the id given', () => {
      const appeal = isolateAppeal(state, 'non-existent id');
      expect(appeal).to.be.undefined;
    });
  });

  describe('roundToNearest', () => {
    it('returns a number rounded to the nearest interval', () => {
      expect(roundToNearest({ interval: 5000, value: 2000 })).to.equal(0);
      expect(roundToNearest({ interval: 5000, value: 23123 })).to.equal(25000);
      expect(roundToNearest({ interval: 1000, value: 11450 })).to.equal(11000);
    });
  });

  describe('getPageRangeText', () => {
    it('returns the correct item range based on the page', () => {
      expect(getPageRange(1, 5)).to.deep.equal({ start: 1, end: 5 });
      expect(getPageRange(1, 12)).to.deep.equal({ start: 1, end: 10 });
      expect(getPageRange(1, 25)).to.deep.equal({ start: 1, end: 10 });
      expect(getPageRange(2, 12)).to.deep.equal({ start: 11, end: 12 });
      expect(getPageRange(2, 22)).to.deep.equal({ start: 11, end: 20 });
      expect(getPageRange(2, 25)).to.deep.equal({ start: 11, end: 20 });
      expect(getPageRange(3, 25)).to.deep.equal({ start: 21, end: 25 });
    });
  });

  describe('claimAvaliable', () => {
    it('should return false when claim is empty', () => {
      const isClaimAvaliable = claimAvailable({});

      expect(isClaimAvaliable).to.be.false;
    });

    it('should return false when claim is null', () => {
      const isClaimAvaliable = claimAvailable(null);

      expect(isClaimAvaliable).to.be.false;
    });

    it('should return false when claim attributes are empty', () => {
      const claim = {
        id: 1,
        attributes: {},
      };
      const isClaimAvaliable = claimAvailable(claim);

      expect(isClaimAvaliable).to.be.false;
    });

    it('should return false when claim attributes are null', () => {
      const claim = {
        id: 1,
        attributes: null,
      };
      const isClaimAvaliable = claimAvailable(claim);

      expect(isClaimAvaliable).to.be.false;
    });

    it('should return true when claim attributes exist', () => {
      const claim = {
        id: 1,
        attributes: {
          claimType: 'Compensation',
          claimDate: '2024-04-05',
        },
      };
      const isClaimAvaliable = claimAvailable(claim);

      expect(isClaimAvaliable).to.be.true;
    });
  });

  describe('getClaimPhaseTypeHeaderText', () => {
    it('should display claim phase type header text from map', () => {
      const desc = getClaimPhaseTypeHeaderText('CLAIM_RECEIVED');

      expect(desc).to.equal('Step 1 of 8: Claim received');
    });
  });

  describe('getPhaseItemText', () => {
    context('when showEightPhases false - 5 steps', () => {
      it('should display phase item text from map when step 1', () => {
        const desc = getPhaseItemText(1);
        expect(desc).to.equal('Step 1: Claim received');
      });
      it('should display phase item text from map when step 2', () => {
        const desc = getPhaseItemText(2);

        expect(desc).to.equal('Step 2: Initial review');
      });
      it('should display phase item text from map when step 3', () => {
        const desc = getPhaseItemText(3);
        expect(desc).to.equal(
          'Step 3: Evidence gathering, review, and decision',
        );
      });
      it('should display phase item text from map when step 4', () => {
        const desc = getPhaseItemText(4);
        expect(desc).to.equal(
          'Step 3: Evidence gathering, review, and decision',
        );
      });
      it('should display phase item text from map when step 5', () => {
        const desc = getPhaseItemText(5);
        expect(desc).to.equal(
          'Step 3: Evidence gathering, review, and decision',
        );
      });
      it('should display phase item text from map when step 6', () => {
        const desc = getPhaseItemText(6);
        expect(desc).to.equal(
          'Step 3: Evidence gathering, review, and decision',
        );
      });
      it('should display phase item text from map when step 7', () => {
        const desc = getPhaseItemText(7);
        expect(desc).to.equal('Step 4: Preparation for notification');
      });
      it('should display phase item text from map when step 8', () => {
        const desc = getPhaseItemText(8);
        expect(desc).to.equal('Step 5: Closed');
      });
    });
    context('when showEightPhases true - 8 steps', () => {
      it('should display phase item text from map when step 1', () => {
        const desc = getPhaseItemText(1, true);
        expect(desc).to.equal('We received your claim in our system');
      });
      it('should display phase item text from map when step 2', () => {
        const desc = getPhaseItemText(2, true);
        expect(desc).to.equal('Step 2: Initial review');
      });
      it('should display phase item text from map when step 3', () => {
        const desc = getPhaseItemText(3, true);
        expect(desc).to.equal('Step 3: Evidence gathering');
      });
      it('should display phase item text from map when step 4', () => {
        const desc = getPhaseItemText(4, true);
        expect(desc).to.equal('Step 4: Evidence review');
      });
      it('should display phase item text from map when step 5', () => {
        const desc = getPhaseItemText(5, true);
        expect(desc).to.equal('Step 5: Rating');
      });
      it('should display phase item text from map when step 6', () => {
        const desc = getPhaseItemText(6, true);
        expect(desc).to.equal('Step 6: Preparing decision letter');
      });
      it('should display phase item text from map when step 7', () => {
        const desc = getPhaseItemText(7, true);
        expect(desc).to.equal('Step 7: Final review');
      });
      it('should display phase item text from map when step 8', () => {
        const desc = getPhaseItemText(8, true);
        expect(desc).to.equal('Your claim was decided');
      });
    });
  });

  describe('getClaimPhaseTypeDescription', () => {
    it('should display claim phase type description from map', () => {
      const desc = getClaimPhaseTypeDescription('CLAIM_RECEIVED');

      expect(desc).to.equal('We received your claim in our system.');
    });
  });

  describe('setTabDocumentTitle', () => {
    context('when there is no claim', () => {
      it('should set tab title for Status', () => {
        setTabDocumentTitle(null, 'Status');

        expect(document.title).to.equal(
          'Status of Your Claim | Veterans Affairs',
        );
      });
      it('should set tab title for Files', () => {
        setTabDocumentTitle(null, 'Files');

        expect(document.title).to.equal(
          'Files for Your Claim | Veterans Affairs',
        );
      });
      it('should set tab title for Overview', () => {
        setTabDocumentTitle(null, 'Overview');

        expect(document.title).to.equal(
          'Overview of Your Claim | Veterans Affairs',
        );
      });
    });
    context('when there is a claim', () => {
      const claim = {
        id: '1',
        attributes: {
          supportingDocuments: [],
          claimDate: '2023-01-01',
          closeDate: null,
          documentsNeeded: true,
          decisionLetterSent: false,
          status: 'INITIAL_REVIEW',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2015-01-01',
            latestPhaseType: 'INITIAL_REVIEW',
            previousPhases: {
              phase1CompleteDate: '2023-02-08',
              phase2CompleteDate: '2023-02-08',
            },
          },
        },
      };
      it('should set tab title for Status', () => {
        setTabDocumentTitle(claim, 'Status');

        expect(document.title).to.equal(
          'Status of January 1, 2023 Disability Compensation Claim | Veterans Affairs',
        );
      });
      it('should set tab title for Files', () => {
        setTabDocumentTitle(claim, 'Files');

        expect(document.title).to.equal(
          'Files for January 1, 2023 Disability Compensation Claim | Veterans Affairs',
        );
      });
      it('should set tab title for Overview', () => {
        setTabDocumentTitle(claim, 'Overview');

        expect(document.title).to.equal(
          'Overview of January 1, 2023 Disability Compensation Claim | Veterans Affairs',
        );
      });
    });
  });

  describe('setPageFocus', () => {
    context('when last page was not a tab and loading is false', () => {
      it('should run setUpPage', () => {
        const setUpPage = sinon.spy(page, 'setUpPage');
        setPageFocus('/test', false);

        expect(setUpPage.called).to.be.true;
      });
    });
    context('when last page was not a tab and loading is true', () => {
      it('should run scrollToTop', () => {
        const scrollToTop = sinon.spy(scrollUtils, 'scrollToTop');
        setPageFocus('/test', true);

        expect(scrollToTop.called).to.be.true;
      });
    });
    context('when last page was a tab', () => {
      it('should run scrollAndFocus', () => {
        const scrollAndFocus = sinon.spy(scrollUtils, 'scrollAndFocus');
        setPageFocus('/status', false);

        expect(scrollAndFocus.called).to.be.true;
      });
    });
  });

  describe('sentenceCase', () => {
    it('capitalizes the first letter in a string and does not modify the rest of the string', () => {
      expect(sentenceCase('a')).to.equal('A');
      expect(sentenceCase('A')).to.equal('A');
      expect(sentenceCase('1')).to.equal('1');
      expect(sentenceCase('hello world')).to.equal('Hello world');
      expect(sentenceCase('h3770 W0R7D')).to.equal('H3770 W0R7D');
    });
    it('returns an empty string for bad inputs', () => {
      expect(sentenceCase()).to.equal('');
      expect(sentenceCase('')).to.equal('');
      expect(sentenceCase(['array', 'of', 'strings'])).to.equal('');
      expect(sentenceCase({ key: 'value' })).to.equal('');
    });
  });

  describe('generateClaimTitle', () => {
    const claimDate = '2024-08-21';
    const compensationClaim = { attributes: { claimType: 'Compensation' } };
    const addOrRemoveDependentClaim = {
      attributes: { claimTypeCode: '130DPNDCYAUT', claimDate },
    };
    const pensionClaim = {
      attributes: { claimTypeCode: '150AIA' },
    };
    const survivorsPensionClaim = {
      attributes: { claimTypeCode: '190ORGDPNPMC' },
    };
    const DICClaim = {
      attributes: { claimTypeCode: '290DICEDPMC' },
    };
    const venteransPensionClaim = {
      attributes: { claimTypeCode: '180ORGPENPMC' },
    };
    context('when generating a card title', () => {
      it('should generate a default title', () => {
        expect(generateClaimTitle()).to.equal(
          'Claim for disability compensation',
        );
      });
      it('should generate a title based on the claim type', () => {
        expect(generateClaimTitle(compensationClaim)).to.equal(
          'Claim for compensation',
        );
      });
      it('should generate a different title for requests to add or remove a dependent', () => {
        expect(generateClaimTitle(addOrRemoveDependentClaim)).to.equal(
          'Request to add or remove a dependent',
        );
      });
      it('should generate a different title for pension claim', () => {
        expect(generateClaimTitle(pensionClaim)).to.equal('Claim for pension');
      });
      it('should generate a different title for Survivors Pension claim', () => {
        expect(generateClaimTitle(survivorsPensionClaim)).to.equal(
          'Claim for Survivors Pension',
        );
      });
      it('should generate a different title for DIC pension claim', () => {
        expect(generateClaimTitle(DICClaim)).to.equal(
          'Claim for Dependency and Indemnity Compensation',
        );
      });
      it('should generate a different title for Veterans Pension claim', () => {
        expect(generateClaimTitle(venteransPensionClaim)).to.equal(
          'Claim for Veterans Pension',
        );
      });
    });
    context('when generating a detail page heading', () => {
      it('should generate a default title', () => {
        expect(generateClaimTitle({}, 'detail')).to.equal(
          'Claim for disability compensation',
        );
      });
      it('should generate a title based on the claim type', () => {
        expect(generateClaimTitle(compensationClaim, 'detail')).to.equal(
          'Claim for compensation',
        );
      });
      it('should generate a different title for requests to add or remove a dependent', () => {
        expect(
          generateClaimTitle(addOrRemoveDependentClaim, 'detail'),
        ).to.equal('Request to add or remove a dependent');
      });
    });
    context('when generating a breadcrumb title', () => {
      it('should generate a default title if the claim is unavailable', () => {
        expect(generateClaimTitle({}, 'breadcrumb', 'Status')).to.equal(
          'Status of your claim',
        );
      });
      it('should generate a title based on the tab name and claim type', () => {
        expect(
          generateClaimTitle(compensationClaim, 'breadcrumb', 'Files'),
        ).to.equal('Files for your compensation claim');
        expect(
          generateClaimTitle(compensationClaim, 'breadcrumb', 'Status'),
        ).to.equal('Status of your compensation claim');
      });
      it('should generate a different title for requests to add or remove a dependent', () => {
        expect(
          generateClaimTitle(addOrRemoveDependentClaim, 'breadcrumb', 'Files'),
        ).to.equal('Files for your request to add or remove a dependent');
        expect(
          generateClaimTitle(addOrRemoveDependentClaim, 'breadcrumb', 'Status'),
        ).to.equal('Status of your request to add or remove a dependent');
      });
    });
    context('when generating a document title for the browser tab', () => {
      it('should generate a default title if the claim is unavailable', () => {
        expect(generateClaimTitle({}, 'document', 'Files')).to.equal(
          'Files for Your Claim',
        );
      });
      it('should generate a title based on the tab name and claim type', () => {
        expect(
          generateClaimTitle(
            { attributes: { claimDate } },
            'document',
            'Files',
          ),
        ).to.equal('Files for August 21, 2024 Disability Compensation Claim');
      });
      it('should generate a different title for requests to add or remove a dependent', () => {
        expect(
          generateClaimTitle(addOrRemoveDependentClaim, 'document', 'Files'),
        ).to.equal(
          'Files for August 21, 2024 Request to Add or Remove a Dependent',
        );
      });
    });
  });

  describe('generateClaimTitle with server-generated titles', () => {
    const claimDate = '2024-08-21';

    context('when server provides displayTitle (feature flag ON)', () => {
      context('for list/detail views', () => {
        it('should use displayTitle for list view (no placement)', () => {
          const claim = {
            attributes: {
              displayTitle: 'Claim for Veterans Pension',
              claimTypeBase: 'veterans pension claim',
              claimType: 'Pension',
            },
          };
          expect(generateClaimTitle(claim)).to.equal(
            'Claim for Veterans Pension',
          );
        });

        it('should use displayTitle for detail placement', () => {
          const claim = {
            attributes: {
              displayTitle: 'Request to add or remove a dependent',
              claimTypeBase: 'dependency claim',
              claimType: 'Dependency',
            },
          };
          expect(generateClaimTitle(claim, 'detail')).to.equal(
            'Request to add or remove a dependent',
          );
        });

        it('should bypass all client-side override logic when displayTitle present', () => {
          const claim = {
            attributes: {
              displayTitle: 'Claim for Survivors Pension',
              claimTypeBase: 'survivors pension claim',
              claimType: 'Pension',
              claimTypeCode: '190ORGDPNPMC', // Would trigger client-side override
            },
          };
          expect(generateClaimTitle(claim)).to.equal(
            'Claim for Survivors Pension',
          );
        });
      });

      context('for breadcrumb/document views', () => {
        it('should NOT use displayTitle for breadcrumb (uses composition)', () => {
          const claim = {
            attributes: {
              displayTitle: 'Claim for Veterans Pension',
              claimTypeBase: 'veterans pension claim',
              claimType: 'Pension',
              claimTypeCode: '180ORGPENPMC',
              claimDate,
            },
          };
          const result = generateClaimTitle(claim, 'breadcrumb', 'Status');
          expect(result).to.equal('Status of your veterans pension claim');
          expect(result).to.not.equal(
            'Status of your Claim for Veterans Pension',
          );
        });

        it('should NOT use displayTitle for document (uses composition)', () => {
          const claim = {
            attributes: {
              displayTitle: 'Claim for Veterans Pension',
              claimTypeBase: 'veterans pension claim',
              claimType: 'Pension',
              claimDate,
            },
          };
          const result = generateClaimTitle(claim, 'document', 'Status');
          expect(result).to.include('Veterans Pension Claim');
          expect(result).to.include('August 21, 2024');
        });
      });
    });

    context('when server provides BOTH fields (feature flag ON)', () => {
      it('should use claimTypeBase in breadcrumb composition', () => {
        const claim = {
          attributes: {
            displayTitle: 'Claim for Veterans Pension',
            claimTypeBase: 'veterans pension claim',
            claimType: 'Pension',
            claimTypeCode: '180ORGPENPMC',
            claimDate,
          },
        };
        const result = generateClaimTitle(claim, 'breadcrumb', 'Files');
        expect(result).to.equal('Files for your veterans pension claim');
      });

      it('should use claimTypeBase in document composition', () => {
        const claim = {
          attributes: {
            displayTitle: 'Claim for Survivors Pension',
            claimTypeBase: 'survivors pension claim',
            claimType: 'Pension',
            claimDate,
          },
        };
        const result = generateClaimTitle(claim, 'document', 'Overview');
        expect(result).to.equal(
          'Overview of August 21, 2024 Survivors Pension Claim',
        );
      });

      it('should preserve backend claimTypeBase casing for composition', () => {
        const claim = {
          attributes: {
            displayTitle: 'Claim for Compensation',
            claimTypeBase: 'compensation claim',
            claimDate,
          },
        };
        const result = generateClaimTitle(claim, 'breadcrumb', 'Status');
        expect(result).to.equal('Status of your compensation claim');
      });

      it('should preserve pension claim specificity in breadcrumbs', () => {
        const claim = {
          attributes: {
            displayTitle: 'Claim for Veterans Pension',
            claimTypeBase: 'veterans pension claim',
            claimType: 'Pension',
            claimTypeCode: '180ORGPENPMC',
            claimDate,
          },
        };
        const result = generateClaimTitle(claim, 'breadcrumb', 'Status');
        // Should maintain "veterans pension" NOT collapse to generic "pension"
        expect(result).to.include('veterans pension');
        expect(result).to.not.equal('Status of your pension claim');
      });
    });

    context('when server does NOT provide fields (feature flag OFF)', () => {
      it('should fall back to client-side logic for list view', () => {
        const claim = {
          attributes: {
            claimType: 'Compensation',
          },
        };
        expect(generateClaimTitle(claim)).to.equal('Claim for compensation');
      });

      it('should fall back to getClaimType for breadcrumb composition', () => {
        const claim = {
          attributes: {
            claimType: 'Compensation',
            claimDate,
          },
        };
        const result = generateClaimTitle(claim, 'breadcrumb', 'Files');
        expect(result).to.equal('Files for your compensation claim');
      });

      it('should apply client-side claimTypeCode overrides when no server fields', () => {
        const claim = {
          attributes: {
            claimType: 'Pension',
            claimTypeCode: '190ORGDPNPMC', // Survivors Pension
          },
        };
        expect(generateClaimTitle(claim)).to.equal(
          'Claim for Survivors Pension',
        );
      });
    });

    context('edge cases', () => {
      it('should handle null claimType with BOTH server fields present', () => {
        const claim = {
          attributes: {
            displayTitle: 'Claim for Debt Validation',
            claimTypeBase: 'debt validation claim',
            claimType: null,
            claimTypeCode: '290DV',
            claimDate,
          },
        };
        // Should use server-generated titles, not fall back to "Disability Compensation"
        const result = generateClaimTitle(claim, 'breadcrumb', 'Status');
        expect(result).to.equal('Status of your debt validation claim');
        expect(result).to.not.include('disability compensation');
      });

      it('should handle Death claims with server-generated fields', () => {
        const claim = {
          attributes: {
            displayTitle: 'Claim for expenses related to death or burial',
            claimTypeBase: 'death claim',
            claimType: 'Death',
          },
        };
        expect(generateClaimTitle(claim)).to.equal(
          'Claim for expenses related to death or burial',
        );
      });

      it('should handle dependency claims with server-generated fields', () => {
        const claim = {
          attributes: {
            displayTitle: 'Request to add or remove a dependent',
            claimTypeBase: 'request to add or remove a dependent',
            claimType: 'Dependency',
            claimTypeCode: '130DPNDCY',
            claimDate,
          },
        };
        expect(generateClaimTitle(claim)).to.equal(
          'Request to add or remove a dependent',
        );
        // Check breadcrumb uses claimTypeBase
        const breadcrumb = generateClaimTitle(claim, 'breadcrumb', 'Files');
        expect(breadcrumb).to.equal(
          'Files for your request to add or remove a dependent',
        );
      });

      it('should fall back to legacy logic when only one server field is present', () => {
        const claim = {
          attributes: {
            claimTypeBase: 'compensation claim', // Only claimTypeBase, no displayTitle
            claimType: 'Compensation',
            claimDate,
          },
        };
        // Should use client-side logic since both fields are not present (atomic requirement)
        expect(generateClaimTitle(claim)).to.equal('Claim for compensation');
        const breadcrumb = generateClaimTitle(claim, 'breadcrumb', 'Status');
        expect(breadcrumb).to.equal('Status of your compensation claim');
      });
    });
  });

  describe('getUploadErrorMessage', () => {
    context('when error is due to a duplicate upload', () => {
      [
        {
          description: 'showDocumentUploadStatus is false (default)',
          showDocumentUploadStatus: false,
          expectedAnchor: ANCHOR_LINKS.documentsFiled,
        },
        {
          description: 'showDocumentUploadStatus is true',
          showDocumentUploadStatus: true,
          expectedAnchor: ANCHOR_LINKS.filesReceived,
        },
      ].forEach(({ description, showDocumentUploadStatus, expectedAnchor }) => {
        it(`should return a specific duplicate error message with file name when ${description}`, () => {
          const claimId = '14568432';
          const error = {
            fileName: 'my-document.pdf',
            errors: [
              {
                detail: 'DOC_UPLOAD_DUPLICATE',
              },
            ],
          };

          const result = getUploadErrorMessage(
            error,
            claimId,
            showDocumentUploadStatus,
          );
          expect(result.title).to.equal(
            "You've already uploaded my-document.pdf",
          );
          expect(result.type).to.equal('error');
          const { getByText, container } = render(result.body);
          getByText(/It can take up to 2 days for the file to show up in/i);
          expect($('va-link', container)).to.exist;
          const link = $('va-link', container);
          expect(link.getAttribute('href')).to.equal(
            `/track-claims/your-claims/${claimId}/files#${expectedAnchor}`,
          );
        });
      });

      it('should use a generic name if fileName is missing', () => {
        const error = {
          errors: [
            {
              detail: 'DOC_UPLOAD_DUPLICATE',
            },
          ],
        };

        const result = getUploadErrorMessage(error);
        expect(result.title).to.equal("You've already uploaded files");
      });
    });
    context('when error is due to an invalid claimant', () => {
      it('should return a claimant invalidate error message', () => {
        const error = {
          fileName: 'my-document.pdf',
          errors: [
            {
              detail: 'DOC_UPLOAD_INVALID_CLAIMANT',
            },
          ],
        };

        const result = getUploadErrorMessage(error);
        expect(result.title).to.equal(
          'You can’t upload files for this claim here',
        );
        expect(result.type).to.equal('error');
        const { getByText, container } = render(result.body);
        getByText(
          /Only the Veteran with the claim can upload files on this page. We’re sorry for the inconvenience./i,
        );
        expect($('va-link', container)).to.exist;
        const link = $('va-link', container);
        expect(link.getAttribute('href')).to.equal(
          'https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit',
        );
      });
    });
    context('when error is a non-duplicate upload failure', () => {
      it('should return a generic upload error with file name and title', () => {
        const error = {
          fileName: 'my-document.pdf',
          errors: [
            {
              title: 'Unprocessable Entity',
              detail: 'Some other error',
            },
          ],
        };

        const result = getUploadErrorMessage(error);
        expect(result.title).to.equal('Error uploading my-document.pdf');
        expect(result.body).to.equal('Unprocessable Entity');
        expect(result.type).to.equal('error');
      });

      it('should handle completely empty error objects gracefully', () => {
        const result = getUploadErrorMessage({});
        expect(result.title).to.equal('Error uploading files');
        expect(result.body).to.equal(
          'There was an error uploading your files. Please try again',
        );
        expect(result.type).to.equal('error');
      });
    });
  });

  describe('getTimezoneDiscrepancyMessage', () => {
    it('should return empty string for UTC timezone', () => {
      const message = getTimezoneDiscrepancyMessage(0);
      expect(message).to.equal('');
    });

    // Tests WITHOUT uploadDate parameter (static messages)
    it('should return "after" message with "next day\'s date" for UTC-4 (EDT) timezone without uploadDate', () => {
      const message = getTimezoneDiscrepancyMessage(240);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('8:00 p.m.');
      expect(message).to.include("next day's date");
    });

    it('should return "before" message with "previous day\'s date" for UTC+9 (JST) timezone without uploadDate', () => {
      const message = getTimezoneDiscrepancyMessage(-540);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('9:00 a.m.');
      expect(message).to.include("previous day's date");
    });

    // Tests WITH uploadDate parameter (upload success notification)
    it('should return "after" message for UTC-4 (EDT) timezone with specific date', () => {
      // Upload at 9:00 PM EDT on August 15 = 1:00 AM UTC on August 16
      const uploadDate = new Date('2025-08-15T21:00:00-04:00');
      const message = getTimezoneDiscrepancyMessage(240, uploadDate);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('8:00 p.m.');
      expect(message).to.include('August 16, 2025');
    });

    it('should return "after" message for UTC-5 (EST/CDT) timezone with specific date', () => {
      // Upload at 8:00 PM EST on January 15 = 1:00 AM UTC on January 16
      const uploadDate = new Date('2025-01-15T20:00:00-05:00');
      const message = getTimezoneDiscrepancyMessage(300, uploadDate);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('7:00 p.m.');
      expect(message).to.include('January 16, 2025');
    });

    it('should return "after" message for UTC-8 (PST/AKDT) timezone with specific date', () => {
      // Upload at 5:00 PM PST on December 20 = 1:00 AM UTC on December 21
      const uploadDate = new Date('2025-12-20T17:00:00-08:00');
      const message = getTimezoneDiscrepancyMessage(480, uploadDate);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('4:00 p.m.');
      expect(message).to.include('December 21, 2025');
    });

    it('should return "after" message for UTC-10 (HST) timezone with specific date', () => {
      // Upload at 3:00 PM HST on March 10 = 1:00 AM UTC on March 11
      const uploadDate = new Date('2025-03-10T15:00:00-10:00');
      const message = getTimezoneDiscrepancyMessage(600, uploadDate);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('2:00 p.m.');
      expect(message).to.include('March 11, 2025');
    });

    it('should return "after" message for UTC-6 (CST/MDT) timezone with specific date', () => {
      // Upload at 7:00 PM CST on February 28 = 1:00 AM UTC on March 1
      const uploadDate = new Date('2025-02-28T19:00:00-06:00');
      const message = getTimezoneDiscrepancyMessage(360, uploadDate);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('6:00 p.m.');
      expect(message).to.include('March 1, 2025');
    });

    it('should return "after" message for UTC-7 (MST/PDT) timezone with specific date', () => {
      // Upload at 6:00 PM PDT on October 15 = 1:00 AM UTC on October 16
      const uploadDate = new Date('2025-10-15T18:00:00-07:00');
      const message = getTimezoneDiscrepancyMessage(420, uploadDate);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('5:00 p.m.');
      expect(message).to.include('October 16, 2025');
    });

    it('should return "after" message for UTC-9 (AKST) timezone with specific date', () => {
      // Upload at 4:00 PM AKST on November 5 = 1:00 AM UTC on November 6
      const uploadDate = new Date('2025-11-05T16:00:00-09:00');
      const message = getTimezoneDiscrepancyMessage(540, uploadDate);
      expect(message).to.include('Files uploaded after');
      expect(message).to.include('3:00 p.m.');
      expect(message).to.include('November 6, 2025');
    });

    it('should return "before" message for UTC+1 (BST) timezone with specific date', () => {
      // Upload at 12:30 AM BST on June 10 = 11:30 PM UTC on June 9
      const uploadDate = new Date('2025-06-10T00:30:00+01:00');
      const message = getTimezoneDiscrepancyMessage(-60, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('1:00 a.m.');
      expect(message).to.include('June 9, 2025');
    });

    it('should return "before" message for UTC+9 (JST) timezone with specific date', () => {
      // Upload at 8:00 AM JST on April 20 = 11:00 PM UTC on April 19
      const uploadDate = new Date('2025-04-20T08:00:00+09:00');
      const message = getTimezoneDiscrepancyMessage(-540, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('9:00 a.m.');
      expect(message).to.include('April 19, 2025');
    });

    it('should return "before" message for UTC+2 (CEST) timezone with specific date', () => {
      // Upload at 1:30 AM CEST on July 5 = 11:30 PM UTC on July 4
      const uploadDate = new Date('2025-07-05T01:30:00+02:00');
      const message = getTimezoneDiscrepancyMessage(-120, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('2:00 a.m.');
      expect(message).to.include('July 4, 2025');
    });

    it('should return "before" message for UTC+10 (AEST) timezone with specific date', () => {
      // Upload at 9:00 AM AEST on September 15 = 11:00 PM UTC on September 14
      const uploadDate = new Date('2025-09-15T09:00:00+10:00');
      const message = getTimezoneDiscrepancyMessage(-600, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('10:00 a.m.');
      expect(message).to.include('September 14, 2025');
    });

    it('should return "before" message for UTC+11 (AEDT) timezone with specific date', () => {
      // Upload at 10:00 AM AEDT on December 25 = 11:00 PM UTC on December 24
      const uploadDate = new Date('2025-12-25T10:00:00+11:00');
      const message = getTimezoneDiscrepancyMessage(-660, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('11:00 a.m.');
      expect(message).to.include('December 24, 2025');
    });

    it('should return "before" message for UTC+12 (NZST) timezone with specific date', () => {
      // Upload at 11:00 AM NZST on May 1 = 11:00 PM UTC on April 30
      const uploadDate = new Date('2025-05-01T11:00:00+12:00');
      const message = getTimezoneDiscrepancyMessage(-720, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('12:00 p.m.');
      expect(message).to.include('April 30, 2025');
    });

    it('should return "before" message for UTC+13 (NZDT) timezone with specific date', () => {
      // Upload at 12:00 PM NZDT on January 1 = 11:00 PM UTC on December 31, 2024
      const uploadDate = new Date('2025-01-01T12:00:00+13:00');
      const message = getTimezoneDiscrepancyMessage(-780, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('1:00 p.m.');
      expect(message).to.include('December 31, 2024');
    });

    it('should return "before" message for UTC+5:30 (IST) timezone with fractional hours and specific date', () => {
      // Upload at 5:00 AM IST on August 10 = 11:30 PM UTC on August 9
      const uploadDate = new Date('2025-08-10T05:00:00+05:30');
      const message = getTimezoneDiscrepancyMessage(-330, uploadDate);
      expect(message).to.include('Files uploaded before');
      expect(message).to.include('5:30 a.m.');
      expect(message).to.include('August 9, 2025');
    });

    it('should include timezone abbreviation in message for EDT', () => {
      const uploadDate = new Date('2025-08-15T21:00:00-04:00');
      const message = getTimezoneDiscrepancyMessage(240, uploadDate);
      // Timezone abbreviation should appear after the time
      expect(message).to.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+[A-Z]{2,4}\s/);
    });

    it('should include timezone abbreviation in message for PST', () => {
      const uploadDate = new Date('2025-12-20T17:00:00-08:00');
      const message = getTimezoneDiscrepancyMessage(480, uploadDate);
      expect(message).to.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+[A-Z]{2,4}\s/);
    });

    it('should handle null input gracefully', () => {
      expect(() => getTimezoneDiscrepancyMessage(null)).to.not.throw();
      const message = getTimezoneDiscrepancyMessage(null);
      expect(message).to.equal('');
    });

    it('should handle undefined input gracefully', () => {
      expect(() => getTimezoneDiscrepancyMessage(undefined)).to.not.throw();
      const message = getTimezoneDiscrepancyMessage(undefined);
      expect(message).to.equal('');
    });

    it('should handle NaN input gracefully', () => {
      expect(() => getTimezoneDiscrepancyMessage(NaN)).to.not.throw();
      const message = getTimezoneDiscrepancyMessage(NaN);
      expect(message).to.equal('');
    });

    it('should match exact VA.gov message format for "after" messages with specific date', () => {
      // Upload at 9:00 PM EDT on August 15 = 1:00 AM UTC on August 16
      const uploadDate = new Date('2025-08-15T21:00:00-04:00');
      const message = getTimezoneDiscrepancyMessage(240, uploadDate);
      // Complete format validation for negative offset (UTC-X)
      // Format: "Files uploaded after H:MM a.m./p.m. TZ will show as Month D, YYYY."
      expect(message).to.match(
        /^Files uploaded after \d{1,2}:\d{2} [ap]\.m\. [A-Z]{2,4} will show as [A-Z][a-z]+ \d{1,2}, \d{4}\.$/,
      );
    });

    it('should match exact VA.gov message format for "before" messages with specific date', () => {
      // Upload at 8:00 AM JST on April 20 = 11:00 PM UTC on April 19
      const uploadDate = new Date('2025-04-20T08:00:00+09:00');
      const message = getTimezoneDiscrepancyMessage(-540, uploadDate);
      // Complete format validation for positive offset (UTC+X)
      // Format: "Files uploaded before H:MM a.m./p.m. TZ will show as Month D, YYYY."
      expect(message).to.match(
        /^Files uploaded before \d{1,2}:\d{2} [ap]\.m\. [A-Z]{2,4} will show as [A-Z][a-z]+ \d{1,2}, \d{4}\.$/,
      );
    });

    it('should format date with correct month name format', () => {
      // Upload at 9:00 PM EDT on August 15 = 1:00 AM UTC on August 16
      const uploadDate = new Date('2025-08-15T21:00:00-04:00');
      const message = getTimezoneDiscrepancyMessage(240, uploadDate);
      // Should use full month name, not abbreviation
      expect(message).to.include('August 16, 2025');
      expect(message).to.not.include('Aug 16');
      expect(message).to.not.include('08/16');
    });

    it('should use periods in a.m./p.m. format', () => {
      const morningMessage = getTimezoneDiscrepancyMessage(-60); // 1:00 a.m.
      const eveningMessage = getTimezoneDiscrepancyMessage(240); // 8:00 p.m.

      expect(morningMessage).to.match(/\d{1,2}:\d{2} a\.m\./);
      expect(eveningMessage).to.match(/\d{1,2}:\d{2} p\.m\./);

      // Should NOT have formats without periods
      expect(morningMessage).to.not.include(' am ');
      expect(eveningMessage).to.not.include(' pm ');
    });

    it('should match exact format for "after" messages without uploadDate (static)', () => {
      const message = getTimezoneDiscrepancyMessage(240); // UTC-4
      // Format: "Files uploaded after H:MM a.m./p.m. TZ will show with the next day's date."
      expect(message).to.match(
        /^Files uploaded after \d{1,2}:\d{2} [ap]\.m\. [A-Z]{2,4} will show with the next day's date\.$/,
      );
    });

    it('should match exact format for "before" messages without uploadDate (static)', () => {
      const message = getTimezoneDiscrepancyMessage(-540); // UTC+9
      // Format: "Files uploaded before H:MM a.m./p.m. TZ will show with the previous day's date."
      expect(message).to.match(
        /^Files uploaded before \d{1,2}:\d{2} [ap]\.m\. [A-Z]{2,4} will show with the previous day's date\.$/,
      );
    });
  });

  describe('showTimezoneDiscrepancyMessage', () => {
    it('should handle null input gracefully', () => {
      expect(() => showTimezoneDiscrepancyMessage(null)).to.not.throw();
    });

    it('should handle undefined input gracefully', () => {
      expect(() => showTimezoneDiscrepancyMessage(undefined)).to.not.throw();
    });

    it('should handle invalid date input gracefully', () => {
      expect(() =>
        showTimezoneDiscrepancyMessage(new Date('invalid')),
      ).to.not.throw();
    });
  });

  describe('formatUploadDateTime', () => {
    it('should format date with time and timezone', () => {
      // Use UTC date to ensure consistent behavior in CI
      const date = new Date('2025-08-15T14:30:00Z');
      const formatted = formatUploadDateTime(date);

      expect(formatted).to.include('August 15, 2025');
      expect(formatted).to.include('at');
      expect(formatted).to.match(/\d{1,2}:\d{2}\s+(a|p)\.m\./);
      expect(formatted).to.match(/[A-Z]{2,4}$/); // Timezone abbreviation
    });

    it('should handle different times of day correctly', () => {
      const morningDate = new Date('2025-08-15T09:30:00Z'); // 9:30 AM UTC
      const eveningDate = new Date('2025-08-15T21:45:00Z'); // 9:45 PM UTC

      const morningFormatted = formatUploadDateTime(morningDate);
      const eveningFormatted = formatUploadDateTime(eveningDate);

      expect(morningFormatted).to.match(/a\.m\./);
      expect(eveningFormatted).to.match(/p\.m\./);
    });

    it('should throw error for invalid input', () => {
      expect(() => formatUploadDateTime('invalid-date')).to.throw(
        /formatUploadDateTime: invalid date provided/,
      );
    });

    it('should handle noon correctly', () => {
      // Use local time constructor to create noon in the system timezone
      const noonDate = new Date(2025, 7, 15, 12, 0, 0); // Noon local time
      const formatted = formatUploadDateTime(noonDate);
      expect(formatted).to.include('12:00 p.m.');
    });

    it('should handle midnight correctly', () => {
      // Use local time constructor to create midnight in the system timezone
      const midnightDate = new Date(2025, 7, 15, 0, 0, 0); // Midnight local time
      const formatted = formatUploadDateTime(midnightDate);
      expect(formatted).to.include('12:00 a.m.');
    });

    it('should handle single-digit hours correctly', () => {
      // Use local time constructor to create 9 AM in the system timezone
      const singleDigitHour = new Date(2025, 7, 15, 9, 0, 0); // 9 AM local time
      const formatted = formatUploadDateTime(singleDigitHour);
      // Should be "9:00" not "09:00"
      expect(formatted).to.match(/\s9:00\s/);
    });

    it('should accept ISO string input', () => {
      const isoString = '2025-08-15T14:30:00Z';
      const formatted = formatUploadDateTime(isoString);
      expect(formatted).to.include('August 15, 2025');
      expect(formatted).to.include('at');
    });

    it('should throw error for null input', () => {
      expect(() => formatUploadDateTime(null)).to.throw(
        /formatUploadDateTime: date parameter is required/,
      );
    });

    it('should throw error for undefined input', () => {
      expect(() => formatUploadDateTime(undefined)).to.throw(
        /formatUploadDateTime: date parameter is required/,
      );
    });
  });
});
