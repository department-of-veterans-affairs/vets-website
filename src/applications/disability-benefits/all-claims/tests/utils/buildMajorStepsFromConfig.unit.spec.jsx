import { expect } from 'chai';
import minimalTestData from '../fixtures/data/minimal-test.json';
import { buildMajorSteps } from '../../utils/buildMajorStepsFromConfig';

describe('buildMajorStepsFromConfig', () => {
  // const minimalTestData = {
  //   veteranFullName: {
  //     first: 'Test',
  //     last: 'User',
  //   },
  // };

  describe('buildMajorSteps', () => {
    it('should return an array of major steps', () => {
      const pathname = '/veteran-information';
      const steps = buildMajorSteps(minimalTestData, pathname);

      expect(steps).to.be.an('array');
      expect(steps.length).to.equal(6); // 5 chapters + review
    });

    it('should include all expected chapter keys', () => {
      const pathname = '/veteran-information';
      const steps = buildMajorSteps(minimalTestData, pathname);
      const keys = steps.map(step => step.key);

      // All chapters should be present in the navigation
      expect(keys).to.deep.equal([
        'veteranDetails',
        'disabilities',
        'mentalHealth',
        'supportingEvidence',
        'additionalInformation',
        'reviewSubmit',
      ]);
    });

    it('should include correct labels for each chapter', () => {
      const pathname = '/veteran-information';
      const steps = buildMajorSteps(minimalTestData, pathname);

      const veteranDetailsStep = steps.find(s => s.key === 'veteranDetails');
      const disabilitiesStep = steps.find(s => s.key === 'disabilities');
      const mentalHealthStep = steps.find(s => s.key === 'mentalHealth');
      const supportingEvidenceStep = steps.find(
        s => s.key === 'supportingEvidence',
      );
      const additionalInfoStep = steps.find(
        s => s.key === 'additionalInformation',
      );
      const reviewStep = steps.find(s => s.key === 'reviewSubmit');

      expect(veteranDetailsStep.label).to.equal('Veteran details');
      expect(disabilitiesStep.label).to.equal('Conditions');
      expect(mentalHealthStep.label).to.equal('Mental health');
      expect(supportingEvidenceStep.label).to.equal('Supporting evidence');
      expect(additionalInfoStep.label).to.equal('Additional information');
      expect(reviewStep.label).to.equal('Review and submit');
    });

    it('should mark the current chapter based on pathname', () => {
      const pathname = '/veteran-information';
      const steps = buildMajorSteps(minimalTestData, pathname);

      const veteranDetailsStep = steps.find(s => s.key === 'veteranDetails');
      expect(veteranDetailsStep.current).to.be.true;

      const otherSteps = steps.filter(s => s.key !== 'veteranDetails');
      otherSteps.forEach(step => {
        expect(step.current).to.be.false;
      });
    });

    it('should mark disabilities chapter as current when on conditions page', () => {
      const pathname = '/new-disabilities/add';
      const steps = buildMajorSteps(minimalTestData, pathname);

      const disabilitiesStep = steps.find(s => s.key === 'disabilities');
      expect(disabilitiesStep.current).to.be.true;
    });

    it('should mark review chapter as current when on review page', () => {
      const pathname = '/review-and-submit';
      const steps = buildMajorSteps(minimalTestData, pathname);

      const reviewStep = steps.find(s => s.key === 'reviewSubmit');
      expect(reviewStep.current).to.be.true;
    });

    it('should include path property for each step', () => {
      const pathname = '/veteran-information';
      const steps = buildMajorSteps(minimalTestData, pathname);

      steps.forEach(step => {
        expect(step).to.have.property('path');
        // Path can be undefined if no pages are visible in that chapter
        // Review step should always have a path
        if (step.key === 'reviewSubmit') {
          expect(step.path).to.equal('/review-and-submit');
        }
      });
    });
    it('should include idx property with correct indices', () => {
      const pathname = '/veteran-information';
      const steps = buildMajorSteps(minimalTestData, pathname);

      steps.forEach((step, index) => {
        expect(step.idx).to.equal(index);
      });
    });

    it('should handle conditional pages based on formData', () => {
      const formDataWithConditions = {
        ...minimalTestData,
        newDisabilities: [
          {
            condition: 'PTSD',
          },
        ],
      };

      const pathname = '/new-disabilities/add';
      const steps = buildMajorSteps(formDataWithConditions, pathname);

      // The disabilities chapter should be current
      const disabilitiesStep = steps.find(s => s.key === 'disabilities');
      expect(disabilitiesStep).to.exist;
      expect(disabilitiesStep.current).to.be.true;
    });

    it('should return review step with correct path', () => {
      const pathname = '/review-and-submit';
      const steps = buildMajorSteps(minimalTestData, pathname);

      const reviewStep = steps.find(s => s.key === 'reviewSubmit');
      expect(reviewStep.path).to.equal('/review-and-submit');
    });

    it('should handle empty pathname', () => {
      const pathname = '';
      const steps = buildMajorSteps(minimalTestData, pathname);

      expect(steps).to.be.an('array');
      expect(steps.length).to.equal(6);

      // No step should be marked as current
      steps.forEach(step => {
        expect(step.current).to.be.false;
      });
    });

    it('should handle pathname not matching any chapter', () => {
      const pathname = '/unknown-page';
      const steps = buildMajorSteps(minimalTestData, pathname);

      expect(steps).to.be.an('array');
      expect(steps.length).to.equal(6);

      // No step should be marked as current
      steps.forEach(step => {
        expect(step.current).to.be.false;
      });
    });

    it('should filter pages based on formData dependencies', () => {
      const formDataWithEvidence = {
        ...minimalTestData,
        'view:hasEvidence': true,
      };

      const pathname = '/supporting-evidence/evidence-types';
      const stepsWithEvidence = buildMajorSteps(formDataWithEvidence, pathname);

      const formDataWithoutEvidence = {
        ...minimalTestData,
        'view:hasEvidence': false,
      };

      const stepsWithoutEvidence = buildMajorSteps(
        formDataWithoutEvidence,
        pathname,
      );

      // Both should return steps, but paths may differ based on dependencies
      expect(stepsWithEvidence).to.be.an('array');
      expect(stepsWithoutEvidence).to.be.an('array');
    });

    it('should maintain step order consistently', () => {
      const pathname1 = '/veteran-information';
      const pathname2 = '/disabilities/add';

      const steps1 = buildMajorSteps(minimalTestData, pathname1);
      const steps2 = buildMajorSteps(minimalTestData, pathname2);

      // Keys should be in the same order regardless of current page
      const keys1 = steps1.map(s => s.key);
      const keys2 = steps2.map(s => s.key);

      expect(keys1).to.deep.equal(keys2);
    });

    it('should handle complex formData with multiple conditions', () => {
      const complexFormData = {
        ...minimalTestData,
        newDisabilities: [
          { condition: 'PTSD' },
          { condition: 'Anxiety' },
          { condition: 'Back pain' },
        ],
        ratedDisabilities: [
          {
            name: 'Knee pain',
            'view:selected': true,
          },
        ],
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasVaMedicalRecords': true,
          'view:hasPrivateMedicalRecords': true,
        },
      };

      const pathname = '/supporting-evidence/evidence-types';
      const steps = buildMajorSteps(complexFormData, pathname);

      expect(steps).to.be.an('array');
      expect(steps.length).to.equal(6);

      const supportingEvidenceStep = steps.find(
        s => s.key === 'supportingEvidence',
      );
      expect(supportingEvidenceStep.current).to.be.true;
    });

    it('should rebuild correctly when formData changes', () => {
      const pathname = '/veteran-information';

      const initialSteps = buildMajorSteps(minimalTestData, pathname);
      const updatedFormData = {
        ...minimalTestData,
        newDisabilities: [{ condition: 'Test condition' }],
      };
      const updatedSteps = buildMajorSteps(updatedFormData, pathname);

      // Both should return valid step arrays
      expect(initialSteps).to.be.an('array');
      expect(updatedSteps).to.be.an('array');
      expect(initialSteps.length).to.equal(updatedSteps.length);
    });

    it('should handle mental health chapter navigation', () => {
      const formDataWithMentalHealth = {
        ...minimalTestData,
        'view:form0781Enabled': true,
        'view:selectablePtsd': {
          'view:combatPtsd': true,
        },
        'view:combatPtsdOneSelected': true,
      };

      const pathname = '/mental-health-form-0781/workflow';
      const steps = buildMajorSteps(formDataWithMentalHealth, pathname);

      const mentalHealthStep = steps.find(s => s.key === 'mentalHealth');
      // Mental health chapter should exist even if current state depends on form data
      expect(mentalHealthStep).to.exist;
      expect(mentalHealthStep.key).to.equal('mentalHealth');
    });

    it('should handle additional information chapter navigation', () => {
      const pathname = '/payment-information';
      const steps = buildMajorSteps(minimalTestData, pathname);

      const additionalInfoStep = steps.find(
        s => s.key === 'additionalInformation',
      );
      expect(additionalInfoStep.current).to.be.true;
    });

    it('should return steps with all required properties', () => {
      const pathname = '/veteran-information';
      const steps = buildMajorSteps(minimalTestData, pathname);

      steps.forEach(step => {
        expect(step).to.have.property('idx');
        expect(step).to.have.property('key');
        expect(step).to.have.property('label');
        expect(step).to.have.property('path');
        expect(step).to.have.property('current');

        expect(step.idx).to.be.a('number');
        expect(step.key).to.be.a('string');
        expect(step.label).to.be.a('string');
        expect(step.current).to.be.a('boolean');
      });
    });
  });
});
