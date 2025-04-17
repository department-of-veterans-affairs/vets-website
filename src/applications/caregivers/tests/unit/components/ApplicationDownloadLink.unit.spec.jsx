import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import ApplicationDownloadLink from '../../../components/ApplicationDownloadLink';
import content from '../../../locales/en/content.json';

describe('CG <ApplicationDownloadLink>', () => {
  const subject = () => {
    const mockStore = {
      getState: () => ({
        form: {
          data: { veteranFullName: { first: 'John', last: 'Smith' } },
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
      apiRequestStub.onFirstCall().rejects({ errors: [{ status }] });
      fireEvent.click(link);
    };

    it('should record the correct event when the request succeeds', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      const createObjectStub = sinon
        .stub(URL, 'createObjectURL')
        .returns('my_stubbed_url.com');
      const revokeObjectStub = sinon.stub(URL, 'revokeObjectURL');

      apiRequestStub.onFirstCall().resolves({
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });
      fireEvent.click(link);

      await waitFor(() => {
        const { vaLink, vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
        expect(vaLink).to.not.exist;
      });

      await waitFor(() => {
        const { vaLink, vaLoadingIndicator } = selectors();
        const event = 'caregivers-pdf-download--success';

        expect(recordEventStub.calledWith({ event })).to.be.true;
        expect(vaLoadingIndicator).to.not.exist;
        expect(vaLink).to.exist;
      });

      createObjectStub.restore();
      revokeObjectStub.restore();
    });

    it('should record the correct event when the request fails', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      triggerError({ link });

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });

      await waitFor(() => {
        const { vaLink, vaLoadingIndicator } = selectors();
        const event = 'caregivers-pdf-download--failure';

        expect(recordEventStub.calledWith({ event })).to.be.true;
        expect(vaLoadingIndicator).to.not.exist;
        expect(vaLink).to.not.exist;
      });
    });

    it('should display `downtime` error message when error has status of `5xx`', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      triggerError({ link });

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });

      await waitFor(() => {
        const { vaAlert, vaLink, vaLoadingIndicator } = selectors();
        const error = content['alert-download-message--500'];

        expect(vaLoadingIndicator).to.not.exist;
        expect(vaLink).to.not.exist;

        expect(vaAlert).to.exist;
        expect(vaAlert).to.contain.text(error);
      });
    });

    it('should display `generic` error message when error has status of anything other than `5xx`', async () => {
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
        expect(vaLink).to.not.exist;

        expect(vaAlert).to.exist;
        expect(vaAlert).to.contain.text(error);
      });
    });
  });
});
