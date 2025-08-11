import React from 'react';
import { expect } from 'chai';
import { subMonths, format, addMonths } from 'date-fns';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { renderWithRouter } from '../../utils';
import { buildDateFormatter, scrubDescription } from '../../../utils/helpers';

import DefaultPage from '../../../components/claim-document-request-pages/DefaultPage';

const formatDate = buildDateFormatter();

// test data for date that is 9 months ago
const today = new Date();
const nineMonthsAgoDate = subMonths(today, 9);
const nineMonthsAgoSuspenseDate = format(nineMonthsAgoDate, 'yyyy-MM-dd');
const fiveMonthsFromNow = addMonths(today, 5);
const fiveMonthsFromNowSuspenseDate = format(fiveMonthsFromNow, 'yyyy-MM-dd');

describe('<DefaultPage>', () => {
  const defaultProps = {
    onCancel: () => {},
    onSubmit: () => {},
    progress: 0,
    uploading: false,
  };

  it('should render updated UI', () => {
    const item = {
      closedDate: null,
      canUploadFile: true,
      description: 'First praty description',
      displayName: 'First party display name',
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
      <DefaultPage {...defaultProps} item={item} />,
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    getByText('Request for evidence');
    getByText(
      `Respond by ${formatDate(
        item.suspenseDate,
      )} for: First party display name`,
    );
    getByText('What we need from you', { selector: 'h2' });
    getByText('To respond to this request:');
    getByText(
      'If you need help understanding this request, check your claim letter online.',
    );
    expect($('va-link', container)).to.exist;
    expect($('.optional-upload', container)).to.not.exist;
    getByText(scrubDescription(item.description));
    expect($('va-additional-info', container)).to.exist;
    expect($('va-file-input-multiple', container)).to.exist;
  });

  it('should render update 21-4142 information', () => {
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
      documents: [],
      date: '2024-03-07',
    };
    const { getByText, container } = renderWithRouter(
      <DefaultPage {...defaultProps} item={item} />,
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    getByText('Authorization to Disclose Information');
    getByText(`Respond by ${formatDate(item.suspenseDate)}`);
    getByText('What we need from you');
    getByText('Learn about this request in your claim letter');
    getByText('Next steps');
    expect($('va-link', container)).to.exist;
    expect($('.optional-upload', container)).to.not.exist;
    expect($('va-additional-info', container)).to.exist;
    expect($('va-file-input-multiple', container)).to.exist;
  });
  it('should render updated default UI  when status is NEEDED_FROM_OTHERS', () => {
    const item = {
      closedDate: null,
      description: 'Third party description',
      displayName: 'Third party display name',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_OTHERS',
      suspenseDate: nineMonthsAgoSuspenseDate,
      uploadsAllowed: true,
      canUploadFile: true,
      documents: [],
      date: '2024-03-07',
    };
    const { getByText, container } = renderWithRouter(
      <DefaultPage {...defaultProps} item={item} />,
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    expect($('.due-date-header', container)).to.not.exist;
    getByText('Request for evidence outside VA');
    getByText(
      `We made a request outside VA on ${formatDate(
        item.requestedDate,
      )} for: Third party display name`,
    );
    expect($('.optional-upload', container)).to.exist;
    getByText('This is just a notice. No action is needed by you.');
    getByText(
      'But, if you have documents related to this request, uploading them on this page may help speed up the evidence review for your claim.',
    );
    getByText(scrubDescription(item.description));
    getByText('What we’re notifying you about');
    expect($('va-additional-info', container)).to.exist;
    expect($('va-file-input-multiple', container)).to.exist;
  });
  it('should render updated RV1 reserve records content', () => {
    const item = {
      closedDate: null,
      description: 'old description',
      friendlyName: 'Friendly RV1 name',
      displayName: 'RV1 - Reserve Records Request',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_OTHERS',
      suspenseDate: nineMonthsAgoSuspenseDate,
      uploadsAllowed: true,
      canUploadFile: true,
      documents: [],
      date: '2024-03-07',
    };
    const { getByText } = renderWithRouter(
      <DefaultPage {...defaultProps} item={item} />,
    );
    getByText('Your friendly RV1 name');
    getByText(
      'For your benefits claim, we’ve requested your service records or treatment records from your reserve unit.',
    );
    getByText(
      `We made a request outside VA on ${formatDate(item.requestedDate)}`,
    );
  });
  it(`should render updated request language on when the track item is a DBQ`, () => {
    const item = {
      closedDate: null,
      description: 'old description',
      friendlyName: 'Friendly DBQ name',
      displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-25',
      status: 'NEEDED_FROM_OTHERS',
      suspenseDate: nineMonthsAgoSuspenseDate,
      canUploadFile: false,
      documents: [],
      date: '2024-03-21',
    };
    const { getByText } = renderWithRouter(
      <DefaultPage {...defaultProps} item={item} />,
    );
    getByText(
      `We made a request on ${formatDate(
        item.requestedDate,
      )} for: friendly DBQ name`,
    );
  });
  it(`should render updated request language on when the track item is a sensitive item`, () => {
    const item = {
      closedDate: null,
      description: 'old description',
      friendlyName: 'Friendly sensitive item name',
      displayName: 'ASB - tell us where, when, how exposed',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-25',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: nineMonthsAgoSuspenseDate,
      canUploadFile: false,
      documents: [],
      date: '2024-03-21',
    };
    const { getByText } = renderWithRouter(
      <DefaultPage {...defaultProps} item={item} />,
    );
    getByText('Request for evidence');
    getByText(
      `Respond by ${formatDate(
        item.suspenseDate,
      )} for: friendly sensitive item name`,
    );
  });
  it('should display pass due alert when suspense date is in the past', () => {
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
      canUploadFile: true,
      documents: [],
      date: '2024-03-07',
    };
    const { getByText, container } = renderWithRouter(
      <DefaultPage {...defaultProps} item={item} />,
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    getByText('Deadline passed for requested information');
    getByText(
      'We haven’t received the information we asked for. You can still send it, but we may review your claim without it.',
    );
  });
  it('should display pass due explanation text when suspense date is in the future', () => {
    const item = {
      closedDate: null,
      description: 'Buddy statement text',
      displayName: 'Submit buddy statement(s)',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: fiveMonthsFromNowSuspenseDate,
      uploadsAllowed: true,
      canUploadFile: true,
      documents: [],
      date: '2024-03-07',
    };
    const { getByText, container } = renderWithRouter(
      <DefaultPage {...defaultProps} item={item} />,
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    getByText(
      'We requested this evidence from you on March 7, 2024. You can still send the evidence after the “respond by” date, but it may delay your claim.',
    );
  });
});
