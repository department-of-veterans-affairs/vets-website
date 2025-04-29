import React from 'react';
import { expect } from 'chai';
import * as api from '~/platform/utilities/api';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { renderWithProfileReducers } from '../../tests/unit-test-helpers';
import ProofOfVeteranStatus from './ProofOfVeteranStatus';

const serviceHistoryItemOlder = {
  branchOfService: 'Air Force',
  beginDate: '2000-01-01',
  endDate: '2001-01-01',
  personnelCategoryTypeCode: 'V',
  characterOfDischargeCode: 'A',
};
const serviceHistoryItemMiddle = {
  branchOfService: 'Air Force',
  beginDate: '2010-01-01',
  endDate: '2011-01-01',
  personnelCategoryTypeCode: 'V',
  characterOfDischargeCode: 'A',
};
const serviceHistoryItemNewer = {
  branchOfService: 'Air Force',
  beginDate: '2020-01-01',
  endDate: '2021-01-01',
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
const vetStatusConfirmed = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: { veteranStatus: 'confirmed' },
  },
};
const vetStatusNotConfirmed = {
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
const vetStatusNotEligible = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: {
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'NOT_TITLE_38',
    },
    message: nonEligibility.message,
  },
};

function createBasicInitialState(serviceHistory, eligibility) {
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
          vetStatusEligibility: eligibility,
        },
      },
    },
  };
}

describe('ProofOfVeteranStatus', () => {
  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
  });
  afterEach(() => {
    apiRequestStub.restore();
  });

  describe('when it exists', () => {
    const initialState = createBasicInitialState(
      [serviceHistoryItemMiddle],
      confirmedEligibility,
    );

    it('should render heading', () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      const heading = view.getAllByText(/Proof of Veteran status/i);
      expect(heading).to.have.lengthOf.above(0);
    });

    it('should render description copy', async () => {
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      await waitFor(() => {
        expect(
          view.queryByText(
            /This card identifies a Veteran of the U.S. Uniformed Services./i,
          ),
        ).to.exist;
      });
    });

    it('should render mobile app callout', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      await waitFor(() => {
        expect(
          view.queryByText(
            /Get proof of Veteran Status on your mobile device/i,
          ),
        ).to.exist;
      });
    });
  });

  describe('should fetch verification status on render', () => {
    let initialState = createBasicInitialState(
      [serviceHistoryItemMiddle],
      confirmedEligibility,
    );

    it('displays the card successfully', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);

      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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
      apiRequestStub.resolves(vetStatusNotConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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

    it('handles a 504 API error with service history', async () => {
      const mockData = {
        errors: [
          {
            title: 'Gateway Timeout',
            detail: 'Did not receive a timely response.',
            code: '504',
            status: '504',
          },
        ],
      };
      apiRequestStub.rejects(mockData);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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

    it('handles a 403 API error with service history', async () => {
      const mockData = {
        errors: [
          {
            title: 'Forbidden',
            detail: 'User does not have access to the requested resource',
            code: '403',
            status: '403',
          },
        ],
      };
      apiRequestStub.rejects(mockData);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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

    it('displays loading indicator if fetch not complete', async () => {
      initialState = createBasicInitialState([], problematicEligibility);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      expect(view.getByTestId('proof-of-status-loading-indicator')).to.exist;
    });
  });

  describe('when eligible', () => {
    const initialState = createBasicInitialState(
      [
        serviceHistoryItemOlder,
        serviceHistoryItemMiddle,
        serviceHistoryItemNewer,
        ineligibleServiceHistoryItem,
        neutralServiceHistoryItem,
      ],
      confirmedEligibility,
    );

    it('should render card if service history contains an eligible discharge despite any other discharges', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        expect(
          view.queryByText(
            /This status doesn’t entitle you to any VA benefits./,
          ),
        ).to.exist;
      });
    });

    it('should render the latest service item', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });
      await waitFor(() => {
        expect(view.queryByText(/United States Air Force • 2020–2021/)).to
          .exist;
      });
    });

    it('should render the print button', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        const link = view.container.querySelector('va-link');
        expect(link.getAttribute('text')).to.equal(
          'Print your Proof of Veteran status (PDF)',
        );
      });
    });
  });

  describe('when there is no service history', () => {
    const initialState = createBasicInitialState([], problematicEligibility);

    it('displays not confirmed message if confirmed', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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

    it('displays not confirmed message if not confirmed', async () => {
      apiRequestStub.resolves(vetStatusNotConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
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

  describe('when there is no veteran full name', () => {
    const initialState = createBasicInitialState(
      [
        serviceHistoryItemMiddle,
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

    it('should render an error and not the HTML card', async () => {
      apiRequestStub.resolves(vetStatusNotConfirmed);
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      const heading = view.getAllByText(/Proof of Veteran status/);
      expect(heading).to.have.lengthOf.to.be(1); // only appears once as the section heading, not here as the card heading

      await waitFor(() => {
        expect(
          view.queryByText(
            /We’re sorry. There’s a problem with our system. We can’t show your Veteran status card right now. Try again later./,
          ),
        ).to.exist;
        expect(
          view.queryByText(
            /We’re sorry. There’s a problem with your discharge status records./,
          ),
        ).to.not.exist;
      });
    });
  });

  describe('ineligibility message', () => {
    it('should render if service history does not contain an eligible discharge, but does contain an inelible discharge', async () => {
      apiRequestStub.resolves(vetStatusNotEligible);
      const initialState = createBasicInitialState(
        [ineligibleServiceHistoryItem, neutralServiceHistoryItem],
        nonEligibility,
      );
      const view = renderWithProfileReducers(<ProofOfVeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        expect(
          view.queryByText(
            /Our records show that you’re not eligible for a Veteran status card./,
          ),
        ).to.exist;
      });
    });
  });
});
