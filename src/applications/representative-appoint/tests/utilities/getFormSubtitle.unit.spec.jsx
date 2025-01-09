import { expect } from 'chai';
import { getFormSubtitle } from '../../utilities/helpers';

describe('getFormSubtitle', () => {
  context('when the entity type is organization', () => {
    it('should return "VA Form 21-22"', () => {
      const mockFormData = {
        'view:selectedRepresentative': { type: 'organization' },
      };
      const result = getFormSubtitle(mockFormData);
      expect(result).to.equal('VA Form 21-22');
    });
  });

  context('when the entity type is representative', () => {
    context('when the individual type is veteran_service_officer', () => {
      it('should return "VA Form 21-22"', () => {
        const mockFormData = {
          'view:selectedRepresentative': {
            type: 'representative',
            attributes: { individualType: 'veteran_service_officer' },
          },
        };
        const result = getFormSubtitle(mockFormData);
        expect(result).to.equal('VA Form 21-22');
      });
    });

    context('when the individual type is representative', () => {
      it('should return "VA Form 21-22"', () => {
        const mockFormData = {
          'view:selectedRepresentative': {
            type: 'representative',
            attributes: { individualType: 'representative' },
          },
        };
        const result = getFormSubtitle(mockFormData);
        expect(result).to.equal('VA Form 21-22');
      });
    });

    context(
      'when the individual type is not veteran_service_officer or representative',
      () => {
        it('should return "VA Form 21-22a"', () => {
          const mockFormData = {
            'view:selectedRepresentative': {
              type: 'representative',
              attributes: { individualType: 'attorney' },
            },
          };
          const result = getFormSubtitle(mockFormData);
          expect(result).to.equal('VA Form 21-22a');
        });
      },
    );
  });

  context('when the entity type is individual', () => {
    context('when the individual type is representative', () => {
      it('should return "VA Form 21-22"', () => {
        const mockFormData = {
          'view:selectedRepresentative': {
            type: 'individual',
            attributes: { individualType: 'representative' },
          },
        };
        const result = getFormSubtitle(mockFormData);
        expect(result).to.equal('VA Form 21-22');
      });
    });

    context('when the individual type is veteran_service_officer', () => {
      it('should return "VA Form 21-22"', () => {
        const mockFormData = {
          'view:selectedRepresentative': {
            type: 'individual',
            attributes: { individualType: 'veteran_service_officer' },
          },
        };
        const result = getFormSubtitle(mockFormData);
        expect(result).to.equal('VA Form 21-22');
      });
    });

    context(
      'when the individual type is not veteran_service_officer or representative',
      () => {
        it('should return "VA Form 21-22a"', () => {
          const mockFormData = {
            'view:selectedRepresentative': {
              type: 'individual',
              attributes: { individualType: 'attorney' },
            },
          };
          const result = getFormSubtitle(mockFormData);
          expect(result).to.equal('VA Form 21-22a');
        });
      },
    );
  });

  context('when the entity type is anything else', () => {
    it('should return "VA Forms 21-22 and 21-22a"', () => {
      const mockFormData = {
        'view:selectedRepresentative': { type: 'else' },
      };
      const result = getFormSubtitle(mockFormData);
      expect(result).to.equal('VA Forms 21-22 and 21-22a');
    });
  });
});
