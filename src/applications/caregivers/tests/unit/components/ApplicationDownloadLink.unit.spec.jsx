import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import ApplicationDownloadLink from '../../../components/ApplicationDownloadLink';
import content from '../../../locales/en/content.json';

describe('CG <ApplicationDownloadLink>', () => {
  const mockStore = {
    getState: () => ({
      form: {
        data: { veteranFullName: { first: 'John', last: 'Smith' } },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const subject = () => {
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

  context('when the download button has been clicked', () => {
    const createStubObject = () =>
      sinon.stub(URL, 'createObjectURL').returns('my_stubbed_url.com');
    const revokeObjectstub = () => sinon.stub(URL, 'revokeObjectURL');

    const triggerError = ({ link, status = '503' }) => {
      apiRequestStub.rejects({ errors: [{ status }] });
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
      it('should record the correct event when the request succeeds', async () => {
        const { selectors } = subject();
        const { vaLink: link } = selectors();
        const createObjectStub = createStubObject();
        const revokeObjectStub = revokeObjectstub();

        triggerSuccess({ link });

        await waitFor(() => {
          const { vaLoadingIndicator } = selectors();
          expect(vaLoadingIndicator).to.exist;
        });
        await waitFor(() => {
          const { vaLink } = selectors();
          expect(vaLink).to.exist;
        });

        expect(
          recordEventStub.calledWith({
            event: 'caregivers-pdf-download--success',
          }),
        ).to.be.true;

        createObjectStub.restore();
        revokeObjectStub.restore();
      });
    });

    context('on error', () => {
      it('should display `generic` error message when response is an error', async () => {
        const { selectors } = subject();
        const { vaLink: link } = selectors();
        const event = 'caregivers-pdf-download--failure';

        triggerError({ link });

        await waitFor(() => {
          const { vaLoadingIndicator } = selectors();
          expect(vaLoadingIndicator).to.exist;
        });
        await waitFor(() => {
          const { vaAlert } = selectors();
          expect(vaAlert).to.exist;
          expect(vaAlert).to.contain.text(
            content['alert-download-message--generic'],
          );
        });

        sinon.assert.calledWithExactly(recordEventStub, { event });
      });

      // createObjectURL is not stubbed so it throws error
      it('should display `generic` error message when any other error occurs not in the request response', async () => {
        const { selectors } = subject();
        const { vaLink: link } = selectors();

        triggerSuccess({ link });

        await waitFor(() => {
          const { vaAlert, vaLink, vaLoadingIndicator } = selectors();

          expect(vaLoadingIndicator).to.not.exist;
          expect(vaLink).to.not.exist;

          expect(vaAlert).to.exist;
          expect(vaAlert).to.contain.text(
            content['alert-download-message--generic'],
          );

          const event = 'caregivers-pdf-download--failure';
          expect(recordEventStub.calledWith({ event })).to.be.true;
        });
      });
    });
  });
});
