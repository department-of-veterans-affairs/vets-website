import React from 'react';
import { expect } from 'chai';
import {
  formatDistanceToNowStrict,
  subMonths,
  format,
  parseISO,
} from 'date-fns';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderWithRouter } from '../../utils';
import { buildDateFormatter, scrubDescription } from '../../../utils/helpers';

import DefaultPage from '../../../components/claim-document-request-pages/DefaultPage';

const formatDate = buildDateFormatter();

// test data for date that is 9 months ago
const today = new Date();
const nineMonthsAgoDate = subMonths(today, 9);
const nineMonthsAgoSuspenseDate = format(nineMonthsAgoDate, 'yyyy-MM-dd');

describe('<DefaultPage>', () => {
  const defaultProps = {
    field: { value: '', dirty: false },
    files: [],
    onAddFile: () => {},
    onCancel: () => {},
    onDirtyFields: () => {},
    onFieldChange: () => {},
    onRemoveFile: () => {},
    onSubmit: () => {},
    backUrl: '',
    progress: 0,
    uploading: false,
  };

  const getStore = (cstFriendlyEvidenceRequests = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_friendly_evidence_requests: cstFriendlyEvidenceRequests,
      },
    }));

  context('when cstFriendlyEvidenceRequests is true', () => {
    it('should redner updated UI', () => {
      const item = {
        closedDate: null,
        canUploadFile: true,
        description: 'Buddy statement text',
        displayName: 'Submit buddy statement(s)',
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-07',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: nineMonthsAgoSuspenseDate,
        uploadsAllowed: true,
        documents: '[]',
        date: '2024-03-07',
      };
      const { getByText, container } = renderWithRouter(
        <Provider store={getStore()}>
          <DefaultPage {...defaultProps} item={item} />,
        </Provider>,
      );
      expect($('#default-page', container)).to.exist;
      expect($('.add-files-form', container)).to.exist;
      const formattedClaimDate = formatDate(item.suspenseDate);
      getByText(`Respond by ${formattedClaimDate}`);
      getByText('What we need from you');
      getByText('Learn about this request in your claim letter');
      expect($('va-link', container)).to.exist;
      expect($('.optional-upload', container)).to.not.exist;
      getByText('Submit buddy statement(s)');
      getByText(scrubDescription(item.description));
      expect($('va-additional-info', container)).to.exist;
      expect($('va-file-input', container)).to.exist;
    });
    it('should redner update 21-4142 information', () => {
      const item = {
        closedDate: null,
        description: '21-4142 text',
        displayName: '21-4142/21-4142a',
        friendlyName: 'Authorization to Disclose Information',
        friendlyDescription: 'good description',
        canUploadFile: true,
        supportAliases: ['VA Form 21-4142'],
        id: 14268,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-07',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: nineMonthsAgoSuspenseDate,
        uploadsAllowed: true,
        documents: '[]',
        date: '2024-03-07',
      };
      const { getByText, container } = renderWithRouter(
        <Provider store={getStore()}>
          <DefaultPage {...defaultProps} item={item} />,
        </Provider>,
      );
      expect($('#default-page', container)).to.exist;
      expect($('.add-files-form', container)).to.exist;
      const formattedClaimDate = formatDate(item.suspenseDate);
      getByText('Authorization to Disclose Information');
      getByText(`Respond by ${formattedClaimDate}`);
      getByText('What we need from you');
      getByText('Learn about this request in your claim letter');
      getByText('Next Steps');
      expect($('va-link', container)).to.exist;
      expect($('.optional-upload', container)).to.not.exist;
      expect($('va-additional-info', container)).to.exist;
      expect($('va-file-input', container)).to.exist;
    });
  });

  it('should render component when status is NEEDED_FROM_YOU', () => {
    const item = {
      closedDate: null,
      description: 'Buddy statement text',
      displayName: 'Submit buddy statement(s)',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: nineMonthsAgoSuspenseDate,
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };

    const monthsDue = formatDistanceToNowStrict(
      parseISO(nineMonthsAgoSuspenseDate),
    );

    const { getByText, container } = renderWithRouter(
      <Provider store={getStore(false)}>
        <DefaultPage {...defaultProps} item={item} />
      </Provider>,
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    expect($('.due-date-header', container)).to.exist;
    const formattedClaimDate = formatDate(item.suspenseDate);
    getByText(
      `Needed from you by ${formattedClaimDate} - Due ${monthsDue} ago`,
    );
    expect($('.optional-upload', container)).to.not.exist;
    getByText('Submit buddy statement(s)');
    getByText(scrubDescription(item.description));
    expect($('va-additional-info', container)).to.exist;
    expect($('va-file-input', container)).to.exist;
  });

  it('should render component when status is NEEDED_FROM_OTHERS', () => {
    const item = {
      closedDate: null,
      description: 'Buddy statement text',
      displayName: 'Submit buddy statement(s)',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_OTHERS',
      suspenseDate: nineMonthsAgoSuspenseDate,
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };
    const { getByText, container } = renderWithRouter(
      <Provider store={getStore(false)}>
        <DefaultPage {...defaultProps} item={item} />
      </Provider>,
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    expect($('.due-date-header', container)).to.not.exist;
    expect($('.optional-upload', container)).to.exist;
    getByText(
      '- We’ve asked others to send this to us, but you may upload it if you have it.',
    );
    getByText('Submit buddy statement(s)');
    getByText(scrubDescription(item.description));
    expect($('va-additional-info', container)).to.exist;
    expect($('va-file-input', container)).to.exist;
  });
});
