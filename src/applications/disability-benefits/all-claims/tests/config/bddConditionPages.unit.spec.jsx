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
  describe('prisonerOfWar page depends', () => {
    const { prisonerOfWar } = formConfig.chapters.disabilities.pages;

    it('should show POW page for BDD veterans with new conditions', () => {
      const formData = createBDDFormData({
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should show POW page for BDD veterans with secondary conditions', () => {
      const formData = createBDDFormData({
        newDisabilities: [{ condition: 'nerve damage', cause: 'SECONDARY' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should show POW page for non-BDD veterans with new conditions', () => {
      const formData = createNonBDDFormData({
        newDisabilities: [{ condition: 'knee pain', cause: 'NEW' }],
      });
      expect(prisonerOfWar.depends(formData)).to.be.true;
    });

    it('should not show POW page when there are no new conditions', () => {
      const formData = createBDDFormData();
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });

    it('should not show POW page when new conditions array is empty', () => {
      const formData = createBDDFormData({ newDisabilities: [] });
      expect(prisonerOfWar.depends(formData)).to.be.false;
    });
  });

  describe('followUpDesc page depends (V1 workflow)', () => {
    const { followUpDesc } = disabilityBenefitsWorkflow;

    it('should show follow-up description for BDD veterans claiming new conditions', () => {
      const formData = createBDDFormData({
        'view:claimType': { 'view:claimingNew': true },
        newDisabilities: [{ condition: 'knee pain' }],
      });
      expect(followUpDesc.depends(formData)).to.be.true;
    });

    it('should show follow-up description for non-BDD veterans claiming new conditions', () => {
      const formData = createNonBDDFormData({
        'view:claimType': { 'view:claimingNew': true },
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
