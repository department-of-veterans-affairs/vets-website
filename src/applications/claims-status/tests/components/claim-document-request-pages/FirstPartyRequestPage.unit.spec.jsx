import React from 'react';
import { expect } from 'chai';
import { subMonths, format, addMonths } from 'date-fns';
import { within } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { renderWithReduxAndRouter } from '../../utils';
import { buildDateFormatter } from '../../../utils/helpers';
import { evidenceDictionary } from '../../../utils/evidenceDictionary';

import FirstPartyRequestPage from '../../../components/claim-document-request-pages/FirstPartyRequestPage';

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

describe('<FirstPartyRequestPage>', () => {
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
      description: 'First party description',
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
      <FirstPartyRequestPage {...defaultProps} item={item} />,
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
    getByText(item.description);
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
      <FirstPartyRequestPage {...defaultProps} item={item} />,
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

  it('should render updated request language when the tracked item is a sensitive item', () => {
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
      <FirstPartyRequestPage {...defaultProps} item={item} />,
      { initialState },
    );
    getByText('Request for evidence');
    getByText(
      `Respond by ${formatDate(
        item.suspenseDate,
      )} for: friendly sensitive item name`,
    );
  });

  it('should display past due alert when suspense date is in the past', () => {
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
      <FirstPartyRequestPage {...defaultProps} item={item} />,
      { initialState },
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    getByText('Deadline passed for requested information');
    getByText(
      'We haven’t received the information we asked for. You can still send it, but we may review your claim without it.',
    );
    getByText(
      'We requested this evidence from you on March 7, 2024. You can still send the evidence after the “respond by” date, but it may delay your claim.',
    );
  });

  it('should display explanation text when suspense date is in the future', () => {
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
      <FirstPartyRequestPage {...defaultProps} item={item} />,
      { initialState },
    );
    expect($('#default-page', container)).to.exist;
    expect($('.add-files-form', container)).to.exist;
    getByText(
      'We requested this evidence from you on March 7, 2024. You can still send the evidence after the \u201Crespond by\u201D date, but it may delay your claim.',
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
          <FirstPartyRequestPage
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
          <FirstPartyRequestPage
            {...defaultProps}
            item={trackedItem}
            message={null}
          />,
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
            <FirstPartyRequestPage
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
          <FirstPartyRequestPage
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
          <FirstPartyRequestPage
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
          <FirstPartyRequestPage
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
        expectedNextStepsTestId: 'next-steps-in-what-we-need-from-you',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
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
        dictionaryEntry: null,
        expectedHeader: 'Custom friendly name for testing',
        expectedSubheaderPattern: /Respond by/,
        expectedSubheaderExcludes: 'Unknown Request Type',
        expectedDescriptionText:
          'we\u2019re unable to provide more information about the request',
        expectedNextStepsTestId: 'next-steps-in-claim-letter',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
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
        dictionaryEntry: null,
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: Generic Request No Override/,
        expectedDescriptionText:
          'we\u2019re unable to provide more information about the request',
        expectedNextStepsTestId: 'next-steps-in-claim-letter',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
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
        dictionaryEntry: null,
        expectedHeader: 'Request for evidence',
        expectedSubheaderPattern: /Respond by .* for: Another Generic Request/,
        expectedDescriptionText: 'API-provided description for this request',
        expectedNextStepsTestId: 'next-steps-in-what-we-need-from-you',
        showsAddFilesForm: true,
        showsPastDueAlert: false,
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
          <FirstPartyRequestPage {...defaultProps} item={testCase.item} />,
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
          expect(queryByTestId('learn-about-request-section')).to.exist;
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

  describe('API structured content fallback pattern', () => {
    const futureSuspenseDate = fiveMonthsFromNowSuspenseDate;

    const mockApiLongDescription = {
      blocks: [
        {
          type: 'paragraph',
          content:
            'This is API-provided structured content for longDescription.',
        },
        {
          type: 'list',
          style: 'bullet',
          items: ['API item 1', 'API item 2', 'API item 3'],
        },
      ],
    };

    const mockApiNextSteps = {
      blocks: [
        {
          type: 'paragraph',
          content: 'These are API-provided structured next steps.',
        },
      ],
    };

    context('longDescription fallback priority', () => {
      it('Priority 1: API-provided structured content (JSON blocks)', () => {
        const item = {
          id: 200,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          longDescription: mockApiLongDescription,
          description: 'Old simple description',
        };

        const { getByTestId, queryByTestId } = renderWithReduxAndRouter(
          <FirstPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        expect(getByTestId('api-long-description')).to.exist;
        expect(queryByTestId('frontend-description')).to.not.exist;
        expect(queryByTestId('api-description')).to.not.exist;
        expect(queryByTestId('empty-state-description')).to.not.exist;
      });
    });

    context('nextSteps fallback priority', () => {
      it('Priority 1: API structured next steps', () => {
        const item = {
          id: 205,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          nextSteps: mockApiNextSteps,
        };

        const {
          getByTestId,
          queryByTestId,
          getByText,
        } = renderWithReduxAndRouter(
          <FirstPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        expect(getByTestId('api-next-steps')).to.exist;
        getByText('These are API-provided structured next steps.');
        expect(queryByTestId('frontend-next-steps')).to.not.exist;
        expect(queryByTestId('next-steps-in-what-we-need-from-you')).to.not
          .exist;
      });
    });

    context('API content with generic next steps', () => {
      it('References "What we need from you" when API longDescription exists', () => {
        const item = {
          id: 209,
          displayName: 'Unknown Item Type',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          longDescription: mockApiLongDescription, // Has API content
          // No nextSteps
        };

        const { getByTestId, getByText } = renderWithReduxAndRouter(
          <FirstPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        // Should show "What we need from you" reference
        const listItem = getByTestId('next-steps-in-what-we-need-from-you');
        expect(listItem).to.exist;
        expect(listItem.textContent).to.include(
          'Gather and submit any documents',
        );
        expect(listItem.textContent).to.include('What we need from you');
        // Should also show help text about claim letters
        getByText(
          'If you need help understanding this request, check your claim letter online.',
        );
      });
    });

    context('combined API structured content scenarios', () => {
      it('Renders both API longDescription and nextSteps when both are provided', () => {
        const item = {
          id: 213,
          displayName: 'Unknown Item Type',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          longDescription: mockApiLongDescription,
          nextSteps: mockApiNextSteps,
        };

        const { getByTestId, queryByTestId } = renderWithReduxAndRouter(
          <FirstPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        // Should render both API structured contents
        expect(getByTestId('api-long-description')).to.exist;
        expect(getByTestId('api-next-steps')).to.exist;
        // Should NOT render any fallback content
        expect(queryByTestId('frontend-description')).to.not.exist;
        expect(queryByTestId('frontend-next-steps')).to.not.exist;
        expect(queryByTestId('api-description')).to.not.exist;
        expect(queryByTestId('next-steps-in-what-we-need-from-you')).to.not
          .exist;
      });

      it('Renders API longDescription with frontend nextSteps (mixed API and dictionary)', () => {
        const item = {
          id: 214,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          longDescription: mockApiLongDescription, // API
          // nextSteps will come from dictionary
        };

        const { getByTestId, queryByTestId } = renderWithReduxAndRouter(
          <FirstPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        // Should render API structured longDescription
        expect(getByTestId('api-long-description')).to.exist;
        // Should render frontend nextSteps
        expect(getByTestId('frontend-next-steps')).to.exist;
        // Should NOT render frontend description
        expect(queryByTestId('frontend-description')).to.not.exist;
        expect(queryByTestId('api-next-steps')).to.not.exist;
      });

      it('Renders frontend description with API nextSteps', () => {
        const item = {
          id: 215,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          // longDescription will come from dictionary
          nextSteps: mockApiNextSteps, // API
        };

        const { getByTestId, queryByTestId } = renderWithReduxAndRouter(
          <FirstPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        // Should render frontend dictionary longDescription
        expect(getByTestId('frontend-description')).to.exist;
        // Should render API structured nextSteps
        expect(getByTestId('api-next-steps')).to.exist;
        // Should NOT render API longDescription
        expect(queryByTestId('api-long-description')).to.not.exist;
        expect(queryByTestId('frontend-next-steps')).to.not.exist;
      });
    });

    context('backward compatibility', () => {
      it('Maintains existing behavior when API fields are undefined', () => {
        const item = {
          id: 216,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        };

        const { getByTestId, queryByTestId } = renderWithReduxAndRouter(
          <FirstPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        expect(getByTestId('frontend-description')).to.exist;
        expect(getByTestId('frontend-next-steps')).to.exist;
        expect(queryByTestId('api-long-description')).to.not.exist;
        expect(queryByTestId('api-next-steps')).to.not.exist;
      });
    });
  });

  // ============================================================
  // BOOLEAN PROPERTY FALLBACK TESTS
  // Tests for API → dictionary → false fallback hierarchy
  // for isSensitive, isDBQ, and noActionNeeded properties
  // ============================================================
  describe('Boolean property fallback pattern (API -> dictionary -> false)', () => {
    const futureSuspenseDate = fiveMonthsFromNowSuspenseDate;

    describe('isSensitive property', () => {
      const isSensitiveTestCases = [
        {
          name: 'uses API value when present (API: true, dictionary: false)',
          displayName: 'Employment info needed', // dictionary has no isSensitive value
          friendlyName: 'Test sensitive item',
          isSensitive: true,
          expectedHeader: 'Request for evidence',
          subheaderIncludesFor: true,
        },
        {
          name: 'uses dictionary value when API absent (dictionary: true)',
          displayName: 'ASB - tell us where, when, how exposed', // dictionary has isSensitive: true
          friendlyName: 'Asbestos info',
          isSensitive: undefined,
          expectedHeader: 'Request for evidence',
          subheaderIncludesFor: true,
        },
        {
          name: 'defaults to false when both API and dictionary absent',
          displayName: 'Unknown item type', // no dictionary entry
          friendlyName: 'Custom friendly name',
          isSensitive: undefined,
          expectedHeader: 'Custom friendly name',
          subheaderIncludesFor: false,
        },
      ];

      isSensitiveTestCases.forEach(testCase => {
        it(testCase.name, () => {
          const item = {
            id: 300,
            displayName: testCase.displayName,
            status: 'NEEDED_FROM_YOU',
            requestedDate: '2025-12-01',
            suspenseDate: futureSuspenseDate,
            friendlyName: testCase.friendlyName,
            canUploadFile: true,
            isSensitive: testCase.isSensitive,
          };

          const { getByText, container } = renderWithReduxAndRouter(
            <FirstPartyRequestPage {...defaultProps} item={item} />,
            { initialState },
          );

          getByText(testCase.expectedHeader);
          const h1 = container.querySelector('h1');
          const subheaderSpan = h1.querySelector('span');
          if (testCase.subheaderIncludesFor) {
            expect(subheaderSpan.textContent).to.include('for:');
          } else {
            expect(subheaderSpan.textContent).to.not.include('for:');
          }
        });
      });
    });
  });
});
