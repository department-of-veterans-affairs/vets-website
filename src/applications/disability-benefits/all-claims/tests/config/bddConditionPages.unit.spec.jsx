import { expect } from 'chai';
import { add, format } from 'date-fns';
import { DATE_TEMPLATE } from '../../utils/dates/formatting';
import formConfig from '../../config/form';
import { disabilityBenefitsWorkflow } from '../../pages/disabilityBenefits';

const formatDate = date => format(date, DATE_TEMPLATE);
const daysFromToday = days => formatDate(add(new Date(), { days }));

const createBDDFormData = (overrides = {}) => ({
  'view:isBddData': true,
  serviceInformation: {
    servicePeriods: [
      {
        dateRange: {
          to: daysFromToday(90),
        },
      },
    ],
  },
  ...overrides,
});

const createNonBDDFormData = (overrides = {}) => ({
  serviceInformation: {
    servicePeriods: [
      {
        dateRange: {
          from: '2009-01-01',
          to: '2013-01-01',
        },
      },
    ],
  },
  ...overrides,
});

describe('BDD Condition Pages - depends functions', () => {
  describe('prisonerOfWar page depends (shared V1/V2)', () => {
    const { prisonerOfWar } = formConfig.chapters.disabilities.pages;

    it('should show POW page for BDD veterans when toggle is enabled and has new conditions', () => {
      const formData = createBDDFormData({
        disability526ExtraBDDPagesEnabled: true,
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should show POW page for BDD veterans when toggle is enabled and has secondary conditions', () => {
      const formData = createBDDFormData({
        disability526ExtraBDDPagesEnabled: true,
        newDisabilities: [{ condition: 'nerve damage', cause: 'SECONDARY' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should not show POW page for BDD veterans when toggle is disabled', () => {
      const formData = createBDDFormData({
        disability526ExtraBDDPagesEnabled: false,
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });

    it('should show POW page for non-BDD veterans with new conditions', () => {
      const formData = createNonBDDFormData({
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should not show POW page when there are no new conditions', () => {
      const formData = createBDDFormData({
        disability526ExtraBDDPagesEnabled: true,
      });
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });

    it('should not show POW page when new conditions array is empty', () => {
      const formData = createBDDFormData({
        disability526ExtraBDDPagesEnabled: true,
        newDisabilities: [],
      });
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });
  });

  describe('prisonerOfWar page depends — V2 workflow context', () => {
    const { prisonerOfWar } = formConfig.chapters.disabilities.pages;

    it('should show POW page for BDD veteran in V2 workflow when toggle is enabled', () => {
      const formData = createBDDFormData({
        disabilityCompNewConditionsWorkflow: true,
        disability526ExtraBDDPagesEnabled: true,
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should not show POW page for BDD veteran in V2 workflow when toggle is disabled', () => {
      const formData = createBDDFormData({
        disabilityCompNewConditionsWorkflow: true,
        disability526ExtraBDDPagesEnabled: false,
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });

    it('should show POW page for non-BDD veteran in V2 workflow with new conditions', () => {
      const formData = createNonBDDFormData({
        disabilityCompNewConditionsWorkflow: true,
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should not show POW page in V2 workflow when no new or secondary conditions', () => {
      const formData = createBDDFormData({
        disabilityCompNewConditionsWorkflow: true,
        disability526ExtraBDDPagesEnabled: true,
      });
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });

    it('should not show POW page in V2 workflow when conditions have no qualifying cause', () => {
      const formData = createBDDFormData({
        disabilityCompNewConditionsWorkflow: true,
        disability526ExtraBDDPagesEnabled: true,
        newDisabilities: [{ condition: 'back pain', cause: 'WORSENED' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });
  });

  describe('followUpDesc page depends (V1 workflow)', () => {
    const { followUpDesc } = disabilityBenefitsWorkflow;

    it('should show follow-up description for BDD veterans claiming new conditions', () => {
      const formData = createBDDFormData({
        newDisabilities: [{ condition: 'knee pain' }],
      });
      expect(followUpDesc.depends(formData)).to.be.true;
    });

    it('should show follow-up description for non-BDD veterans claiming new conditions', () => {
      const formData = createNonBDDFormData({
        newDisabilities: [{ condition: 'knee pain' }],
      });
      expect(followUpDesc.depends(formData)).to.be.true;
    });

    it('should not show follow-up description when not claiming new conditions', () => {
      const formData = createBDDFormData({
        'view:claimType': { 'view:claimingIncrease': true },
      });
      expect(followUpDesc.depends(formData)).to.not.be.ok;
    });
  });
});
