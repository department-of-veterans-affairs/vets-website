import { expect } from 'chai';
import {
  hideIfInHomeCare,
  requiredIfInHomeCare,
  getCostPageTitle,
  requiredIfMileageLocationOther,
} from '../../../../config/chapters/02-expenses/helpers';

describe('Chapter 2 helpers', () => {
  describe('hideIfInHomeCare', () => {
    it('should return false if typeOfCare is IN_HOME_CARE_ATTENDANT', () => {
      const formData = {
        careExpenses: [
          {
            typeOfCare: 'IN_HOME_CARE_ATTENDANT',
          },
        ],
      };
      const result = hideIfInHomeCare(formData, 0);
      expect(result).to.be.false;
    });

    it('should return true if typeOfCare is not IN_HOME_CARE_ATTENDANT', () => {
      const formData = {
        careExpenses: [
          {
            typeOfCare: 'OTHER',
          },
        ],
      };
      const result = hideIfInHomeCare(formData, 0);
      expect(result).to.be.true;
    });

    it('should return false if fullData has typeOfCare as IN_HOME_CARE_ATTENDANT', () => {
      const fullData = {
        careExpenses: [
          {
            typeOfCare: 'IN_HOME_CARE_ATTENDANT',
          },
        ],
      };
      const result = hideIfInHomeCare({}, 0, fullData);
      expect(result).to.be.false;
    });

    it('should return true if fullData has typeOfCare not IN_HOME_CARE_ATTENDANT', () => {
      const fullData = {
        careExpenses: [
          {
            typeOfCare: 'OTHER',
          },
        ],
      };
      const result = hideIfInHomeCare({}, 0, fullData);
      expect(result).to.be.true;
    });
  });
  describe('requiredIfInHomeCare', () => {
    it('should return true if typeOfCare is IN_HOME_CARE_ATTENDANT', () => {
      const formData = {
        careExpenses: [
          {
            typeOfCare: 'IN_HOME_CARE_ATTENDANT',
          },
        ],
      };
      const result = requiredIfInHomeCare(formData, 0);
      expect(result).to.be.true;
    });

    it('should return false if typeOfCare is not IN_HOME_CARE_ATTENDANT', () => {
      const formData = {
        careExpenses: [
          {
            typeOfCare: 'OTHER',
          },
        ],
      };
      const result = requiredIfInHomeCare(formData, 0);
      expect(result).to.be.false;
    });

    it('should return true if fullData has typeOfCare as IN_HOME_CARE_ATTENDANT', () => {
      const fullData = {
        careExpenses: [
          {
            typeOfCare: 'IN_HOME_CARE_ATTENDANT',
          },
        ],
      };
      const result = requiredIfInHomeCare({}, 0, fullData);
      expect(result).to.be.true;
    });

    it('should return false if fullData has typeOfCare not IN_HOME_CARE_ATTENDANT', () => {
      const fullData = {
        careExpenses: [
          {
            typeOfCare: 'OTHER',
          },
        ],
      };
      const result = requiredIfInHomeCare({}, 0, fullData);
      expect(result).to.be.false;
    });
  });
  describe('requiredIfMileageLocationOther', () => {
    it('should return true if travelLocation is OTHER', () => {
      const formData = {
        mileageExpenses: [
          {
            travelLocation: 'OTHER',
          },
        ],
      };
      const result = requiredIfMileageLocationOther(formData, 0);
      expect(result).to.be.true;
    });

    it('should return false if travelLocation is not OTHER', () => {
      const formData = {
        mileageExpenses: [
          {
            travelLocation: 'CLINIC',
          },
        ],
      };
      const result = requiredIfMileageLocationOther(formData, 0);
      expect(result).to.be.false;
    });

    it('should return true if fullData has travelLocation as OTHER', () => {
      const fullData = {
        mileageExpenses: [
          {
            travelLocation: 'OTHER',
          },
        ],
      };
      const result = requiredIfMileageLocationOther({}, 0, fullData);
      expect(result).to.be.true;
    });

    it('should return false if fullData travelLocation is not OTHER', () => {
      const fullData = {
        mileageExpenses: [
          {
            travelLocation: 'CLINIC',
          },
        ],
      };
      const result = requiredIfMileageLocationOther({}, 0, fullData);
      expect(result).to.be.false;
    });
  });
  describe('getCostPageTitle', () => {
    it('should return "Cost of care" when provider is not specified', () => {
      const formData = {};
      const result = getCostPageTitle(formData);
      expect(result).to.equal('Cost of care');
    });

    it('should return "Cost of care for [provider]" when provider is specified', () => {
      const formData = { provider: 'Dr Doe' };
      const result = getCostPageTitle(formData);
      expect(result).to.equal('Cost of care for Dr Doe');
    });
  });
});
