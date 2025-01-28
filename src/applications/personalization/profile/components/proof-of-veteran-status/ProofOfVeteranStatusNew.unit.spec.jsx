import React from 'react';
import { expect } from 'chai';
import * as api from '~/platform/utilities/api';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithProfileReducers } from '../../tests/unit-test-helpers';
import ProofOfVeteranStatusNew from './ProofOfVeteranStatusNew';

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
const confirmedEligibility = {
  confirmed: true,
  message: [],
};
const problematicEligibility = {
  confirmed: false,
  message: [
    'We’re sorry. There’s a problem with your discharge status records. We can’t provide a Veteran status card for you right now.',
    'To fix the problem with your records, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
  ],
};
const nonEligibility = {
  confirmed: false,
  message: [
    'Our records show that you’re not eligible for a Veteran status card. To get a Veteran status card, you must have received an honorable discharge for at least one period of service.',
    'If you think your discharge status is incorrect, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
  ],
};

function createBasicInitialState(
  serviceHistory,
  eligibility,
  enableToggle = false,
) {
  return {
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      veteran_status_card_use_lighthouse_frontend: enableToggle,
    },
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
          vetStatusEligibility: eligibility,
        },
      },
    },
  };
}

describe('ProofOfVeteranStatusNew', () => {
  describe('when it exists', () => {
    const initialState = createBasicInitialState(
      [eligibleServiceHistoryItem],
      confirmedEligibility,
    );

    it('should render heading', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });
      const heading = view.getAllByText(/Proof of Veteran status/i);
      expect(heading).to.have.lengthOf.above(0);
    });

    it('should render description copy', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });
      expect(
        view.queryByText(
          /This card identifies a Veteran of the U.S. Uniformed Services./i,
        ),
      ).to.exist;
    });

    it('should render mobile app callout', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });
      expect(
        view.queryByText(/Get proof of Veteran Status on your mobile device/i),
      ).to.exist;
    });
  });

  describe('should fetch verification status on render', () => {
    let apiRequestStub;
    let initialState = createBasicInitialState(
      [eligibleServiceHistoryItem],
      confirmedEligibility,
      true,
    );

    beforeEach(() => {
      apiRequestStub = sinon.stub(api, 'apiRequest');
    });

    afterEach(() => {
      apiRequestStub.restore();
    });

    it('displays the card successfully', async () => {
      const mockData = {
        data: {
          id: '',
          type: 'veteran_status_confirmations',
          attributes: { veteranStatus: 'confirmed' },
        },
      };

      apiRequestStub.resolves(mockData);

      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      sinon.assert.calledWith(
        apiRequestStub,
        '/profile/vet_verification_status',
      );
      await waitFor(() => {
        expect(
          view.queryByText(
            /Get proof of Veteran status on your mobile device/i,
          ),
        ).to.exist;
        expect(
          view.queryByText(
            /We’re sorry. There’s a problem with your discharge status records. We can’t provide a Veteran status card for you right now./,
          ),
        ).to.not.exist;
      });
    });

    it('displays the returned not confirmed message', async () => {
      const mockData = {
        data: {
          id: '',
          type: 'veteran_status_confirmations',
          attributes: {
            veteranStatus: 'not confirmed',
            notConfirmedReason: 'PERSON_NOT_FOUND',
          },
          message: problematicEligibility.message,
        },
      };

      apiRequestStub.resolves(mockData);
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      await waitFor(() => {
        expect(
          view.queryByText(
            /Get proof of Veteran Status on your mobile device/i,
          ),
        ).to.not.exist;
        expect(
          view.queryByText(
            /We’re sorry. There’s a problem with your discharge status records. We can’t provide a Veteran status card for you right now./,
          ),
        ).to.exist;
      });
    });

    it('handles empty API response', async () => {
      const mockData = {
        data: {},
      };
      apiRequestStub.resolves(mockData);
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      await waitFor(() => {
        expect(
          view.queryByText(
            'We’re sorry. There’s a problem with our system. We can’t show your Veteran status card right now. Try again later.',
          ),
        ).to.exist;
      });
    });

    it('handles API error', async () => {
      apiRequestStub.rejects(new Error('API Error'));
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      await waitFor(() => {
        expect(
          view.getByText(
            'We’re sorry. There’s a problem with our system. We can’t show your Veteran status card right now. Try again later.',
          ),
        ).to.exist;
      });
    });

    it('displays not confirmed message if confirmed with no service history', async () => {
      const mockData = {
        data: {
          id: '',
          type: 'veteran_status_confirmations',
          attributes: { veteranStatus: 'confirmed' },
        },
      };
      apiRequestStub.resolves(mockData);

      initialState = createBasicInitialState([], problematicEligibility, true);
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      sinon.assert.calledWith(
        apiRequestStub,
        '/profile/vet_verification_status',
      );
      await waitFor(() => {
        expect(
          view.queryByText(
            /We’re sorry. There’s a problem with your discharge status records. We can’t provide a Veteran status card for you right now./,
          ),
        ).to.exist;
      });
    });

    it('displays not confirmed message if not confirmed and no service history', async () => {
      const mockData = {
        data: {
          id: '',
          type: 'veteran_status_confirmations',
          attributes: {
            veteranStatus: 'not confirmed',
            notConfirmedReason: 'PERSON_NOT_FOUND',
          },
          message: problematicEligibility.message,
        },
      };
      apiRequestStub.resolves(mockData);
      initialState = createBasicInitialState([], problematicEligibility, true);
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      await waitFor(() => {
        expect(
          view.queryByText(
            /Get proof of Veteran Status on your mobile device/i,
          ),
        ).to.not.exist;
        expect(
          view.queryByText(
            /We’re sorry. There’s a problem with your discharge status records. We can’t provide a Veteran status card for you right now./,
          ),
        ).to.exist;
      });
    });
  });

  describe('when eligible', () => {
    const initialState = createBasicInitialState(
      [
        eligibleServiceHistoryItem,
        ineligibleServiceHistoryItem,
        neutralServiceHistoryItem,
      ],
      confirmedEligibility,
    );

    it('should render card if service history contains an eligible discharge despite any other discharges', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      expect(
        view.queryByText(/This status doesn’t entitle you to any VA benefits./),
      ).to.exist;
    });
  });

  describe('when there is no service history', () => {
    const initialState = createBasicInitialState([], confirmedEligibility);

    it('should render an error and not the HTML card', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      const heading = view.getAllByText(/Proof of Veteran status/);
      expect(heading).to.have.lengthOf.to.be(1); // only appears once as the section heading, not here as the card heading

      expect(
        view.queryByText(
          /We’re sorry. There’s a problem with our system. We can’t show your Veteran status card right now. Try again later./,
        ),
      ).to.exist;
    });
  });

  describe('when there is no veteran full name', () => {
    const initialState = createBasicInitialState(
      [
        eligibleServiceHistoryItem,
        ineligibleServiceHistoryItem,
        neutralServiceHistoryItem,
      ],
      confirmedEligibility,
    );
    initialState.vaProfile.hero.userFullName = {
      first: '',
      middle: '',
      last: '',
      suffix: '',
    };

    it('should render an error and not the HTML card', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
        initialState,
      });

      const heading = view.getAllByText(/Proof of Veteran status/);
      expect(heading).to.have.lengthOf.to.be(1); // only appears once as the section heading, not here as the card heading

      expect(
        view.queryByText(
          /We’re sorry. There’s a problem with our system. We can’t show your Veteran status card right now. Try again later./,
        ),
      ).to.exist;
    });
  });

  describe('discharge status problem message', () => {
    it('should render if service history contains neither eligible nor ineligible discharges', () => {
      const initialState = createBasicInitialState(
        [neutralServiceHistoryItem],
        problematicEligibility,
      );
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
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
      const initialState = createBasicInitialState(
        [ineligibleServiceHistoryItem, neutralServiceHistoryItem],
        nonEligibility,
      );
      const view = renderWithProfileReducers(<ProofOfVeteranStatusNew />, {
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
