import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import * as recordEventModule from '~/platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';

import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import sinon from 'sinon';
import ApplicationDownloadLink from '../../components/ApplicationDownloadLink';

describe('CG <ApplicationDownloadLink>', () => {
  const form = {
    data: { veteranFullName: { first: 'John', last: 'Smith' } },
  };
  const subject = () => render(<ApplicationDownloadLink form={form} />);

  it('renders a download file button', () => {
    const { getByText } = subject();
    expect(getByText('Download your completed application')).to.exist;
  });

  context('clicking the download file button', () => {
    let recordEventStub;

    beforeEach(() => {
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      recordEventStub.restore();
    });

    it('records pdf-download-success when button is clicked', async () => {
      const { queryByText, container } = subject();
      const loadingIndicator = container.querySelector('va-loading-indicator');

      expect(queryByText('Download your completed application')).to.exist;
      expect(loadingIndicator).to.not.exist;

      mockApiRequest({
        blob: () => new Blob(['my blob'], { type: 'application/pdf' }),
      });

      const createObjectStub = sinon
        .stub(URL, 'createObjectURL')
        .returns('my_stubbed_url.com');
      const revokeObjectStub = sinon.stub(URL, 'revokeObjectURL');

      fireEvent.click(queryByText('Download your completed application'));

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.exist;
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
      });

      createObjectStub.restore();
      revokeObjectStub.restore();
    });

    it('displays error message and records error when request fails', async () => {
      const { queryByText, getByText, container } = subject();

      expect(queryByText('Download your completed application')).to.exist;
      expect(container.querySelector('va-loading-indicator')).to.not.exist;

      mockApiRequest({}, false);
      const spy = sinon.spy(Sentry, 'withScope');
      setFetchJSONResponse(
        global.fetch.onCall(0),
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({ errors: [{ status: '503' }] }),
      );

      fireEvent.click(queryByText('Download your completed application'));

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.exist;
      });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      await waitFor(() => {
        expect(getByText('Something went wrong')).to.exist;
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
        expect(queryByText('Download your completed application')).to.not.exist;
      });
    });
  });
});
