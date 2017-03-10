import { expect } from 'chai';
import sinon from 'sinon';

import {
  groupTimelineActivity,
  isPopulatedClaim,
  hasBeenReviewed,
  getDocTypeDescription,
  displayFileSize,
  getUserPhase,
  getUserPhaseDescription,
  getPhaseDescription,
  truncateDescription,
  getItemDate,
  isClaimComplete,
  itemsNeedingAttentionFromVet,
  makeAuthRequest,
  getClaimType
} from '../../../src/js/disability-benefits/utils/helpers';

describe('Disability benefits helpers: ', () => {
  describe('groupTimelineActivity', () => {
    it('should group events before a phase into phase 1', () => {
      const events = [
        {
          type: 'filed',
          date: '2010-05-03'
        }
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[1][0].type).to.equal('filed');
    });
    it('should filter out events without a date', () => {
      const events = [
        {
          type: 'filed',
          date: null
        }
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity).to.be.empty;
    });
    it('should group events after phase 1 into phase 2', () => {
      const events = [
        {
          type: 'some_event',
          date: '2010-05-05'
        },
        {
          type: 'some_event',
          date: '2010-05-04'
        },
        {
          type: 'phase1',
          date: '2010-05-03'
        },
        {
          type: 'filed',
          date: '2010-05-01'
        }
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[1][0].type).to.equal('filed');
      expect(phaseActivity[2].length).to.equal(3);
    });
    it('should discard micro phases', () => {
      const events = [
        {
          type: 'phase5',
          date: '2010-05-07'
        },
        {
          type: 'phase4',
          date: '2010-05-06'
        },
        {
          type: 'phase3',
          date: '2010-05-05'
        },
        {
          type: 'phase2',
          date: '2010-05-04'
        },
        {
          type: 'phase1',
          date: '2010-05-03'
        },
        {
          type: 'filed',
          date: '2010-05-01'
        }
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[3].length).to.equal(1);
      expect(phaseActivity[3][0].type).to.equal('phase_entered');
    });
    it('should group events into correct bucket', () => {
      const events = [
        {
          type: 'received_from_you_list',
          date: '2016-11-02'
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02'
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02'
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02'
        },
        {
          type: 'phase5',
          date: '2016-11-02'
        },
        {
          type: 'phase4',
          date: '2016-11-02'
        },
        {
          type: 'phase3',
          date: '2016-11-02'
        },
        {
          type: 'phase2',
          date: '2016-11-02'
        },
        {
          type: 'other_documents_list',
          uploadDate: '2016-03-24'
        },
        {
          type: 'other_documents_list',
          uploadDate: '2015-08-28'
        },
        {
          type: 'other_documents_list',
          uploadDate: '2015-08-28'
        },
        {
          type: 'phase1',
          date: '2015-04-20'
        },
        {
          type: 'filed',
          date: '2015-04-20'
        },
        {
          type: 'other_documents_list',
          uploadDate: null
        }
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
          contentionList: [
            'thing'
          ],
          dateFiled: '',
        }
      };

      expect(isPopulatedClaim(claim)).to.be.false;
    });

    it('should return true if no field is empty', () => {
      const claim = {
        attributes: {
          claimType: 'something',
          contentionList: [
            'thing'
          ],
          dateFiled: 'asdf',
          vaRepresentative: null
        }
      };

      expect(isPopulatedClaim(claim)).to.be.true;
    });

    it('should return false if contention list is empty', () => {
      const claim = {
        attributes: {
          claimType: 'something',
          contentionList: [
          ],
          dateFiled: 'asdf',
          vaRepresentative: 'test'
        }
      };

      expect(isPopulatedClaim(claim)).to.be.false;
    });
  });
  describe('truncateDescription', () => {
    it('should truncate text longer than 120 characters', () => {
      const userText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';
      const userTextEllipsed = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq…';

      const text = truncateDescription(userText);
      expect(text).to.equal(userTextEllipsed);
    });
  });
  describe('hasBeenReviewed', () => {
    it('should check that item is reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'ACCEPTED'
      });

      expect(result).to.be.true;
    });
    it('should check that item has not been reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'SUBMITTED_AWAITING_REVIEW'
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
        documents: [
          { uploadDate: '2011-01-01' }
        ],
        date: '2012-01-01'
      });

      expect(date).to.equal('2010-01-01');
    });
    it('should use the last document upload date', () => {
      const date = getItemDate({
        receivedDate: null,
        documents: [
          { uploadDate: '2011-01-01' },
          { uploadDate: '2012-01-01' }
        ],
        date: '2013-01-01'
      });

      expect(date).to.equal('2012-01-01');
    });
    it('should use the date', () => {
      const date = getItemDate({
        receivedDate: null,
        documents: [
        ],
        date: '2013-01-01'
      });

      expect(date).to.equal('2013-01-01');
    });
    it('should use the upload date', () => {
      const date = getItemDate({
        uploadDate: '2014-01-01',
        type: 'other_documents_list',
        date: '2013-01-01'
      });

      expect(date).to.equal('2014-01-01');
    });
  });
  describe('isClaimComplete', () => {
    it('should check if claim is in complete phase', () => {
      const isComplete = isClaimComplete({
        attributes: {
          phase: 8
        }
      });

      expect(isComplete).to.be.true;
    });
    it('should check if claim has decision letter', () => {
      const isComplete = isClaimComplete({
        attributes: {
          decisionLetterSent: true
        }
      });

      expect(isComplete).to.be.true;
    });
  });
  describe('itemsNeedingAttentionFromVet', () => {
    it('should return number of needed items from vet', () => {
      const itemsNeeded = itemsNeedingAttentionFromVet([
        {
          type: 'still_need_from_you_list',
          status: 'NEEDED'
        },
        {
          type: 'still_need_from_you_list',
          status: 'SUBMITTED_AWAITING_REVIEW'
        },
        {
          type: 'still_need_from_others_list',
          status: 'NEEDED'
        }
      ]);

      expect(itemsNeeded).to.equal(1);
    });
  });

  describe('getClaimType', () => {
    it('should return the claim type', () => {
      const claim = {
        attributes: {
          claimType: 'Awesome'
        }
      };
      expect(getClaimType(claim)).to.equal('Awesome');
    });
    it('should return the default claim type', () => {
      const claim = {
        attributes: {
          claimType: undefined
        }
      };
      expect(getClaimType(claim)).to.equal('Disability Compensation');
    });
  });

  describe('makeAuthRequest', () => {
    let fetchMock = sinon.stub();
    let oldFetch = global.fetch;
    beforeEach(() => {
      oldFetch = global.fetch;
      fetchMock = sinon.stub();
      global.fetch = fetchMock;
    });
    afterEach(() => {
      global.fetch = oldFetch;
    });
    it('should make a fetch request', (done) => {
      global.sessionStorage = { userToken: '1234' };
      fetchMock.returns({
        then: (fn) => fn({ ok: true, json: () => Promise.resolve() })
      });

      const onSuccess = () => done();
      makeAuthRequest('/testing', null, sinon.spy(), onSuccess);

      expect(fetchMock.called).to.be.true;
      expect(fetchMock.firstCall.args[0]).to.contain('/testing');
      expect(fetchMock.firstCall.args[1].method).to.equal('GET');
    });
    it('should reject promise when there is an error', (done) => {
      global.sessionStorage = { userToken: '1234' };
      fetchMock.returns({
        then: (fn) => fn({ ok: false, status: 500, json: () => Promise.resolve() })
      });

      const onError = (resp) => {
        expect(resp.ok).to.be.false;
        done();
      };
      makeAuthRequest('/testing', null, sinon.spy(), sinon.spy(), onError);

      expect(fetchMock.called).to.be.true;
      expect(fetchMock.firstCall.args[0]).to.contain('/testing');
      expect(fetchMock.firstCall.args[1].method).to.equal('GET');
    });
    it('should dispatch auth error', (done) => {
      global.sessionStorage = { userToken: '1234' };
      fetchMock.returns({
        then: (fn) => fn({ ok: false, status: 401, json: () => Promise.resolve() })
      });

      const onError = sinon.spy();
      const onSuccess = sinon.spy();
      const dispatch = (action) => {
        expect(action.type).to.equal('SET_UNAUTHORIZED');
        expect(onError.called).to.be.false;
        expect(onSuccess.called).to.be.false;
        done();
      };

      makeAuthRequest('/testing', null, dispatch, onSuccess, onError);
    });
  });
});
