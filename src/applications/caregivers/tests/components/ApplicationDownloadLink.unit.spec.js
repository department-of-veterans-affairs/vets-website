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
// eslint-disable-next-line import/no-named-as-default-member
import ApplicationDownloadLink from '../../components/ApplicationDownloadLink';

describe('CG <ApplicationDownloadLink>', () => {
  const form = {
    data: { veteranFullName: { first: 'John', last: 'Smith' } },
  };
  const subject = () => render(<ApplicationDownloadLink form={form} />);

  it('has a download file button', () => {
    const { getByText } = subject();
    expect(getByText('Download your completed application')).to.exist;
  });

  context('clicking the download file button', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');

    it('downloads the application pdf', async () => {
      const { queryByText, container } = subject();
      const loadingIndicator = container.querySelector('va-loading-indicator');

      expect(queryByText('Download your completed application')).to.exist;
      expect(loadingIndicator).to.not.exist;

      mockApiRequest({
        blob: new Blob(),
      });

      fireEvent.click(queryByText('Download your completed application'));

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.exist;
      });

      await waitFor(() => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      });

      await waitFor(() => {
        const downloadLink = container.querySelector(
          '.cg-application-download-link',
        );
        expect(downloadLink).to.exist;
        expect(downloadLink).to.have.attr('href', '');
        expect(downloadLink).to.have.attr('download', '10-10CG_John_Smith.pdf');
      });

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'caregivers-10-10cg-pdf-download--success',
          }),
        ).to.be.true;
        recordEventStub.restore();
      });
    });

    it('handles errors', async () => {
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
        recordEventStub.restore();
      });

      await waitFor(() => {
        expect(spy.called).to.be.true;
        spy.restore();
      });

      await waitFor(() => {
        expect(queryByText('Download your completed application')).to.not.exist;
      });
      // TODO: test focus
    });
  });
});

// yarn test:unit src/applications/caregivers/tests/components/ApplicationDownloadLink.unit.spec.js
