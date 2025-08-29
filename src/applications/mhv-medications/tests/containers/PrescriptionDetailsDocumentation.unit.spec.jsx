import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import { prescriptionsApi } from '../../api/prescriptionsApi';
import { allergiesApi } from '../../api/allergiesApi';
import {
  stubAllergiesApi,
  stubPrescriptionIdApi,
  stubPrescriptionDocumentationQuery,
} from '../testing-utils';
import reducer from '../../reducers';
import rxDetailsResponse from '../fixtures/prescriptionDetails.json';
import PrescriptionDetailsDocumentation from '../../containers/PrescriptionDetailsDocumentation';

let sandbox;

describe('Prescription details documentation container', () => {
  const initialState = {
    user: {
      profile: {
        userFullName: { first: 'test', last: 'last', suffix: 'jr' },
        dob: '2000-01-01',
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medications_display_documentation_content: true,
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouterV6(
      <Routes>
        <Route
          path="/prescriptions/:prescriptionId/documentation"
          element={<PrescriptionDetailsDocumentation />}
        />
      </Routes>,
      {
        initialState: state,
        reducers: reducer,
        initialEntries: ['/prescriptions/23991135/documentation'],
        additionalMiddlewares: [
          allergiesApi.middleware,
          prescriptionsApi.middleware,
        ],
      },
    );
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubAllergiesApi({ sandbox });
    const data = JSON.parse(JSON.stringify(rxDetailsResponse.data.attributes));
    data.rxRfRecords = [{ cmopNdcNumber: '00093314705' }];
    stubPrescriptionIdApi({ sandbox, data });
    stubPrescriptionDocumentationQuery({ sandbox });
  });

  afterEach(async () => {
    cleanup();
    await sandbox.restore();
  });

  it('renders without errors', async () => {
    const screen = setup();
    await waitFor(() => {
      expect(screen).to.exist;
    });
  });

  it('should display loading message when loading specific rx documentation', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionIdApi({ sandbox });
    stubPrescriptionDocumentationQuery({
      sandbox,
      isLoading: true,
      data: null,
    });
    const screen = setup();
    await waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).to.exist;
      expect(screen.getByTestId('loading-indicator')).to.have.attribute(
        'message',
        'Loading information...',
      );
    });
  });

  it('Content should exist after receiving information from API', async () => {
    const screen = setup();
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
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionIdApi({ sandbox });
    stubPrescriptionDocumentationQuery({
      sandbox,
      data: null,
    });
    const screen = setup();
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
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionIdApi({ sandbox });
    stubPrescriptionDocumentationQuery({
      sandbox,
      error: true,
    });
    const screen = setup();
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

  describe('PrescriptionDetailsDocumentation', () => {
    beforeEach(() => {
      HTMLAnchorElement.prototype.click = sinon.spy();
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
        revokeObjectURL: sinon.spy(),
      };
      window.location = { assign: sinon.spy() };

      if (!global.navigator) global.navigator = {};
      global.navigator.onLine = true;
    });

    it('should call downloadFile with TXT format and generate TXT file', async () => {
      const screen = setup();

      await waitFor(() => {
        const downloadTxtBtn = screen.getByTestId('download-txt-button');
        expect(downloadTxtBtn).to.exist;
        downloadTxtBtn.click();
        expect(screen.getByText('Download started')).to.exist;
      });
    });

    it.skip('should call downloadFile with PDF format and generate PDF file', async () => {
      const screen = setup();

      await waitFor(
        () => {
          const downloadPdfBtn = screen.getByTestId('download-pdf-button');
          expect(downloadPdfBtn).to.exist;
          downloadPdfBtn.click();
          expect(screen.getByText('Download started')).to.exist;
        },
        { timeout: 3000 },
      );
    });
  });
});
