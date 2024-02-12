import React from 'react';
import { expect } from 'chai';
import { renderWithProfileReducers } from '../../tests/unit-test-helpers';

import ProofOfVeteranStatus from './ProofOfVeteranStatus';

function createBasicInitialState(dischargeCode) {
  return {
    user: {
      profile: {
        veteranStatus: {
          status: 'OK',
        },
      },
    },
    totalRating: {
      totalDisabilityRating: 40,
    },
    vaProfile: {
      hero: {
        userFullName: {
          first: 'Test',
          last: 'Test',
        },
      },
      personalInformation: {
        birthDate: '1986-05-06',
      },
      militaryInformation: {
        serviceHistory: {
          serviceHistory: [
            {
              branchOfService: 'Air Force',
              beginDate: '2009-04-12',
              endDate: '2013-04-11',
              personnelCategoryTypeCode: 'V',
              characterOfDischargeCode: dischargeCode,
            },
            {
              branchOfService: 'Air Force',
              beginDate: '2005-04-12',
              endDate: '2009-04-11',
              personnelCategoryTypeCode: 'A',
              characterOfDischargeCode: dischargeCode,
            },
          ],
        },
      },
    },
  };
}

describe('ProofOfVeteranStatus', () => {
  describe('when it exists', () => {
    const initialState = createBasicInitialState('A');

    it('should render heading', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      expect(view.queryByText(/Proof of Veteran status/)).to.exist;
    });

    it('should render description copy', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      expect(
        view.queryByText(
          /get discounts offered to Veterans at many restaurants/i,
        ),
      ).to.exist;
    });

    it('should render mobile app callout', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      expect(
        view.queryByText(/Get proof of Veteran Status on your mobile device/i),
      ).to.exist;
    });
  });

  describe('eligibility rules', () => {
    it('should not render if unknown discharge status', () => {
      const initialState = createBasicInitialState('DVN');
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      expect(view.queryByText(/Proof of Veteran status/)).not.to.exist;
    });

    it('should not render if dishonorable discharge status', () => {
      const initialState = createBasicInitialState('F');
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      expect(view.queryByText(/Proof of Veteran status/)).not.to.exist;
    });
  });
});
