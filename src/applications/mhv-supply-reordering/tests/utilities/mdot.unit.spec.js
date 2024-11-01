import { expect } from 'chai';
import {
  isEligible,
  getAvailableSupplies,
  getUnavailableSupplies,
  numAvailableSupplies,
  getEligibilityDate,
} from '../../utilities/mdot';

describe('mdot utility', () => {
  const elig = (accessories = false, apneas = false, batteries = false) => {
    return {
      eligibility: {
        accessories,
        apneas,
        batteries,
      },
    };
  };

  describe('eligibility check', () => {
    it('false for no eligibility or all false', () => {
      expect(isEligible({})).to.be.false;
      expect(isEligible({ eligibility: {} })).to.be.false;
      expect(isEligible(elig)).to.be.false;
    });

    it('true for any eligibility that is true', () => {
      expect(isEligible(elig(true, true, true))).to.be.true;
      expect(isEligible(elig(true, true, false))).to.be.true;
      expect(isEligible(elig(true, false, false))).to.be.true;
      expect(isEligible(elig(false, true, true))).to.be.true;
      expect(isEligible(elig(false, false, true))).to.be.true;
      expect(isEligible(elig(false, true, false))).to.be.true;
    });
  });

  describe('mdot supplies', () => {
    const availSuppliesList = [
      {
        productName: 'ERHK HE11 680 MINI',
        productGroup: 'Accessory',
        productId: 6584,
        availableForReorder: true,
        lastOrderDate: '2022-05-16',
        nextAvailabilityDate: '2022-10-16',
        quantity: 5,
      },
      {
        productName: 'AIRFIT P10',
        productGroup: 'Apnea',
        productId: 6650,
        availableForReorder: true,
        lastOrderDate: '2022-07-05',
        nextAvailabilityDate: '2022-12-05',
        quantity: 1,
      },
    ];

    const unavailSuppliesList = [
      {
        productName: 'AIRCURVE10-ASV-CLIMATELINE',
        productGroup: 'Apnea',
        productId: 8467,
        lastOrderDate: '2022-07-06',
        nextAvailabilityDate: '2022-12-06',
        quantity: 1,
      },
      {
        productName: 'ACC2',
        productGroup: 'Accessory',
        productId: 9999,
        availableForReorder: true,
        lastOrderDate: '2023-07-06',
        nextAvailabilityDate: '2099-12-06',
        quantity: 1,
      },
    ];

    const mockMdot = (supplies = [], isElig = true) => {
      return {
        ...elig(isElig),
        supplies,
      };
    };

    it('get available supplies', () => {
      expect(getAvailableSupplies(undefined)).to.be.empty;
      expect(getAvailableSupplies({})).to.be.empty;
      expect(getAvailableSupplies({ supplies: [] })).to.be.empty;
      expect(getAvailableSupplies(mockMdot())).to.be.empty;
      expect(getAvailableSupplies(mockMdot(unavailSuppliesList))).to.be.empty;
      expect(getAvailableSupplies(mockMdot(availSuppliesList)).length).to.eql(
        2,
      );
    });

    it('get unavailable supplies', () => {
      expect(getUnavailableSupplies(undefined)).to.be.empty;
      expect(getUnavailableSupplies({})).to.be.empty;
      expect(getUnavailableSupplies({ supplies: [] })).to.be.empty;
      expect(getUnavailableSupplies(mockMdot())).to.be.empty;
      expect(getUnavailableSupplies(mockMdot(availSuppliesList))).to.be.empty;
      expect(
        getUnavailableSupplies(mockMdot(unavailSuppliesList)).length,
      ).to.eql(2);
    });

    it('get number of available supplies', () => {
      expect(numAvailableSupplies(undefined)).to.be.eql(0);
      expect(numAvailableSupplies({})).to.be.eql(0);
      expect(numAvailableSupplies({ supplies: [] })).to.be.eql(0);
      expect(numAvailableSupplies(mockMdot())).to.be.eql(0);
      expect(numAvailableSupplies(mockMdot(unavailSuppliesList))).to.be.eql(0);
      expect(numAvailableSupplies(mockMdot(availSuppliesList))).to.be.eql(2);
      expect(
        numAvailableSupplies(
          mockMdot([...availSuppliesList, ...unavailSuppliesList]),
        ),
      ).to.be.eql(2);
    });

    it('get eligibility date', () => {
      expect(getEligibilityDate(undefined)).to.be.null;
      expect(getEligibilityDate({})).to.be.null;
      expect(getEligibilityDate(mockMdot([], false))).to.be.null;
      expect(getEligibilityDate(mockMdot([]))).to.be.null;
      expect(getEligibilityDate(mockMdot(unavailSuppliesList))).to.be.null;
      expect(
        getEligibilityDate(mockMdot(unavailSuppliesList, false)),
      ).to.be.eql('2099-12-06');
      const earlierEligSupply = {
        productName: 'ACC3',
        productGroup: 'Accessory',
        productId: 9998,
        availableForReorder: true,
        lastOrderDate: '2023-07-06',
        nextAvailabilityDate: '2087-07-06',
        quantity: 1,
      };
      expect(
        getEligibilityDate(
          mockMdot([...unavailSuppliesList, earlierEligSupply], false),
        ),
      ).to.be.eql('2087-07-06');
    });
  });
});
