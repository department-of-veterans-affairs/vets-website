import React from 'react';
import { expect } from 'chai';
import { subMonths, format, addMonths } from 'date-fns';
import { within } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { renderWithReduxAndRouter } from '../../utils';
import { buildDateFormatter, scrubDescription } from '../../../utils/helpers';
import { evidenceDictionary } from '../../../utils/evidenceDictionary';

import DefaultPage from '../../../components/claim-document-request-pages/DefaultPage';

const formatDate = buildDateFormatter();

// test data for date that is 9 months ago
const today = new Date();
const nineMonthsAgoDate = subMonths(today, 9);
const nineMonthsAgoSuspenseDate = format(nineMonthsAgoDate, 'yyyy-MM-dd');
const fiveMonthsFromNow = addMonths(today, 5);
const fiveMonthsFromNowSuspenseDate = format(fiveMonthsFromNow, 'yyyy-MM-dd');

// Needed for the rendering of the AddFilesForm child component
const initialState = {
  featureToggles: {
    // eslint-disable-next-line camelcase
    cst_show_document_upload_status: false,
  },
};

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
    const { getByText, container } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
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
    getByText('You can find blank copies of many VA forms online.');
    expect($('va-link', container)).to.exist;
    expect($('.optional-upload', container)).to.not.exist;
    getByText(scrubDescription(item.description));
    expect($('va-additional-info', container)).to.exist;
    expect($('va-file-input-multiple', container)).to.exist;

    // Verify "Next steps" section content for API description (no frontend content)
    const bulletItems = container.querySelectorAll('.bullet-disc li');
    expect(bulletItems.length).to.equal(2);
    // Bullet points should NOT have terminal periods
    bulletItems.forEach(bulletItem => {
      expect(bulletItem.textContent).to.not.match(/\.$/);
    });
    // Verify link text uses action verb
    const findFormsLink = $('va-link[href="/find-forms"]', container);
    expect(findFormsLink).to.exist;
    expect(findFormsLink.getAttribute('text')).to.equal('Find a VA form');
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
    const { getByText, container } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
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
    const { getByText, container } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
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
    const { getByText } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
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
    const { getByText } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
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
    const { getByText } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
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
    const { getByText, container } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
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
    const { getByText, container } = renderWithReduxAndRouter(
      <DefaultPage {...defaultProps} item={item} />,
      { initialState },
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    getByText(
      'We requested this evidence from you on March 7, 2024. You can still send the evidence after the “respond by” date, but it may delay your claim.',
    );
  });

  describe('Type 1 error alerts', () => {
    const trackedItem = {
      closedDate: null,
      description: 'desc',
      displayName: 'Submit buddy statement(s)',
      id: 1,
      overdue: false,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: fiveMonthsFromNowSuspenseDate,
      uploadsAllowed: true,
      canUploadFile: true,
      documents: [],
      date: '2024-03-07',
    };

    context('when cst_show_document_upload_status is disabled', () => {
      it('should not render unknown error alert', () => {
        const { queryByTestId } = renderWithReduxAndRouter(
          <DefaultPage
            {...defaultProps}
            item={trackedItem}
            type1UnknownErrors={null}
          />,
          { initialState },
        );

        expect(queryByTestId('notification')).to.not.exist;
      });

      it('should not render known error alert (duplicate file, etc.)', () => {
        const { queryByTestId } = renderWithReduxAndRouter(
          <DefaultPage {...defaultProps} item={trackedItem} message={null} />,
          { initialState },
        );

        expect(queryByTestId('notification')).to.not.exist;
      });
    });

    context('when cst_show_document_upload_status is enabled', () => {
      const tests = [
        {
          description:
            'should not render the alert when type1UnknownErrors is an empty array',
          type1UnknownErrors: [],
        },
        {
          description:
            'should not render the alert when type1UnknownErrors is null',
          type1UnknownErrors: null,
        },
        {
          description:
            'should not render the alert when type1UnknownErrors is undefined',
          type1UnknownErrors: undefined,
        },
      ];

      tests.forEach(({ description, type1UnknownErrors }) => {
        it(description, () => {
          const { queryByTestId } = renderWithReduxAndRouter(
            <DefaultPage
              {...defaultProps}
              item={trackedItem}
              type1UnknownErrors={type1UnknownErrors}
            />,
            {
              initialState: {
                ...initialState,
                // eslint-disable-next-line camelcase
                featureToggles: { cst_show_document_upload_status: true },
              },
            },
          );
          expect(queryByTestId('notification')).to.not.exist;
        });
      });

      it('should render the type 1 unknown error alert when type1UnknownErrors exists', () => {
        const { getByTestId } = renderWithReduxAndRouter(
          <DefaultPage
            {...defaultProps}
            item={trackedItem}
            type1UnknownErrors={[
              { fileName: 'a.pdf', docType: 'Medical' },
              { fileName: 'b.pdf', docType: 'Medical' },
            ]}
          />,
          {
            initialState: {
              ...initialState,
              // eslint-disable-next-line camelcase
              featureToggles: { cst_show_document_upload_status: true },
            },
          },
        );
        const notification = getByTestId('notification');

        within(notification).getByText(
          'We need you to submit files by mail or in person',
        );
      });

      it('should render the known error alert when message exists', () => {
        const message = {
          title: 'Known Error',
          body: 'Some known error message',
          type: 'error',
        };
        const { getByTestId } = renderWithReduxAndRouter(
          <DefaultPage
            {...defaultProps}
            item={trackedItem}
            message={message}
          />,
          {
            initialState: {
              ...initialState,
              // eslint-disable-next-line camelcase
              featureToggles: { cst_show_document_upload_status: true },
            },
          },
        );
        const notification = getByTestId('notification');

        within(notification).getByText('Known Error');
        within(notification).getByText('Some known error message');
      });

      it('should render the known error alert and the type 1 unknown error alert when both message and type1UnknownErrors exist', () => {
        const message = {
          title: 'Known Error',
          body: 'Some known error message',
          type: 'error',
        };
        const { getAllByTestId } = renderWithReduxAndRouter(
          <DefaultPage
            {...defaultProps}
            item={trackedItem}
            message={message}
            type1UnknownErrors={[{ fileName: 'a.pdf', docType: 'Medical' }]}
          />,
          {
            initialState: {
              ...initialState,
              // eslint-disable-next-line camelcase
              featureToggles: { cst_show_document_upload_status: true },
            },
          },
        );
        // Both alerts should be visible
        const notifications = getAllByTestId('notification');

        expect(notifications).to.have.lengthOf(2);
        // Check content of the known error notification
        within(notifications[0]).getByText('Known Error');
        within(notifications[0]).getByText('Some known error message');
        // Check content of the unknown error notification
        within(notifications[1]).getByText(
          'We need you to submit files by mail or in person',
        );
      });
    });
  });

  // ============================================================
  // PATH COVERAGE TESTS
  // Parameterized tests to exercise all DefaultPage.jsx rendering paths
  // ============================================================
  describe('First party path coverage tests', () => {
    const futureSuspenseDate = fiveMonthsFromNowSuspenseDate;
    const pastSuspenseDate = nineMonthsAgoSuspenseDate;

    // Helper to get dictionary entry for a displayName
    const getDictEntry = displayName => evidenceDictionary[displayName];

    const firstPartyTestCases = [
      {
        id: 1,
        name: 'Frontend override with longDescription + nextSteps',
        item: {
          id: 1,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry('21-4142/21-4142a'),
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: 21-4142\/21-4142a/,
        expectedDescriptionText:
          'we need your permission to request your personal information',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
      {
        id: 2,
        name: 'Past due date warning alert',
        item: {
          id: 2,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2024-01-01',
          suspenseDate: pastSuspenseDate,
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry('21-4142/21-4142a'),
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: 21-4142\/21-4142a/,
        expectedDescriptionText:
          'we need your permission to request your personal information',
        showsAddFilesForm: true,
        showsPastDueAlert: true,
        showsThirdPartyNotice: false,
      },
      {
        id: 3,
        name: 'Frontend override with isSensitive: true',
        item: {
          id: 3,
          displayName: 'ASB - tell us where, when, how exposed',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          friendlyName: 'Asbestos exposure details',
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry('ASB - tell us where, when, how exposed'),
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: asbestos exposure details/i,
        expectedDescriptionText:
          'To process your disability claim for asbestos exposure',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
      {
        id: 15,
        name: 'ASB - tell us specific disability (isSensitive: true)',
        item: {
          id: 15,
          displayName: 'ASB-tell us specific disability fm asbestos exposure',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-10-23',
          suspenseDate: futureSuspenseDate,
          friendlyName: 'asbestos exposure information',
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry(
          'ASB-tell us specific disability fm asbestos exposure',
        ),
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: asbestos exposure information/i,
        expectedDescriptionText:
          'To process your disability claim for asbestos exposure, we need information about your asbestos-related disease or disability:',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
      {
        id: 4,
        name: 'Frontend override with longDescription but NO nextSteps',
        item: {
          id: 4,
          displayName: 'Employer (21-4192)',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry('Employer (21-4192)'),
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: Employer \(21-4192\)/,
        expectedDescriptionText:
          'we sent a letter to your last employer to ask about your job and why you left',
        // Generic next steps shown because no nextSteps in dictionary
        expectedNextStepsTestId: 'next-steps-in-what-we-need-from-you',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
      {
        id: 5,
        name: 'No frontend override, WITH friendlyName',
        item: {
          id: 5,
          displayName: 'Unknown Request Type',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          friendlyName: 'Custom friendly name for testing',
          canUploadFile: true,
        },
        dictionaryEntry: null, // No dictionary entry
        expectedHeader: 'Custom friendly name for testing',
        expectedSubheaderPattern: /Respond by/,
        expectedSubheaderExcludes: 'Unknown Request Type',
        expectedDescriptionText:
          'we’re unable to provide more information about the request',
        expectedNextStepsTestId: 'next-steps-in-claim-letter',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
      {
        id: 6,
        name: 'No frontend override, NO friendlyName, NO description',
        item: {
          id: 6,
          displayName: 'Generic Request No Override',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          description: null,
          canUploadFile: true,
        },
        dictionaryEntry: null, // No dictionary entry
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: Generic Request No Override/,
        expectedDescriptionText:
          'we’re unable to provide more information about the request',
        expectedNextStepsTestId: 'next-steps-in-claim-letter',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
      {
        id: 7,
        name: 'No frontend override, WITH API description',
        item: {
          id: 7,
          displayName: 'Another Generic Request',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          description: 'API-provided description for this request',
          canUploadFile: true,
        },
        dictionaryEntry: null, // No dictionary entry
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: Another Generic Request/,
        expectedDescriptionText: 'API-provided description for this request',
        expectedNextStepsTestId: 'next-steps-in-what-we-need-from-you',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
      {
        id: 8,
        name: 'Upload disabled (canUploadFile: false)',
        item: {
          id: 8,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: false,
        },
        dictionaryEntry: getDictEntry('21-4142/21-4142a'),
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: 21-4142\/21-4142a/,
        expectedDescriptionText:
          'we need your permission to request your personal information',
        showsAddFilesForm: false,
        showsPastDueAlert: false,
        showsThirdPartyNotice: false,
      },
    ];

    firstPartyTestCases.forEach(testCase => {
      it(`Path ${testCase.id}: ${testCase.name}`, () => {
        const {
          getByText,
          getByTestId,
          queryByText,
          queryByTestId,
          container,
        } = renderWithReduxAndRouter(
          <DefaultPage {...defaultProps} item={testCase.item} />,
          { initialState },
        );

        // Verify header
        getByText(testCase.expectedHeader);

        // Verify subheader
        const h1 = $('h1', container);
        const subheaderSpan = $('span', h1);
        expect(subheaderSpan.textContent).to.match(
          testCase.expectedSubheaderPattern,
        );
        if (testCase.expectedSubheaderExcludes) {
          expect(subheaderSpan.textContent).to.not.include(
            testCase.expectedSubheaderExcludes,
          );
        }

        // Verify past due alert
        const pastDueAlert = queryByText(
          'Deadline passed for requested information',
        );
        if (testCase.showsPastDueAlert) {
          expect(pastDueAlert).to.exist;
        } else {
          expect(pastDueAlert).to.not.exist;
        }

        // Verify description header (always "What we need from you" for first party)
        getByText('What we need from you', { selector: 'h2' });

        // Verify description content and "Learn about this request" section
        if (testCase.dictionaryEntry?.longDescription) {
          expect(getByTestId('frontend-description')).to.exist;
          getByText(new RegExp(testCase.expectedDescriptionText, 'i'));
          expect(queryByTestId('learn-about-request-section')).to.exist;
        } else if (testCase.item.description) {
          expect(getByTestId('api-description')).to.exist;
          getByText(new RegExp(testCase.expectedDescriptionText, 'i'));
          expect(queryByTestId('learn-about-request-section')).to.not.exist;
        } else {
          expect(getByTestId('empty-state-description')).to.exist;
          getByText(new RegExp(testCase.expectedDescriptionText, 'i'));
          expect(queryByTestId('learn-about-request-section')).to.not.exist;
        }

        // Verify next steps
        if (testCase.dictionaryEntry?.nextSteps) {
          expect(testCase.dictionaryEntry.nextSteps).to.exist;
          getByText('Next steps', { selector: 'h2' });
        } else if (testCase.expectedNextStepsTestId) {
          expect(getByTestId(testCase.expectedNextStepsTestId)).to.exist;
        }

        // Verify AddFilesForm
        const addFilesForm = $('.add-files-form', container);
        if (testCase.showsAddFilesForm) {
          expect(addFilesForm).to.exist;
        } else {
          expect(addFilesForm).to.not.exist;
        }
      });
    });
  });

  describe('Third party path coverage tests', () => {
    const futureSuspenseDate = fiveMonthsFromNowSuspenseDate;

    // Helper to get dictionary entry for a displayName
    const getDictEntry = displayName => evidenceDictionary[displayName];

    const thirdPartyTestCases = [
      {
        id: 9,
        name: 'DBQ request with noActionNeeded',
        item: {
          id: 9,
          displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry('DBQ AUDIO Hearing Loss and Tinnitus'),
        expectedHeader: 'Request for an exam',
        expectedSubheaderPattern: /We made a request on .* for: DBQ AUDIO/,
        expectedDescriptionText:
          'we’ve requested a disability exam for your hearing',
        showsAddFilesForm: true,
      },
      {
        id: 10,
        name: 'Frontend override with noActionNeeded (non-DBQ)',
        item: {
          id: 10,
          displayName: 'Employer (21-4192)',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry('Employer (21-4192)'),
        expectedHeader: 'Request for evidence outside VA',
        expectedSubheaderPattern: /We made a request outside VA on .* for: Employer/,
        expectedDescriptionText: 'we sent a letter to your last employer',
        showsAddFilesForm: true,
      },
      {
        id: 11,
        name: 'WITH friendlyName, no frontend override',
        item: {
          id: 11,
          displayName: 'Unknown Third Party Request',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          friendlyName: 'Third party friendly name',
          canUploadFile: true,
        },
        dictionaryEntry: null, // No dictionary entry
        expectedHeader: 'Your third party friendly name',
        expectedSubheaderPattern: /We made a request outside VA on/,
        expectedSubheaderExcludes: 'Unknown Third Party Request',
        // No description shown for third party without frontend/API description
        expectedDescriptionText: null,
        showsAddFilesForm: true,
      },
      {
        id: 12,
        name: 'No friendlyName, no frontend override',
        item: {
          id: 12,
          displayName: 'Generic Third Party Request',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        dictionaryEntry: null,
        expectedHeader: 'Request for evidence outside VA',
        expectedSubheaderPattern: /We made a request outside VA on .* for: Generic Third Party Request/,
        // No description shown for third party without frontend/API description
        expectedDescriptionText: null,
        showsAddFilesForm: true,
      },
      {
        id: 13,
        name: 'Frontend override with longDescription, NOT noActionNeeded',
        item: {
          id: 13,
          displayName: 'PMR Pending',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        dictionaryEntry: getDictEntry('PMR Pending'),
        expectedHeader: 'Request for evidence outside VA',
        expectedSubheaderPattern: /We made a request outside VA on .* for: PMR Pending/,
        expectedDescriptionText: 'we’ve requested your non-VA medical records',
        showsAddFilesForm: true,
      },
      {
        id: 14,
        name: 'No frontend override, WITH API description',
        item: {
          id: 14,
          displayName: 'Generic Third Party Request',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          description: 'API-provided description for this request',
          canUploadFile: true,
        },
        dictionaryEntry: null,
        expectedHeader: 'Request for evidence outside VA',
        expectedSubheaderPattern: /We made a request outside VA on .* for: Generic Third Party Request/,
        expectedDescriptionText: 'API-provided description for this request',
        showsAddFilesForm: true,
      },
    ];

    thirdPartyTestCases.forEach(testCase => {
      it(`Path ${testCase.id}: ${testCase.name}`, () => {
        const {
          getByText,
          getByTestId,
          queryByText,
          queryByTestId,
          container,
        } = renderWithReduxAndRouter(
          <DefaultPage {...defaultProps} item={testCase.item} />,
          { initialState },
        );

        // Verify header
        getByText(testCase.expectedHeader);

        // Verify subheader
        const h1 = $('h1', container);
        const subheaderSpan = $('span', h1);
        expect(subheaderSpan.textContent).to.match(
          testCase.expectedSubheaderPattern,
        );
        if (testCase.expectedSubheaderExcludes) {
          expect(subheaderSpan.textContent).to.not.include(
            testCase.expectedSubheaderExcludes,
          );
        }

        // Verify section header (always "What we're notifying you about" for third party)
        getByText('What we’re notifying you about', { selector: 'h2' });

        // Verify third party notice (always shown for third party)
        expect($('.optional-upload', container)).to.exist;
        expect(
          queryByText('This is just a notice. No action is needed by you.'),
        ).to.exist;

        // Verify description content (no "Learn about" section for third party)
        if (testCase.dictionaryEntry?.longDescription) {
          expect(getByTestId('frontend-description')).to.exist;
          getByText(new RegExp(testCase.expectedDescriptionText, 'i'));
        } else if (testCase.item.description) {
          expect(getByTestId('api-description')).to.exist;
          getByText(new RegExp(testCase.expectedDescriptionText, 'i'));
        } else {
          // Third party requests without frontend/API description show no description
          // (empty-state-description is only shown for first party requests)
          expect(queryByTestId('frontend-description')).to.not.exist;
          expect(queryByTestId('api-description')).to.not.exist;
          expect(queryByTestId('empty-state-description')).to.not.exist;
        }
        expect(queryByTestId('learn-about-request-section')).to.not.exist;

        // Verify upload suggestion visibility (hidden when noActionNeeded is true)
        const uploadSuggestion = queryByText(
          /if you have documents related to this request, uploading them/i,
        );
        if (testCase.dictionaryEntry?.noActionNeeded) {
          expect(uploadSuggestion).to.not.exist;
        } else {
          expect(uploadSuggestion).to.exist;
        }

        // Verify AddFilesForm
        const addFilesForm = $('.add-files-form', container);
        if (testCase.showsAddFilesForm) {
          expect(addFilesForm).to.exist;
        } else {
          expect(addFilesForm).to.not.exist;
        }
      });
    });
  });
});
