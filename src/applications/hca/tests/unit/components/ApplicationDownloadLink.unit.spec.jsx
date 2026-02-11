import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import ApplicationDownloadLink from '../../../components/ApplicationDownloadLink';
import content from '../../../locales/en/content.json';

describe('hca <ApplicationDownloadLink>', () => {
  const subject = ({ veteranInformation } = {}) => {
    const expectedVeteranInformation = veteranInformation ?? {
      veteranFullName: { first: 'John', last: 'Smith' },
    };

    const mockStore = {
      getState: () => ({
        form: {
          data: {
            'view:veteranInformation': expectedVeteranInformation,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ApplicationDownloadLink formConfig={{}} />
      </Provider>,
    );
    const selectors = () => ({
      vaAlert: container.querySelector('va-alert'),
      vaLink: container.querySelector('va-link'),
      vaLoadingIndicator: container.querySelector('va-loading-indicator'),
    });
    return { selectors };
  };
  let apiRequestStub;
  let recordEventStub;

  beforeEach(() => {
    localStorage.setItem('csrfToken', 'my-token');
    apiRequestStub = sinon.stub(api, 'apiRequest');
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    localStorage.clear();
    apiRequestStub.restore();
    recordEventStub.restore();
  });

  context('default behavior', () => {
    it('should render a download file button', () => {
      const { selectors } = subject();
      const { vaAlert, vaLink, vaLoadingIndicator } = selectors();
      expect(vaLink).to.exist;
      expect(vaAlert).to.not.exist;
      expect(vaLoadingIndicator).to.not.exist;
    });
  });

  context('when the download button has been clicked', () => {
    const triggerError = ({ link, status = '503' }) => {
      apiRequestStub.onFirstCall().resolves({
        ok: false,
        status,
        json: async () => ({
          errors: [{ status }],
        }),
      });
      fireEvent.click(link);
    };

    const triggerSuccess = ({ link }) => {
      apiRequestStub.onFirstCall().resolves({
        ok: true,
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });
      fireEvent.click(link);
    };

    context('on success', () => {
      const createStubObject = () =>
        sinon.stub(URL, 'createObjectURL').returns('my_stubbed_url.com');
      const revokeObjectstub = () => sinon.stub(URL, 'revokeObjectURL');

      it('should record the correct event when the request succeeds', async () => {
        const { selectors } = subject();
        const { vaLink: link } = selectors();
        const createObjectStub = createStubObject();
        const revokeObjectStub = revokeObjectstub();

        triggerSuccess({ link });

        await waitFor(() => {
          const { vaLink, vaLoadingIndicator } = selectors();
          expect(vaLoadingIndicator).to.exist;
          expect(vaLink).to.not.exist;
        });

        await waitFor(() => {
          const { vaLink, vaLoadingIndicator } = selectors();

          const event = 'hca-pdf-download--success';
          expect(recordEventStub.calledWith({ event })).to.be.true;

          expect(vaLoadingIndicator).to.not.exist;
          expect(vaLink).to.exist;
        });

        createObjectStub.restore();
        revokeObjectStub.restore();
      });

      it('should still succeed when no veteranInformation is set', async () => {
        const { selectors } = subject({ veteranInformation: {} });
        const { vaLink: link } = selectors();
        const createObjectStub = createStubObject();
        const revokeObjectStub = revokeObjectstub();

        triggerSuccess({ link });

        await waitFor(() => {
          const { vaLink, vaLoadingIndicator } = selectors();
          expect(vaLoadingIndicator).to.exist;
          expect(vaLink).to.not.exist;
        });

        await waitFor(() => {
          const { vaLink, vaLoadingIndicator } = selectors();

          const event = 'hca-pdf-download--success';
          expect(recordEventStub.calledWith({ event })).to.be.true;

          expect(vaLoadingIndicator).to.not.exist;
          expect(vaLink).to.exist;
        });

        createObjectStub.restore();
        revokeObjectStub.restore();
      });
    });

    context('on error', () => {
      it('should display `generic` error message when response is an error', async () => {
        const { selectors } = subject();
        const { vaLink: link } = selectors();
        triggerError({ link, status: '403' });

        await waitFor(() => {
          const { vaLoadingIndicator } = selectors();
          expect(vaLoadingIndicator).to.exist;
        });

        await waitFor(() => {
          const { vaAlert, vaLink, vaLoadingIndicator } = selectors();
          const error = content['alert-download-message--generic'];

          expect(vaLoadingIndicator).to.not.exist;
          expect(vaLink).to.exist;

          expect(vaAlert).to.exist;
          expect(vaAlert).to.contain.text(error);

          const event = 'hca-pdf-download--failure';
          expect(recordEventStub.calledWith({ event })).to.be.true;
        });
      });

      // Stub createObjectURL to throw an error to simulate a failure in PDF handling
      it('should display `generic` error message when any other error occurs not in the request response', async () => {
        const createObjectStub = sinon
          .stub(URL, 'createObjectURL')
          .throws(new Error('createObjectURL failed'));

        const { selectors } = subject();
        const { vaLink: link } = selectors();

        triggerSuccess({ link });

        await waitFor(() => {
          const { vaAlert, vaLink, vaLoadingIndicator } = selectors();
          const error = content['alert-download-message--generic'];

          expect(vaLoadingIndicator).to.not.exist;
          expect(vaLink).to.exist;

          expect(vaAlert).to.exist;
          expect(vaAlert).to.contain.text(error);

          const event = 'hca-pdf-download--failure';
          expect(recordEventStub.calledWith({ event })).to.be.true;
        });

        createObjectStub.restore();
      });
    });
  });
});
