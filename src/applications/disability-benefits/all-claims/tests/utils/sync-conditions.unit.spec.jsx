import { expect } from 'chai';

import {
  syncRatedDisabilitiesToNewConditions,
  syncNewConditionsToRatedDisabilities,
  normalizeNewDisabilities,
} from '../../utils/sync-conditions';

describe('sync-conditions', () => {
  describe('syncRatedDisabilitiesToNewConditions', () => {
    it('returns original formData if no rated disabilities are selected', () => {
      const formData = {
        ratedDisabilities: [{ name: 'PTSD', 'view:selected': false }],
        newDisabilities: [],
      };

      const result = syncRatedDisabilitiesToNewConditions(formData);
      expect(result).to.equal(formData);
    });

    it('adds a worsened Rated Disability entry for each selected rated disability', () => {
      const formData = {
        ratedDisabilities: [
          { name: 'PTSD', 'view:selected': true },
          { name: 'Tinnitus', 'view:selected': false },
        ],
        newDisabilities: [],
      };

      const result = syncRatedDisabilitiesToNewConditions(formData);

      expect(result).to.not.equal(formData);
      expect(result.newDisabilities).to.have.length(1);
      expect(result.newDisabilities[0]).to.include({
        ratedDisability: 'PTSD',
        cause: 'WORSENED',
        condition: 'Rated Disability',
        worsenedDescription: 'Rated Disability Increase',
        worsenedEffects: 'Rated Disability Increase',
      });
    });

    it('does not add duplicates (case-insensitive)', () => {
      const formData = {
        ratedDisabilities: [{ name: 'PTSD', 'view:selected': true }],
        newDisabilities: [
          {
            ratedDisability: 'ptsd',
            cause: 'WORSENED',
            condition: 'Rated Disability',
          },
        ],
      };

      const result = syncRatedDisabilitiesToNewConditions(formData);
      expect(result).to.equal(formData);
      expect(result.newDisabilities).to.have.length(1);
    });
  });

  describe('syncNewConditionsToRatedDisabilities', () => {
    it('returns original formData if there are no rated increases in newDisabilities', () => {
      const formData = {
        ratedDisabilities: [{ name: 'PTSD', 'view:selected': false }],
        newDisabilities: [{ condition: 'hearing loss', cause: 'NEW' }],
        'view:claimType': { 'view:claimingIncrease': false },
      };

      const result = syncNewConditionsToRatedDisabilities(formData);
      expect(result).to.equal(formData);
    });

    it('marks matching rated disabilities as selected and removes the synthetic newDisabilities entries', () => {
      const formData = {
        ratedDisabilities: [{ name: 'PTSD', 'view:selected': false }],
        newDisabilities: [
          {
            cause: 'WORSENED',
            condition: 'Rated Disability',
            ratedDisability: 'PTSD',
          },
        ],
        'view:claimType': { 'view:claimingIncrease': false },
      };

      const result = syncNewConditionsToRatedDisabilities(formData);

      expect(result).to.not.equal(formData);
      expect(result.ratedDisabilities[0]['view:selected']).to.equal(true);
      expect(result.newDisabilities).to.have.length(0);
      expect(result['view:claimType']['view:claimingIncrease']).to.equal(true);
    });

    it('ignores placeholder ratedDisability value', () => {
      const formData = {
        ratedDisabilities: [{ name: 'PTSD', 'view:selected': false }],
        newDisabilities: [
          {
            cause: 'WORSENED',
            condition: 'Rated Disability',
            ratedDisability: "A condition I haven't claimed before",
          },
        ],
        'view:claimType': { 'view:claimingIncrease': false },
      };

      const result = syncNewConditionsToRatedDisabilities(formData);
      expect(result).to.equal(formData);
    });

    it('matches rated disabilities case-insensitively', () => {
      const formData = {
        ratedDisabilities: [{ name: 'PTSD', 'view:selected': false }],
        newDisabilities: [
          {
            cause: 'WORSENED',
            condition: 'Rated Disability',
            ratedDisability: 'ptsd',
          },
        ],
        'view:claimType': { 'view:claimingIncrease': false },
      };

      const result = syncNewConditionsToRatedDisabilities(formData);

      // This SHOULD pass after you normalize the .has() checks for rd.name and nd.ratedDisability.
      expect(result.ratedDisabilities[0]['view:selected']).to.equal(true);
      expect(result.newDisabilities).to.have.length(0);
    });
  });

  describe('normalizeNewDisabilities', () => {
    it('hoists SECONDARY fields from nested to top-level when missing', () => {
      const formData = {
        newDisabilities: [
          {
            cause: 'SECONDARY',
            'view:secondaryFollowUp': {
              causedByDisability: 'Knee',
              causedByDisabilityDescription: 'Led to back pain',
            },
          },
        ],
      };

      const result = normalizeNewDisabilities(formData);
      expect(result).to.not.equal(formData);
      expect(result.newDisabilities[0]).to.include({
        causedByDisability: 'Knee',
        causedByDisabilityDescription: 'Led to back pain',
      });
    });

    it('backfills nested SECONDARY fields from top-level when nested missing', () => {
      const formData = {
        newDisabilities: [
          {
            cause: 'SECONDARY',
            causedByDisability: 'Knee',
            causedByDisabilityDescription: 'Led to back pain',
          },
        ],
      };

      const result = normalizeNewDisabilities(formData);
      expect(result).to.not.equal(formData);
      expect(
        result.newDisabilities[0]['view:secondaryFollowUp'],
      ).to.deep.include({
        causedByDisability: 'Knee',
        causedByDisabilityDescription: 'Led to back pain',
      });
    });

    it('VA: does not overwrite an existing nested vaMistreatmentDate', () => {
      const formData = {
        newDisabilities: [
          {
            cause: 'VA',
            'view:vaFollowUp': { vaMistreatmentDate: 'March 2019' },
          },
        ],
      };

      const result = normalizeNewDisabilities(formData);

      expect(
        result.newDisabilities[0]['view:vaFollowUp'].vaMistreatmentDate,
      ).to.equal('March 2019');
    });

    it('VA: if nested date missing, uses item.vaMistreatmentDate before defaulting current year', () => {
      const formData = {
        newDisabilities: [
          {
            cause: 'VA',
            vaMistreatmentDate: 'A while ago',
            'view:vaFollowUp': {},
          },
        ],
      };

      const result = normalizeNewDisabilities(formData);
      expect(result).to.not.equal(formData);
      expect(
        result.newDisabilities[0]['view:vaFollowUp'].vaMistreatmentDate,
      ).to.equal('A while ago');
    });

    it('VA: if no date anywhere, defaults nested vaMistreatmentDate to current year', () => {
      const formData = {
        newDisabilities: [
          {
            cause: 'VA',
            'view:vaFollowUp': {},
          },
        ],
      };

      const result = normalizeNewDisabilities(formData);
      expect(result).to.not.equal(formData);
      expect(
        result.newDisabilities[0]['view:vaFollowUp'].vaMistreatmentDate,
      ).to.equal('2026');
    });
  });
});
