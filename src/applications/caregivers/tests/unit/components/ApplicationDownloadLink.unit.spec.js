import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
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

  beforeEach(() => {
    localStorage.setItem('csrfToken', 'my-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  context('default behavior', () => {
    it('should render a download file button', () => {
      const { selectors } = subject();
      const { vaAlert, vaLink, vaLoadingIndicator } = selectors();
      expect(vaLink).to.exist;
      expect(vaAlert).to.not.exist;
      expect(vaLoadingIndicator).to.not.exist;
      expect(vaLink).to.have.attr('text', content['button-download']);
    });
  });

  context('when clicking the download file button', () => {
    const triggerError = ({ link, status }) => {
      mockApiRequest({}, false);
      setFetchJSONResponse(
        global.fetch.onCall(0),
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({ errors: [{ status }] }),
      );
      fireEvent.click(link);
    };
    let recordEventStub;

    beforeEach(() => {
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      recordEventStub.restore();
    });

    it('should record `success` event when button is clicked', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      const createObjectStub = sinon
        .stub(URL, 'createObjectURL')
        .returns('my_stubbed_url.com');
      const revokeObjectStub = sinon.stub(URL, 'revokeObjectURL');

      mockApiRequest({
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
        const event = 'caregivers-10-10cg-pdf-download--success';

        expect(recordEventStub.calledWith({ event })).to.be.true;
        expect(vaLoadingIndicator).to.not.exist;
        expect(vaLink).to.exist;
      });

      createObjectStub.restore();
      revokeObjectStub.restore();
    });

    it('should record `error` event when the request fails', async () => {
      const sentrySpy = sinon.spy(Sentry, 'withScope');
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      triggerError({ link, status: '503' });

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });

      await waitFor(() => {
        const { vaLink, vaLoadingIndicator } = selectors();
        const event = 'caregivers-10-10cg-pdf--failure';

        expect(recordEventStub.calledWith({ event })).to.be.true;
        expect(sentrySpy.called).to.be.true;

        expect(vaLoadingIndicator).to.not.exist;
        expect(vaLink).to.not.exist;
      });

      sentrySpy.restore();
    });

    it('should display `downtime` error message when error has status of `5xx`', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
      triggerError({ link, status: '503' });

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
