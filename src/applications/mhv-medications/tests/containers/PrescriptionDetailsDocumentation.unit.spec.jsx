import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  resetFetch,
  mockApiRequest,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../../reducers';
import rxDetailsResponse from '../fixtures/prescriptionDetails.json';
import PrescriptionDetailsDocumentation from '../../containers/PrescriptionDetailsDocumentation';
import medicationInformation from '../fixtures/medicationInformation.json';
import medicationInformationEmpty from '../fixtures/medicationInformationEmpty.json';

describe('Prescription details documentation container', () => {
  const initialState = {
    user: {
      profile: {
        userFullName: { first: 'test', last: 'last', suffix: 'jr' },
        dob: 'January, 01, 2000',
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
    rx: {
      prescriptions: {
        prescriptionDetails: {
          ...rxDetailsResponse.data.attributes,
          rxRfRecords: [
            {
              cmopNdcNumber: '00093314705',
            },
          ],
        },
        apiError: false,
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medications_display_documentation_content: true,
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<PrescriptionDetailsDocumentation />, {
      initialState: state,
      reducers: reducer,
      path: 'prescription/23991135/documentation',
    });
  };

  const setupWithReactRouter = () => {
    const store = createStore(() => initialState);
    return render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/prescriptions/1234567891/documentation']}
        >
          <Route path="/prescriptions/:prescriptionId/documentation">
            <PrescriptionDetailsDocumentation />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
  };

  afterEach(() => {
    resetFetch();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display loading message when loading specific rx documentation', async () => {
    const screen = setup();
    waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).to.exist;
      expect(screen.getByText('Loading information...')).to.exist;
    });
  });

  it('Content should exist after receiving information from API', async () => {
    mockApiRequest(medicationInformation);
    const screen = setupWithReactRouter();
    await waitFor(() => {
      const title = screen.getByTestId('medication-information-title');
      const warning = screen.getByTestId('medication-information-warning');
      const printBtn = screen.getByTestId('print-records-button');
      const downloadPdfBtn = screen.getByTestId('download-pdf-button');
      const noInfoAlert = screen.queryByTestId(
        'medication-information-no-info',
      );
      const errorAlert = screen.queryByText(
        'We can’t access your medication information right now',
      );
      expect(title).to.exist;
      expect(title).to.have.text(
        'Medication information: ONDANSETRON 8 MG TAB',
      );
      expect(warning).to.exist;
      expect(warning).to.include.text(
        'We’re providing this content from our trusted health care information partner, WebMD, to help you learn more about the medications you’re taking. WebMD content is reviewed and approved by medical experts. But this content isn’t directly reviewed by VA health care providers and isn’t personalized to your use of the medications. If you have any questions about your medications and your specific needs, ask your VA health care team.',
      );
      expect(printBtn).to.exist;
      expect(downloadPdfBtn).to.exist;
      expect(noInfoAlert).to.not.exist;
      expect(errorAlert).to.not.exist;
    });
  });

  it('Certain content should not exist after receiving no information from API', async () => {
    mockApiRequest(medicationInformationEmpty);
    const screen = setupWithReactRouter();
    await waitFor(() => {
      const title = screen.queryByTestId('medication-information-title');
      const warning = screen.queryByTestId('medication-information-warning');
      const printBtn = screen.queryByTestId('print-records-button');
      const downloadPdfBtn = screen.queryByTestId('download-pdf-button');
      const noInfoAlert = screen.queryByTestId(
        'medication-information-no-info',
      );
      const errorAlert = screen.queryByText(
        'We can’t access your medication information right now',
      );
      expect(title).to.exist;
      expect(title).to.have.text('Medication information');
      expect(warning).to.not.exist;
      expect(printBtn).to.not.exist;
      expect(downloadPdfBtn).to.not.exist;
      expect(noInfoAlert).to.exist;
      expect(noInfoAlert).to.include.text(
        `We’re sorry. We don’t have any information about this medication.`,
      );
      expect(errorAlert).to.not.exist;
    });
  });

  it('Certain content should not exist after receiving error from API', async () => {
    mockApiRequest(null, false);
    const screen = setupWithReactRouter();
    await waitFor(() => {
      const title = screen.queryByTestId('medication-information-title');
      const warning = screen.queryByTestId('medication-information-warning');
      const printBtn = screen.queryByTestId('print-records-button');
      const downloadPdfBtn = screen.queryByTestId('download-pdf-button');
      const noInfoAlert = screen.queryByTestId(
        'medication-information-no-info',
      );
      const errorAlert = screen.queryByText(
        'We can’t access your medication information right now',
      );
      expect(title).to.exist;
      expect(title).to.have.text('Medication information');
      expect(warning).to.not.exist;
      expect(printBtn).to.not.exist;
      expect(downloadPdfBtn).to.not.exist;
      expect(noInfoAlert).to.not.exist;
      expect(errorAlert).to.exist;
    });
  });
});
