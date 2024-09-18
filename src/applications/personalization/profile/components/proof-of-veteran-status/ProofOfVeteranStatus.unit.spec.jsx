import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import * as generatePdfModule from '~/platform/pdf';
import { renderWithProfileReducers } from '../../tests/unit-test-helpers';
import ProofOfVeteranStatus from './ProofOfVeteranStatus';

const eligibleServiceHistoryItem = {
  branchOfService: 'Air Force',
  beginDate: '2009-04-12',
  endDate: '2013-04-11',
  personnelCategoryTypeCode: 'V',
  characterOfDischargeCode: 'A',
};
const ineligibleServiceHistoryItem = {
  branchOfService: 'Air Force',
  beginDate: '2009-04-12',
  endDate: '2013-04-11',
  personnelCategoryTypeCode: 'V',
  characterOfDischargeCode: 'D',
};
const neutralServiceHistoryItem = {
  branchOfService: 'Air Force',
  beginDate: '2009-04-12',
  endDate: '2013-04-11',
  personnelCategoryTypeCode: 'V',
  characterOfDischargeCode: 'DVN',
};

function createBasicInitialState(serviceHistory) {
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
          serviceHistory,
        },
      },
    },
  };
}

describe('ProofOfVeteranStatus', () => {
  describe('when it exists', () => {
    const initialState = createBasicInitialState([eligibleServiceHistoryItem]);

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

  describe('when eligible', () => {
    const initialState = createBasicInitialState([
      eligibleServiceHistoryItem,
      ineligibleServiceHistoryItem,
      neutralServiceHistoryItem,
    ]);

    it('should render card if service history contains an eligible discharge despite any other discharges', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      expect(
        view.queryByAltText(
          /sample proof of veteran status card featuring name, date of birth, disability rating and period of service/,
        ),
      ).to.exist;
    });

    it('should show error message if pdf generation fails', () => {
      const generatePdfStub = sinon
        .stub(generatePdfModule, 'generatePdf')
        .throws(new Error('Some Error'));
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      const link = view.container.querySelector('va-link');
      const errorMessage =
        "We're sorry. Something went wrong on our end. Please try to download your Veteran status card later.";

      expect(link.getAttribute('text')).to.equal(
        'Download and print your Veteran status card',
      );
      expect(view.queryByText(errorMessage)).to.not.exist;

      fireEvent.click(link);

      expect(generatePdfStub.called).to.be.true;
      expect(view.queryByText(errorMessage)).to.exist;
    });
  });

  describe('discharge status problem message', () => {
    it('should render if service history contains neither eligible nor ineligible discharges', () => {
      const initialState = createBasicInitialState([neutralServiceHistoryItem]);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      expect(
        view.queryByText(
          /We’re sorry. There’s a problem with your discharge status records./,
        ),
      ).to.exist;
    });
  });

  describe('ineligibility message', () => {
    it('should render if service history does not contain an eligible discharge, but does contain an inelible discharge', () => {
      const initialState = createBasicInitialState([
        ineligibleServiceHistoryItem,
        neutralServiceHistoryItem,
      ]);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      expect(
        view.queryByText(
          /Our records show that you’re not eligible for a Veteran status card./,
        ),
      ).to.exist;
    });
  });
});
