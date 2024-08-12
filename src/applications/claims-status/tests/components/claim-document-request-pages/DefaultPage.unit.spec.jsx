import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import moment from 'moment-timezone';
import { renderWithRouter } from '../../utils';
import { buildDateFormatter, scrubDescription } from '../../../utils/helpers';

import DefaultPage from '../../../components/claim-document-request-pages/DefaultPage';

const getStore = (cstUseClaimDetailsV2Enabled = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
    },
  }));
const formatDate = buildDateFormatter();

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

  context('cstUseClaimDetailsV2 feature toggle false', () => {
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
        suspenseDate: '2024-04-07',
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
      expect($('.add-files-form', container)).to.not.exist;
      expect($('.due-date-header', container)).to.exist;
      const formattedClaimDate = formatDate(item.suspenseDate);
      getByText(
        `Needed from you by ${formattedClaimDate} - Due ${moment(
          item.suspenseDate,
        ).fromNow()}`,
      );
      expect($('.optional-upload', container)).to.not.exist;
      getByText('Request for Submit buddy statement(s)');
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
        suspenseDate: '2024-04-07',
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
      expect($('.add-files-form', container)).to.not.exist;
      expect($('.due-date-header', container)).to.not.exist;
      expect($('.optional-upload', container)).to.exist;
      getByText(
        '- We’ve asked others to send this to us, but you may upload it if you have it.',
      );
      getByText('Request for Submit buddy statement(s)');
      getByText(scrubDescription(item.description));
      expect($('va-additional-info', container)).to.exist;
      expect($('va-file-input', container)).to.exist;
    });
  });

  context('cstUseClaimDetailsV2 feature toggle true', () => {
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
        suspenseDate: '2024-04-07',
        uploadsAllowed: true,
        documents: '[]',
        date: '2024-03-07',
      };
      const { getByText, container } = renderWithRouter(
        <Provider store={getStore(true)}>
          <DefaultPage {...defaultProps} item={item} />,
        </Provider>,
      );
      expect($('#default-page', container)).to.exist;
      expect($('.add-files-form', container)).to.exist;
      expect($('.due-date-header', container)).to.exist;
      const formattedClaimDate = formatDate(item.suspenseDate);
      getByText(
        `Needed from you by ${formattedClaimDate} - Due ${moment(
          item.suspenseDate,
        ).fromNow()}`,
      );
      expect($('.optional-upload', container)).to.not.exist;
      getByText('Request for Submit buddy statement(s)');
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
        suspenseDate: '2024-04-07',
        uploadsAllowed: true,
        documents: '[]',
        date: '2024-03-07',
      };
      const { getByText, container } = renderWithRouter(
        <Provider store={getStore(true)}>
          <DefaultPage {...defaultProps} item={item} />,
        </Provider>,
      );
      expect($('#default-page', container)).to.exist;
      expect($('.add-files-form', container)).to.exist;
      expect($('.due-date-header', container)).to.not.exist;
      expect($('.optional-upload', container)).to.exist;
      getByText(
        '- We’ve asked others to send this to us, but you may upload it if you have it.',
      );
      getByText('Request for Submit buddy statement(s)');
      getByText(scrubDescription(item.description));
      expect($('va-additional-info', container)).to.exist;
      expect($('va-file-input', container)).to.exist;
    });
  });
});
