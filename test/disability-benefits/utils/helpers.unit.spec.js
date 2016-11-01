import { expect } from 'chai';

import { groupTimelineActivity, isCompleteClaim, truncateDescription } from '../../../src/js/disability-benefits/utils/helpers';

describe('Disability benefits helpers:', () => {
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
    it('should group micro phases into phase 3', () => {
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

      expect(phaseActivity[3].length).to.equal(3);
      expect(phaseActivity[3][0].type).to.equal('micro_phase');
      expect(phaseActivity[3][1].type).to.equal('micro_phase');
      expect(phaseActivity[3][2].type).to.equal('phase_entered');
    });
  });
  describe('isCompleteClaim', () => {
    it('should return false if any field is empty', () => {
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

      expect(isCompleteClaim(claim)).to.be.false;
    });

    it('should return true if no field is empty', () => {
      const claim = {
        attributes: {
          claimType: 'something',
          contentionList: [
            'thing'
          ],
          dateFiled: 'asdf',
          vaRepresentative: 'asdf'
        }
      };

      expect(isCompleteClaim(claim)).to.be.true;
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

      expect(isCompleteClaim(claim)).to.be.false;
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
});
