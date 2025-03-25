import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
<<<<<<< HEAD

=======
>>>>>>> main
import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import * as recordEventModule from 'platform/monitoring/record-event';
<<<<<<< HEAD
import { $ } from 'platform/forms-system/src/js/utilities/ui';

=======
>>>>>>> main
import ApplicationDownloadLink from '../../../components/ApplicationDownloadLink';
import content from '../../../locales/en/content.json';

describe('CG <ApplicationDownloadLink>', () => {
<<<<<<< HEAD
  const mockStore = {
    getState: () => ({
      form: {
        data: { veteranFullName: { first: 'John', last: 'Smith' } },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const subject = () =>
    render(
      <Provider store={mockStore}>
        <ApplicationDownloadLink />
      </Provider>,
    );

  context('default behavior', () => {
    it('should render a download file button', () => {
      const { container } = subject();
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(link).to.have.attr('text', content['button-download']);
=======
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
>>>>>>> main
    });
  });

  context('when clicking the download file button', () => {
<<<<<<< HEAD
    const triggerError = ({ container, status }) => {
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(container.querySelector('va-loading-indicator')).to.not.exist;

      mockApiRequest({}, false);

=======
    const triggerError = ({ link, status }) => {
      mockApiRequest({}, false);
>>>>>>> main
      setFetchJSONResponse(
        global.fetch.onCall(0),
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({ errors: [{ status }] }),
      );
<<<<<<< HEAD

=======
>>>>>>> main
      fireEvent.click(link);
    };
    let recordEventStub;

    beforeEach(() => {
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      recordEventStub.restore();
    });

<<<<<<< HEAD
    it('should record success event when button is clicked', async () => {
      const { container } = subject();
      const loadingIndicator = container.querySelector('va-loading-indicator');

      const link = $('va-link', container);
      expect(link).to.exist;
      expect(loadingIndicator).to.not.exist;

      mockApiRequest({
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });

=======
    it('should record `success` event when button is clicked', async () => {
      const { selectors } = subject();
      const { vaLink: link } = selectors();
>>>>>>> main
      const createObjectStub = sinon
        .stub(URL, 'createObjectURL')
        .returns('my_stubbed_url.com');
      const revokeObjectStub = sinon.stub(URL, 'revokeObjectURL');

<<<<<<< HEAD
      fireEvent.click(link);

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.exist;
        expect($('va-link', container)).to.not.exist;
      });

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'caregivers-10-10cg-pdf-download--success',
          }),
        ).to.be.true;
      });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
        expect($('va-link', container)).to.exist;
=======
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
>>>>>>> main
      });

      createObjectStub.restore();
      revokeObjectStub.restore();
    });

<<<<<<< HEAD
    it('should record error event when the request fails', async () => {
      const spy = sinon.spy(Sentry, 'withScope');
      const { container } = subject();
      triggerError({ container, status: '503' });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.exist;
      });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'caregivers-10-10cg-pdf--failure',
          }),
        ).to.be.true;
      });

      await waitFor(() => {
        expect(spy.called).to.be.true;
        spy.restore();
      });

      await waitFor(() => {
        expect($('va-link', container)).to.not.exist;
      });
    });

    it('should display `downtime` error message when error has status of `5xx`', async () => {
      const { getByText, container } = subject();
      triggerError({ container, status: '503' });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.exist;
      });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      await waitFor(() => {
        expect(getByText(content['alert-heading--generic'])).to.exist;
        expect(getByText(content['alert-download-message--500'])).to.exist;
      });

      await waitFor(() => {
        expect($('va-link', container)).to.not.exist;
=======
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
        const event = 'caregivers-10-10cg-pdf-download--failure';

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
>>>>>>> main
      });
    });

    it('should display `generic` error message when error has status of anything other than `5xx`', async () => {
<<<<<<< HEAD
      const { getByText, container } = subject();
      triggerError({ container, status: '403' });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.exist;
      });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      await waitFor(() => {
        expect(getByText(content['alert-heading--generic'])).to.exist;
        expect(getByText(content['alert-download-message--generic'])).to.exist;
      });

      await waitFor(() => {
        expect($('va-link', container)).to.not.exist;
=======
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
>>>>>>> main
      });
    });
  });
});
