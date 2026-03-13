import React from 'react';
import { expect } from 'chai';
import { subMonths, format, addMonths } from 'date-fns';
import { within } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { renderWithReduxAndRouter } from '../../utils';
import { buildDateFormatter } from '../../../utils/helpers';

import ThirdPartyRequestPage from '../../../components/claim-document-request-pages/ThirdPartyRequestPage';

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

describe('<ThirdPartyRequestPage>', () => {
  const defaultProps = {
    onCancel: () => {},
    onSubmit: () => {},
    progress: 0,
    uploading: false,
  };

  const createTrackedItem = (overrides = {}) => ({
    id: 1,
    closedDate: null,
    description: null,
    displayName: 'Third party display name',
    overdue: false,
    receivedDate: null,
    requestedDate: '2024-03-07',
    status: 'NEEDED_FROM_OTHERS',
    suspenseDate: fiveMonthsFromNowSuspenseDate,
    uploadsAllowed: true,
    canUploadFile: true,
    documents: [],
    date: '2024-03-07',
    ...overrides,
  });

  it('should render updated default UI when status is NEEDED_FROM_OTHERS', () => {
    const item = createTrackedItem({
      id: 467558,
      description: 'Third party description',
      overdue: true,
      suspenseDate: nineMonthsAgoSuspenseDate,
    });
    const { getByText, container } = renderWithReduxAndRouter(
      <ThirdPartyRequestPage {...defaultProps} item={item} />,
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
    getByText(item.description);
    getByText('What we\u2019re notifying you about');
    expect($('va-additional-info', container)).to.exist;
    expect($('va-file-input-multiple', container)).to.exist;
  });

  it('should render updated RV1 reserve records content', () => {
    const item = createTrackedItem({
      id: 467558,
      description: 'old description',
      friendlyName: 'Friendly RV1 name',
      displayName: 'RV1 - Reserve Records Request',
      overdue: true,
      suspenseDate: nineMonthsAgoSuspenseDate,
    });
    const { getByText } = renderWithReduxAndRouter(
      <ThirdPartyRequestPage {...defaultProps} item={item} />,
      { initialState },
    );
    getByText('Your friendly RV1 name');
    getByText('old description');
    getByText(
      `We made a request outside VA on ${formatDate(item.requestedDate)}`,
    );
  });

  it('should render updated request language when the tracked item is a DBQ', () => {
    const item = createTrackedItem({
      id: 467558,
      description: 'old description',
      friendlyName: 'Friendly DBQ name',
      displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
      overdue: true,
      requestedDate: '2024-03-25',
      suspenseDate: nineMonthsAgoSuspenseDate,
      canUploadFile: false,
      date: '2024-03-21',
    });
    const { getByText } = renderWithReduxAndRouter(
      <ThirdPartyRequestPage {...defaultProps} item={item} />,
      { initialState },
    );
    getByText(
      `We made a request on ${formatDate(
        item.requestedDate,
      )} for: friendly DBQ name`,
    );
  });

  describe('Type 1 error alerts', () => {
    const trackedItem = createTrackedItem({
      description: 'desc',
      displayName: 'Submit buddy statement(s)',
    });

    context('when cst_show_document_upload_status is disabled', () => {
      it('should not render unknown error alert', () => {
        const { queryByTestId } = renderWithReduxAndRouter(
          <ThirdPartyRequestPage
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
          <ThirdPartyRequestPage
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
            <ThirdPartyRequestPage
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
          <ThirdPartyRequestPage
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
          <ThirdPartyRequestPage
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
          <ThirdPartyRequestPage
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

  describe('Third party path coverage tests', () => {
    const futureSuspenseDate = fiveMonthsFromNowSuspenseDate;

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
          noActionNeeded: true,
        },
        expectedHeader: 'Request for an exam',
        expectedSubheaderPattern: /We made a request on .* for: DBQ AUDIO/,
        expectedDescriptionText: null,
        showsAddFilesForm: true,
      },
      {
        id: 10,
        name: 'noActionNeeded (non-DBQ)',
        item: {
          id: 10,
          displayName: 'Employer (21-4192)',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          noActionNeeded: true,
        },
        expectedHeader: 'Request for evidence outside VA',
        expectedSubheaderPattern: /We made a request outside VA on .* for: Employer/,
        expectedDescriptionText: null,
        showsAddFilesForm: true,
      },
      {
        id: 11,
        name: 'With friendlyName, no description from item',
        item: {
          id: 11,
          displayName: 'Unknown Third Party Request',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          friendlyName: 'Third party friendly name',
          canUploadFile: true,
        },
        expectedHeader: 'Your third party friendly name',
        expectedSubheaderPattern: /We made a request outside VA on/,
        expectedSubheaderExcludes: 'Unknown Third Party Request',
        expectedDescriptionText: null,
        showsAddFilesForm: true,
      },
      {
        id: 12,
        name: 'No friendlyName, no description from item',
        item: {
          id: 12,
          displayName: 'Generic Third Party Request',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        expectedHeader: 'Request for evidence outside VA',
        expectedSubheaderPattern: /We made a request outside VA on .* for: Generic Third Party Request/,
        expectedDescriptionText: null,
        showsAddFilesForm: true,
      },
      {
        id: 13,
        name: 'No description from item, upload suggestion shown',
        item: {
          id: 13,
          displayName: 'PMR Pending',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
        },
        expectedHeader: 'Request for evidence outside VA',
        expectedSubheaderPattern: /We made a request outside VA on .* for: PMR Pending/,
        expectedDescriptionText: null,
        showsAddFilesForm: true,
      },
      {
        id: 14,
        name: 'With item.description',
        item: {
          id: 14,
          displayName: 'Generic Third Party Request',
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          description: 'API-provided description for this request',
          canUploadFile: true,
        },
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
          <ThirdPartyRequestPage {...defaultProps} item={testCase.item} />,
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
        getByText('What we\u2019re notifying you about', { selector: 'h2' });

        // Verify third party notice (always shown for third party)
        expect($('.optional-upload', container)).to.exist;
        expect(
          queryByText('This is just a notice. No action is needed by you.'),
        ).to.exist;

        // Verify description content: from item (longDescription.blocks or description). No "Learn about" section for third party.
        if (testCase.item.longDescription?.blocks) {
          expect(getByTestId('api-long-description')).to.exist;
          if (testCase.expectedDescriptionText) {
            getByText(new RegExp(testCase.expectedDescriptionText, 'i'));
          }
        } else if (testCase.item.description) {
          expect(getByTestId('api-description')).to.exist;
          getByText(new RegExp(testCase.expectedDescriptionText, 'i'));
        } else {
          expect(queryByTestId('api-description')).to.not.exist;
          expect(queryByTestId('empty-state-description')).to.not.exist;
        }
        expect(queryByTestId('learn-about-request-section')).to.not.exist;

        // Verify upload suggestion: hidden when item.noActionNeeded is true
        const uploadSuggestion = queryByText(
          /if you have documents related to this request, uploading them/i,
        );
        if (testCase.item.noActionNeeded) {
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

        // Verify OtherWaysToSendYourDocuments
        const otherWays = queryByTestId('other-ways-to-send-documents');
        if (testCase.showsAddFilesForm) {
          expect(otherWays).to.exist;
        } else {
          expect(otherWays).to.not.exist;
        }
      });
    });
  });

  describe('OtherWaysToSendYourDocuments', () => {
    it('should render when canUploadFile is true', () => {
      const item = createTrackedItem({ canUploadFile: true });
      const { getByTestId, getByText } = renderWithReduxAndRouter(
        <ThirdPartyRequestPage {...defaultProps} item={item} />,
        { initialState },
      );
      expect(getByTestId('other-ways-to-send-documents')).to.exist;
      getByText('Other ways to send your documents');
    });

    it('should not render when canUploadFile is false', () => {
      const item = createTrackedItem({ canUploadFile: false });
      const { queryByTestId } = renderWithReduxAndRouter(
        <ThirdPartyRequestPage {...defaultProps} item={item} />,
        { initialState },
      );
      expect(queryByTestId('other-ways-to-send-documents')).to.not.exist;
    });
  });

  describe('isDBQ property', () => {
    const futureSuspenseDate = fiveMonthsFromNowSuspenseDate;

    const isDBQTestCases = [
      {
        name: 'returns true when item.isDBQ is true',
        displayName: 'Unknown third party request',
        isDBQ: true,
        expectOutsideVA: false,
      },
      {
        name: 'returns true when displayName contains "dbq" (case-insensitive)',
        displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
        isDBQ: undefined,
        expectOutsideVA: false,
      },
      {
        name:
          'returns false when item has no isDBQ and displayName has no "dbq"',
        displayName: 'Unknown third party type',
        isDBQ: undefined,
        expectOutsideVA: true,
      },
    ];

    isDBQTestCases.forEach(testCase => {
      it(testCase.name, () => {
        const item = {
          id: 304,
          displayName: testCase.displayName,
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          friendlyName: 'Test request',
          canUploadFile: true,
          isDBQ: testCase.isDBQ,
        };

        const { container } = renderWithReduxAndRouter(
          <ThirdPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        const h1 = container.querySelector('h1');
        const subheaderSpan = h1.querySelector('span');
        if (testCase.expectOutsideVA) {
          expect(subheaderSpan.textContent).to.include('outside VA');
        } else {
          expect(subheaderSpan.textContent).to.not.include('outside VA');
        }
      });
    });
  });

  describe('noActionNeeded property', () => {
    const futureSuspenseDate = fiveMonthsFromNowSuspenseDate;

    const noActionNeededTestCases = [
      {
        name: 'hides upload suggestion when item.noActionNeeded is true',
        displayName: 'PMR Pending',
        noActionNeeded: true,
        expectUploadSuggestion: false,
      },
      {
        name: 'shows upload suggestion when item has no noActionNeeded',
        displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
        noActionNeeded: undefined,
        expectUploadSuggestion: true,
      },
      {
        name:
          'shows upload suggestion when item has no noActionNeeded (unknown type)',
        displayName: 'Unknown third party type',
        noActionNeeded: undefined,
        expectUploadSuggestion: true,
      },
    ];

    noActionNeededTestCases.forEach(testCase => {
      it(testCase.name, () => {
        const item = {
          id: 308,
          displayName: testCase.displayName,
          status: 'NEEDED_FROM_OTHERS',
          requestedDate: '2025-12-01',
          suspenseDate: futureSuspenseDate,
          canUploadFile: true,
          noActionNeeded: testCase.noActionNeeded,
        };

        const { queryByText } = renderWithReduxAndRouter(
          <ThirdPartyRequestPage {...defaultProps} item={item} />,
          { initialState },
        );

        const uploadSuggestion = queryByText(
          /if you have documents related to this request, uploading them/i,
        );
        if (testCase.expectUploadSuggestion) {
          expect(uploadSuggestion).to.exist;
        } else {
          expect(uploadSuggestion).to.not.exist;
        }
      });
    });
  });
});
