import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import * as recordEventModule from '~/platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import sinon from 'sinon';
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
    });
  });

  context('when clicking the download file button', () => {
    const triggerError = ({ container, status }) => {
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(container.querySelector('va-loading-indicator')).to.not.exist;

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

    it('should record success event when button is clicked', async () => {
      const { container } = subject();
      const loadingIndicator = container.querySelector('va-loading-indicator');

      const link = $('va-link', container);
      expect(link).to.exist;
      expect(loadingIndicator).to.not.exist;

      mockApiRequest({
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });

      const createObjectStub = sinon
        .stub(URL, 'createObjectURL')
        .returns('my_stubbed_url.com');
      const revokeObjectStub = sinon.stub(URL, 'revokeObjectURL');

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
      });

      createObjectStub.restore();
      revokeObjectStub.restore();
    });

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
      });
    });

    it('should display `generic` error message when error has status of anything other than `5xx`', async () => {
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
      });
    });
  });
});
