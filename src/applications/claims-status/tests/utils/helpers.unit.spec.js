import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  groupTimelineActivity,
  isPopulatedClaim,
  hasBeenReviewed,
  getDocTypeDescription,
  displayFileSize,
  getTrackedItemId,
  getTrackedItems,
  getFilesNeeded,
  getFilesOptional,
  getUserPhase,
  getUserPhaseDescription,
  getPhaseDescription,
  getStatusDescription,
  truncateDescription,
  getItemDate,
  isClaimComplete,
  itemsNeedingAttentionFromVet,
  makeAuthRequest,
  getClaimType,
  mockData,
  roundToNearest,
  groupClaimsByDocsNeeded,
} from '../../utils/helpers';

import {
  getAlertContent,
  getStatusContents,
  getNextEvents,
  makeDurationText,
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

  describe('truncateDescription', () => {
    context(' when default - maxlength is 120', () => {
      it('should truncate text longer than 120 characters', () => {
        const userText =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';
        const userTextEllipsed =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq…';

        const text = truncateDescription(userText);
        expect(text).to.equal(userTextEllipsed);
      });
    });
    context('when maxlength is 200', () => {
      it('should truncate text longer than 200 characters', () => {
        const userText =
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu quis nostrud exercitation ullamco laboris';
        const userTextEllipsed =
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu…';

        const text = truncateDescription(userText, 200);
        expect(text).to.equal(userTextEllipsed);
      });
    });
  });

  describe('hasBeenReviewed', () => {
    it('should check that item is reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'ACCEPTED',
      });

      expect(result).to.be.true;
    });

    it('should check that item has not been reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'SUBMITTED_AWAITING_REVIEW',
      });

      expect(result).to.be.false;
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

  // START lighthouse_migration
  describe('getTrackedItemId', () => {
    it('should return the value of the id key for Lighthouse claims', () => {
      const trackedItem = {
        id: 1,
        documents: [],
      };

      const id = getTrackedItemId(trackedItem);
      expect(id).to.equal(1);
    });

    it('should return the value of the trackedItemId key for EVSS claims', () => {
      const trackedItem = {
        trackedItemId: 1,
        documents: [],
      };

      const id = getTrackedItemId(trackedItem);
      expect(id).to.equal(1);
    });

    it('should return null if both the id and trackedItemId keys are not present', () => {
      const trackedItem = {
        documents: [],
      };

      const id = getTrackedItemId(trackedItem);
      expect(id).to.equal(undefined);
    });

    it('should return null if either the id or trackedItemId keys are null', () => {
      const trackedItem = {
        trackedItemId: null,
        documents: [],
      };

      const id = getTrackedItemId(trackedItem);
      expect(id).to.equal(undefined);
    });
  });
  // END lighthouse_migration

  describe('getTrackedItems', () => {
    context('when useLighthouse is true', () => {
      const useLighthouse = true;
      it('when trackedItems is empty, should return empty array', () => {
        const claim = {
          attributes: {
            open: false,
            trackedItems: [],
          },
        };
        const trackedItems = getTrackedItems(claim, useLighthouse);
        expect(trackedItems.length).to.equal(0);
      });

      it('when trackedItems exists, should return data', () => {
        const claim = {
          attributes: {
            open: false,
            trackedItems: [
              {
                status: 'NEEDED_FROM_YOU',
              },
            ],
          },
        };
        const trackedItems = getTrackedItems(claim, useLighthouse);
        expect(trackedItems.length).to.equal(1);
      });
    });

    context('when useLighthouse is false', () => {
      const useLighthouse = false;
      it('when eventsTimeline is empty, should return empty array', () => {
        const claim = {
          attributes: {
            open: false,
            eventsTimeline: [],
          },
        };
        const trackedItems = getTrackedItems(claim, useLighthouse);
        expect(trackedItems.length).to.equal(0);
      });

      it('when eventsTimeline exists, should return data', () => {
        const claim = {
          attributes: {
            open: false,
            eventsTimeline: [
              {
                type: 'still_need_from_you_list',
                status: 'NEEDED',
              },
            ],
          },
        };
        const trackedItems = getTrackedItems(claim, useLighthouse);
        expect(trackedItems.length).to.equal(1);
      });
    });
  });

  describe('getFilesNeeded', () => {
    context('when useLighthouse is true', () => {
      const useLighthouse = true;
      it('when trackedItems is empty, should return empty array', () => {
        const trackedItems = [];
        const filesNeeded = getFilesNeeded(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when trackedItems exists, should return data', () => {
        const trackedItems = [{ status: 'NEEDED_FROM_YOU' }];
        const filesNeeded = getFilesNeeded(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
    });

    context('when useLighthouse is false', () => {
      const useLighthouse = false;
      it('when eventsTimeline is empty, should return empty array', () => {
        const eventsTimeline = [];
        const filesNeeded = getFilesNeeded(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when eventsTimeline exists, should return data', () => {
        const eventsTimeline = [
          { type: 'still_need_from_you_list', status: 'NEEDED' },
        ];
        const filesNeeded = getFilesNeeded(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
    });
  });

  describe('getFilesOptional', () => {
    context('when useLighthouse is true', () => {
      const useLighthouse = true;
      it('when trackedItems is empty, should return empty array', () => {
        const trackedItems = [];
        const filesNeeded = getFilesOptional(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when trackedItems exists, should return data', () => {
        const trackedItems = [{ status: 'NEEDED_FROM_OTHERS' }];
        const filesNeeded = getFilesOptional(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
    });

    context('when useLighthouse is false', () => {
      const useLighthouse = false;
      it('when eventsTimeline is empty, should return empty array', () => {
        const eventsTimeline = [];
        const filesNeeded = getFilesOptional(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when eventsTimeline exists, should return data', () => {
        const eventsTimeline = [
          { type: 'still_need_from_others_list', status: 'NEEDED' },
        ];
        const filesNeeded = getFilesOptional(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
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

  describe('itemsNeedingAttentionFromVet', () => {
    it('should return number of needed items from vet', () => {
      const itemsNeeded = itemsNeedingAttentionFromVet([
        {
          id: 1,
          status: 'NEEDED_FROM_YOU',
        },
        {
          id: 2,
          status: 'SUBMITTED_AWAITING_REVIEW',
        },
        {
          id: 3,
          status: 'NEEDED_FROM_OTHERS',
        },
      ]);

      expect(itemsNeeded).to.equal(1);
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
    const server = setupServer();

    before(() => {
      server.listen();
      server.events.on('request:start', req => {
        expectedUrl = req.url.href;
      });
    });

    afterEach(() => {
      server.resetHandlers();
      expectedUrl = undefined;
    });

    after(() => server.close());

    it('should make an apiRequest request', done => {
      server.use(
        rest.get(
          'https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({}));
          },
        ),
      );

      const onSuccess = () => done();
      makeAuthRequest(
        '/v0/education_benefits_claims/stem_claim_status',
        null,
        sinon.spy(),
        onSuccess,
      );

      expect(expectedUrl).to.contain(
        '/v0/education_benefits_claims/stem_claim_status',
      );
    });

    it('should reject promise when there is an error', done => {
      server.use(
        rest.get(
          'https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status',
          (req, res) => res.networkError('Claims Status Failed'),
        ),
      );

      const onError = resp => {
        expect(resp instanceof Error).to.be.true;
        done();
      };
      const dispatch = sinon.spy();
      const onSuccess = sinon.spy();
      makeAuthRequest(
        '/v0/education_benefits_claims/stem_claim_status',
        null,
        dispatch,
        onSuccess,
        onError,
      );

      expect(onSuccess.called).to.be.false;
      expect(dispatch.called).to.be.false;
    });

    it('should dispatch auth error', done => {
      server.use(
        rest.get(
          'https://dev-api.va.gov/v0/education_benefits_claims/stem_claim_status',
          (req, res, ctx) => res(ctx.status(401), ctx.json({ status: 401 })),
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
        expect(linkToDDL.props().to).to.equal('your-claim-letters');

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
        expect(linkToDDL.props().to).to.equal('your-claim-letters');

        descText.unmount();
      });
    });
  });

  describe('makeDurationText', () => {
    const inputs = {
      exactSingular: [1, 1],
      exactPlural: [2, 2],
      range: [1, 8],
      empty: [],
      nonsense: 'danger, danger',
    };

    it('should return an object with header and description properties', () => {
      const testText = makeDurationText(inputs.exactSingular);
      expect(!!testText.header && !!testText.description).to.be.true;
    });

    it('should return an object with header and description properties with nonsense input', () => {
      const testText = makeDurationText(inputs.nonsense);
      expect(testText.header).to.equal('');
      expect(testText.description).to.equal('');
    });

    it('should return an object with header and description properties with empty array input', () => {
      const testText = makeDurationText(inputs.empty);
      expect(testText.header).to.equal('');
      expect(testText.description).to.equal('');
    });

    it('should return an object with header and description properties with no input', () => {
      const testText = makeDurationText();
      expect(testText.header).to.equal('');
      expect(testText.description).to.equal('');
    });

    it('should format exact singular time estimates', () => {
      const testText = makeDurationText(inputs.exactSingular);
      expect(testText.header).to.equal('1 month');
      expect(testText.description).to.equal('about 1 month');
    });

    it('should format exact plural time estimates', () => {
      const testText = makeDurationText(inputs.exactPlural);
      expect(testText.header).to.equal('2 months');
      expect(testText.description).to.equal('about 2 months');
    });

    it('should format range time estimates', () => {
      const testText = makeDurationText(inputs.range);
      expect(testText.header).to.equal('1–8 months');
      expect(testText.description).to.equal('between 1 and 8 months');
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
      // each of the 2 'remandSsoc' nextEvents has 4 properties
      expect(Object.keys(firstEvent).length).to.equal(4);
      expect(Object.keys(secondEvent).length).to.equal(4);
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
});
