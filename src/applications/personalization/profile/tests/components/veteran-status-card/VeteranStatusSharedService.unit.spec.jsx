import React from 'react';
import { expect } from 'chai';
import * as api from '~/platform/utilities/api';
import * as pdf from '~/platform/pdf';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { addDays, subDays, format } from 'date-fns';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { externalServices } from '~/platform/monitoring/DowntimeNotification';
import { renderWithProfileReducers } from '../../unit-test-helpers';
import VeteranStatusSharedService from '../../../components/veteran-status-card/VeteranStatusSharedService';

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

// Mock API responses for the new shared service endpoint
/* eslint-disable camelcase */
const veteranStatusCardConfirmed = {
  type: 'veteran_status_card',
  veteran_status: 'confirmed',
  service_summary_code: 'A1',
  not_confirmed_reason: null,
  attributes: {
    full_name: 'John Doe',
    disability_rating: 40,
    latest_service: {
      branch: 'Army',
      begin_date: '2009-04-12',
      end_date: '2013-04-11',
    },
    edipi: 1234567890,
  },
};

const veteranStatusAlertWarning = {
  type: 'veteran_status_alert',
  veteran_status: 'not confirmed',
  service_summary_code: 'D',
  not_confirmed_reason: 'PERSON_NOT_FOUND',
  attributes: {
    header: "You're not eligible for a Veteran Status Card",
    body: [
      { type: 'text', value: "Our records don't show you're a Veteran." },
      { type: 'phone', value: '800-698-2411', tty: true },
    ],
    alert_type: 'warning',
  },
};

const veteranStatusAlertError = {
  type: 'veteran_status_alert',
  veteran_status: 'not confirmed',
  service_summary_code: 'VNA',
  not_confirmed_reason: 'ERROR',
  attributes: {
    header: 'Something went wrong',
    body: [
      {
        type: 'text',
        value:
          "We're sorry. We can't access your Veteran status information right now.",
      },
    ],
    alert_type: 'error',
  },
};
/* eslint-enable camelcase */

// Mock function to create a basic initial state
function createBasicInitialState() {
  return {
    featureToggles: {
      loading: false,
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
        edipi: 1234567890,
        veteranStatus: {
          status: 'OK',
        },
      },
    },
    totalRating: {
      totalDisabilityRating: 40,
    },
  };
}

// Function to find the PDF link in the view
function pdfLink(view) {
  return view.container.querySelector(
    'va-link[text="Print your Veteran Status Card (PDF)"]',
  );
}

describe('VeteranStatusSharedService', () => {
  let apiRequestStub;
  let generatePdfStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
    generatePdfStub = sinon.stub(pdf, 'generatePdf');
  });

  afterEach(() => {
    apiRequestStub.restore();
    generatePdfStub.restore();
  });

  describe('when the user is eligible for a Veteran Status Card', () => {
    it('should render the loading indicator, then the card with user data from API', async () => {
      apiRequestStub.resolves(veteranStatusCardConfirmed);
      const initialState = createBasicInitialState();
      const view = renderWithProfileReducers(<VeteranStatusSharedService />, {
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
        sinon.assert.calledWith(apiRequestStub, '/veteran_status_card');

        // Check that the description is rendered
        expect(
          view.getByText(
            'This card makes it easy to prove your service and access Veteran discounts, all while keeping your personal information secure.',
          ),
        ).to.exist;

        // Check that the user's full name from API is rendered on the card
        expect(view.getByText('John Doe')).to.exist;

        // Check that service history is rendered
        expect(view.getByText('United States Army • 2009–2013')).to.exist;

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
    });
  });

  describe('when the user is not eligible for a Veteran Status Card', () => {
    it('should render the DynamicVeteranStatusAlert with warning status', async () => {
      apiRequestStub.resolves(veteranStatusAlertWarning);
      const initialState = createBasicInitialState();
      const view = renderWithProfileReducers(<VeteranStatusSharedService />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(apiRequestStub, '/veteran_status_card');

        // Check that the alert header is rendered
        expect(view.getByText("You're not eligible for a Veteran Status Card"))
          .to.exist;

        // Check that alert body text is rendered
        expect(view.getByText("Our records don't show you're a Veteran.")).to
          .exist;

        // Check that phone number is rendered
        expect(
          view.getByText((content, element) => {
            return (
              element.tagName.toLowerCase() === 'va-telephone' &&
              element.getAttribute('contact') === '800-698-2411'
            );
          }),
        ).to.exist;

        // Check that the FAQ section is still rendered
        expect(view.getByText('Frequently asked questions')).to.exist;

        // Check that the PDF download link is NOT rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the DynamicVeteranStatusAlert with error status', async () => {
      apiRequestStub.resolves(veteranStatusAlertError);
      const initialState = createBasicInitialState();
      const view = renderWithProfileReducers(<VeteranStatusSharedService />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(apiRequestStub, '/veteran_status_card');

        // Check that the alert header is rendered
        expect(view.getByText('Something went wrong')).to.exist;

        // Check that alert body text is rendered
        expect(
          view.getByText(
            "We're sorry. We can't access your Veteran status information right now.",
          ),
        ).to.exist;

        // Check that the PDF download link is NOT rendered
        expect(pdfLink(view)).to.not.exist;
      });
    });

    it('should render the LoadFail alert when an API error occurs', async () => {
      apiRequestStub.rejects(new Error('API Error'));
      const initialState = createBasicInitialState();
      const view = renderWithProfileReducers(<VeteranStatusSharedService />, {
        initialState,
      });

      await waitFor(() => {
        sinon.assert.calledWith(apiRequestStub, '/veteran_status_card');
        expect(view.getByText("This page isn't available right now.")).to.exist;

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
  });

  describe('when military information is unavailable due to a maintenance window', () => {
    it('should render the Downtime Notification alert', () => {
      const initialState = createBasicInitialState();
      initialState.scheduledDowntime = {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: downtime([externalServices.VAPRO_MILITARY_INFO]),
        dismissedDowntimeWarnings: [],
      };

      const view = renderWithProfileReducers(<VeteranStatusSharedService />, {
        initialState,
      });
      expect(view.getByText('This application is down for maintenance')).to
        .exist;
    });
  });

  describe('PDF generation', () => {
    it('should show PDF error alert when PDF generation fails', async () => {
      apiRequestStub.resolves(veteranStatusCardConfirmed);
      const initialState = createBasicInitialState();
      const view = renderWithProfileReducers(<VeteranStatusSharedService />, {
        initialState,
      });

      await waitFor(() => {
        expect(pdfLink(view)).to.exist;
      });

      // Mock PDF generation failure
      generatePdfStub.rejects(new Error('PDF Error'));
      fireEvent.click(pdfLink(view));

      await waitFor(() => {
        expect(
          view.getByText(
            'We’re sorry. Try to print your Veteran Status Card later.',
          ),
        ).to.exist;
      });
    });
  });
});
