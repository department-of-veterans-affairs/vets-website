import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import * as recordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
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
    sinon.stub(URL, 'createObjectURL').returns('my_stubbed_url.com');
    sinon.stub(URL, 'revokeObjectURL');
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
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
      apiRequestStub.rejects({ errors: [{ status }] });
      fireEvent.click(link);
    };

    it('should record the correct event when the request succeeds', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      const event = 'caregivers-pdf-download--success';

      apiRequestStub.resolves({
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });
      fireEvent.click(link);

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });
      await waitFor(() => {
        const { vaLink } = selectors();
        expect(vaLink).to.exist;
      });

      sinon.assert.calledWithExactly(recordEventStub, { event });
    });

    it('should record the correct event when the request fails', async () => {
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
      });

      sinon.assert.calledWithExactly(recordEventStub, { event });
    });

    it('should display `downtime` error message when error has status of `5xx`', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      const error = content['alert-download-message--500'];

      triggerError({ link });

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });

      await waitFor(() => {
        const { vaAlert } = selectors();
        expect(vaAlert).to.exist;
        expect(vaAlert).to.contain.text(error);
      });
    });

    it('should display `generic` error message when error has status of anything other than `5xx`', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      const error = content['alert-download-message--generic'];

      triggerError({ link, status: '403' });

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });
      await waitFor(() => {
        const { vaAlert } = selectors();
        expect(vaAlert).to.exist;
        expect(vaAlert).to.contain.text(error);
      });
    });
  });
});
