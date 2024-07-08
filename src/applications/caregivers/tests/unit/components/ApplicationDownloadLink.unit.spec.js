import React from 'react';
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

describe('CG <ApplicationDownloadLink>', () => {
  const form = {
    data: { veteranFullName: { first: 'John', last: 'Smith' } },
  };
  const subject = () => render(<ApplicationDownloadLink form={form} />);

  it('renders a download file button', () => {
    const { container } = subject();
    const link = $('va-link', container);
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.eq(
      'Download your completed application',
    );
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

    it('displays error message and records error when request fails', async () => {
      const { getByText, container } = subject();
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(container.querySelector('va-loading-indicator')).to.not.exist;

      mockApiRequest({}, false);
      const spy = sinon.spy(Sentry, 'withScope');
      setFetchJSONResponse(
        global.fetch.onCall(0),
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({ errors: [{ status: '503' }] }),
      );

      fireEvent.click(link);

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
        expect($('va-link', container)).to.not.exist;
      });
    });
  });
});
