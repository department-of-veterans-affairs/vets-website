import React from 'react';
import { expect } from 'chai';
import { datadogRum } from '@datadog/browser-rum';
import * as api from '~/platform/utilities/api';
import * as pdf from '~/platform/pdf';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { addDays, subDays, format } from 'date-fns';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { externalServices } from '~/platform/monitoring/DowntimeNotification';
import { TOGGLE_NAMES } from '~/platform/utilities/feature-toggles';
import { renderWithProfileReducers } from '../../unit-test-helpers';
import VeteranStatus from '../../../components/veteran-status-card/VeteranStatus';

// Mock downtime data
const downtime = maintenanceWindows => {
  return createServiceMap(
    maintenanceWindows.map(maintenanceWindow => {
      return {
        attributes: {
          externalService: maintenanceWindow,
          status: 'down',
          startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
        },
      };
    }),
  );
};

// Mock title, message and status data
const dischargeProblemData = {
  title: 'You’re not eligible for a Veteran Status Card',
  message: [
    'To get a Veteran status card, you must have received an honorable discharge for at least one period of service.',
    'If you think your discharge status is incorrect, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
  ],
  status: 'warning',
};
const notEligibleData = {
  title: 'You’re not eligible for a Veteran Status Card',
  message: [
    'To get a Veteran status card, you must have received an honorable discharge for at least one period of service.',
    'If you think your discharge status is incorrect, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
  ],
  status: 'warning',
};

// Mock service history data
const serviceEpisodes = [
  {
    branchOfService: 'Air Force',
    beginDate: '2009-04-12',
    endDate: '2013-04-11',
    periodOfServiceTypeCode: 'V',
    periodOfServiceTypeText: 'Reserve member',
    characterOfDischargeCode: 'A',
  },
  {
    branchOfService: 'Air Force',
    beginDate: '2005-04-12',
    endDate: '2009-04-11',
    periodOfServiceTypeCode: 'A',
    periodOfServiceTypeText: 'Active duty member',
    characterOfDischargeCode: 'A',
  },
];
const serviceHistoryConfirmed = {
  serviceHistory: serviceEpisodes,
  vetStatusEligibility: {
    confirmed: true,
    message: [],
  },
};
const serviceHistoryConfirmedReverse = {
  serviceHistory: [...serviceEpisodes].reverse(),
  vetStatusEligibility: {
    confirmed: true,
    message: [],
  },
};
const serviceHistory403Error = {
  error: {
    errors: [{ code: '403' }],
  },
};
const serviceHistoryNon403Error = {
  error: {
    errors: [{ code: '500' }],
  },
};
const serviceHistoryNone = {
  serviceHistory: [],
};
const serviceHistoryDischargeProblem = {
  serviceHistory: [],
  vetStatusEligibility: {
    confirmed: false,
    ...dischargeProblemData,
  },
};
const serviceHistoryNotEligible = {
  serviceHistory: [],
  vetStatusEligibility: {
    confirmed: false,
    ...notEligibleData,
  },
};

// Mock vet verification status data
const vetStatusConfirmed = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: { veteranStatus: 'confirmed' },
  },
};
const vetStatusDischargeProblem = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: {
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'PERSON_NOT_FOUND',
    },
    ...dischargeProblemData,
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
    ...notEligibleData,
  },
};

// Mock function to create a basic initial state
function createBasicInitialState(serviceHistory) {
  return {
    featureToggles: {
      loading: false,
      [TOGGLE_NAMES.vetStatusPdfLogging]: true,
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
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
          first: 'John',
          last: 'Doe',
        },
      },
      personalInformation: {
        birthDate: '1986-05-06',
      },
      militaryInformation: {
        serviceHistory,
      },
    },
  };
}

// Function to find the PDF link in the view
function pdfLink(view) {
  return view.container.querySelector(
    'va-link[text="Print your Veteran Status Card (PDF)"]',
  );
}

describe('VeteranStatus', () => {
  let apiRequestStub;
  let generatePdfStub;
  let datadogRumStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
    generatePdfStub = sinon.stub(pdf, 'generatePdf');
    datadogRumStub = sinon.stub(datadogRum, 'addError').callsFake(() => {});
  });

  afterEach(() => {
    apiRequestStub.restore();
    generatePdfStub.restore();
    datadogRumStub.restore();
  });

  // Test case for when the user is eligible for a Veteran Status Card
  describe('when the user is eligible for a Veteran Status Card', () => {
    const initialState = createBasicInitialState(serviceHistoryConfirmed);

    it('should render the loading indicator, heading, description, card and FAQ’s', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      // Check that the loading indicator is rendered
      expect(view.getByTestId('veteran-status-loading-indicator')).to.exist;

      // Check that the heading is rendered
      expect(
        view.getByRole('heading', {
          name: 'Veteran Status Card',
          level: 1,
        }),
      ).to.exist;

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );

        // Check that the description is rendered
        expect(
          view.getByText(
            'This card makes it easy to prove your service and access Veteran discounts, all while keeping your personal information secure.',
          ),
        ).to.exist;

        // Check that the user's full name is rendered on the card
        expect(
          view.getByText(
            `${initialState.vaProfile.hero.userFullName.first} ${
              initialState.vaProfile.hero.userFullName.last
            }`,
          ),
        ).to.exist;

        // Check that the FAQ section is rendered
        expect(view.getByText('Frequently asked questions')).to.exist;
      });

      // Check that the PDF download link exists and can be clicked
      generatePdfStub.resolves();
      expect(pdfLink(view)).to.exist;
      fireEvent.click(pdfLink(view));
      await waitFor(() => {
        expect(generatePdfStub.calledOnce).to.be.true;
      });

      // Check that the PDF download link shows the correct error alert
      generatePdfStub.rejects(new Error('PDF Error'));
      fireEvent.click(pdfLink(view));
      await waitFor(() => {
        expect(
          view.getByText(
            'We’re sorry. Try to print your Veteran Status Card later.',
          ),
        ).to.exist;
        expect(datadogRumStub.called).to.be.true;
      });
    });
  });

  // Test case for when the user is eligible for a Veteran Status Card with reversed service history
  describe('when the user is eligible for a Veteran Status Card and their service history is reversed', () => {
    const initialState = createBasicInitialState(
      serviceHistoryConfirmedReverse,
    );

    it('should render the correct latest service history start and end years', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );

        // Check for the correct lastest service history start and end years
        expect(view.getByText('United States Air Force • 2009–2013')).to.exist;
      });
    });
  });

  // Test case for when the user is not eligible for a Veteran Status Card
  describe('when the user is not eligible for a Veteran Status Card', () => {
    it('should render the LoadFail alert for non-403 service history errors', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState(serviceHistoryNon403Error);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(view.getByText(`This page isn't available right now.`)).to.exist;

        // Check that the description is not rendered
        expect(
          view.queryByText(
            'This card makes it easy to prove your service and access Veteran discounts, all while keeping your personal information secure.',
          ),
        ).to.be.null;

        // Check that the FAQ section is not rendered
        expect(view.queryByText('Frequently asked questions')).to.not.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the NoServiceHistoryAlert alert for 403 service history errors', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState(serviceHistory403Error);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(
          view.getByText(
            `We can’t match your information to any military service records`,
          ),
        ).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the NoServiceHistoryAlert alert when there is no service history', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState(serviceHistoryNone);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(
          view.getByText(
            `We can’t match your information to any military service records`,
          ),
        ).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the SystemErrorAlert alert when an API error occurs', async () => {
      apiRequestStub.rejects(new Error('API Error'));
      const initialState = createBasicInitialState(serviceHistoryConfirmed);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(
          view.getByText(
            `We’re sorry. Try to view your Veteran Status Card later.`,
          ),
        ).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the SystemErrorAlert alert when the user’s name is missing', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState(serviceHistoryConfirmed);
      initialState.vaProfile.hero.userFullName = {
        first: '',
        last: '',
      };
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(
          view.getByText(
            `We’re sorry. Try to view your Veteran Status Card later.`,
          ),
        ).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the NotConfirmedAlert alert when vet status returns a discharge problem', async () => {
      apiRequestStub.resolves(vetStatusDischargeProblem);
      const initialState = createBasicInitialState(serviceHistoryConfirmed);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(view.getByText(dischargeProblemData.title)).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the NotConfirmedAlert alert when there vet status returns not eligible', async () => {
      apiRequestStub.resolves(vetStatusNotEligible);
      const initialState = createBasicInitialState(serviceHistoryConfirmed);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(view.getByText(notEligibleData.title)).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the NotConfirmedAlert alert when service history returns a discharge problem', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState(
        serviceHistoryDischargeProblem,
      );
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(view.getByText(dischargeProblemData.title)).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the NotConfirmedAlert alert when service history returns not eligible', async () => {
      apiRequestStub.resolves(vetStatusConfirmed);
      const initialState = createBasicInitialState(serviceHistoryNotEligible);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(view.getByText(notEligibleData.title)).to.exist;

        // Check that the PDF download link is not rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });
  });

  describe('when latestServiceItem is missing specific data points', () => {
    it('should not break and should render the card with fallback values', async () => {
      const initialState = createBasicInitialState(serviceHistoryConfirmed);
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].beginDate =
        '';
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].endDate =
        '';
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory[0].branchOfService =
        '';
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(view.getByText('Unknown branch of service •')).to.exist;
      });
    });
  });

  describe('vaProfile has no hero.userFullName', () => {
    it('should not break and should render the card with fallback values', async () => {
      const initialState = createBasicInitialState(serviceHistoryConfirmed);
      delete initialState.vaProfile.hero.userFullName;
      apiRequestStub.resolves(vetStatusConfirmed);
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(
          apiRequestStub,
          '/profile/vet_verification_status',
        );
        expect(
          view.getByRole('heading', {
            name: 'Something went wrong',
            level: 2,
          }),
        ).to.exist;
      });
    });
  });

  // Test case for when military information is unavailable due to a maintenance window
  describe('when military information is unavailable due to a maintenance window', () => {
    const initialState = createBasicInitialState(serviceHistoryConfirmed);
    initialState.scheduledDowntime = {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: downtime([externalServices.VAPRO_MILITARY_INFO]),
      dismissedDowntimeWarnings: [],
    };

    it('should render the Downtime Notification alert', () => {
      const view = renderWithProfileReducers(<VeteranStatus />, {
        initialState,
      });
      expect(view.getByText(`This application is down for maintenance`)).to
        .exist;
    });
  });
});
