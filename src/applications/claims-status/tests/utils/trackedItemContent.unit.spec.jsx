import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  getFilesNeeded,
  getFilesOptional,
  getFailedSubmissionsWithinLast30Days,
  truncateDescription,
  formatDescription,
  hasBeenReviewed,
  itemsNeedingAttentionFromVet,
  isAutomated5103Notice,
  isStandard5103Notice,
  setDocumentRequestPageTitle,
  getTrackedItemDateFromStatus,
  getTrackedItemDisplayFromSupportingDocument,
  getTrackedItemDisplayNameFromEvidenceSubmission,
  getTrackedItemProperty,
  getIsSensitive,
  getIsDBQ,
  getNoActionNeeded,
  getIsProperNoun,
  getNoProvidePrefix,
} from '../../utils/trackedItemContent';

describe('Tracked Item Content helpers:', () => {
  describe('truncateDescription', () => {
    context(' when default - maxlength is 120', () => {
      it('should truncate text longer than 120 characters', () => {
        const userText =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';
        const userTextEllipsed =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq…';

        const text = truncateDescription(userText);
        expect(text).to.equal(userTextEllipsed);
      });
    });
    context('when maxlength is 200', () => {
      it('should truncate text longer than 200 characters', () => {
        const userText =
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu quis nostrud exercitation ullamco laboris';
        const userTextEllipsed =
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu…';

        const text = truncateDescription(userText, 200);
        expect(text).to.equal(userTextEllipsed);
      });
    });
  });

  describe('formatDescription', () => {
    context('when text is null, undefined, empty, or not a string', () => {
      [
        { input: null, name: 'null input' },
        { input: undefined, name: 'undefined input' },
        { input: '', name: 'empty string' },
        { input: '   ', name: 'whitespace-only string' },
        { input: 123, name: 'number input' },
        { input: {}, name: 'object input' },
        { input: [], name: 'array input' },
      ].forEach(({ input, name }) => {
        it(`should return null for ${name}`, () => {
          expect(formatDescription(input)).to.be.null;
        });
      });
    });

    context('when text has no special formatting', () => {
      it('should wrap plain text in a paragraph element', () => {
        const { container } = render(formatDescription('Simple text'));
        const paragraph = container.querySelector('p');
        expect(paragraph).to.exist;
        expect(paragraph.textContent).to.equal('Simple text');
      });
    });

    context('when text contains newline characters', () => {
      it('should convert actual newlines to new paragraphs', () => {
        const { container } = render(
          formatDescription('Line one\nLine two\nLine three'),
        );
        const paragraph = container.querySelectorAll('p');
        expect(paragraph.length).to.equal(3);
        expect(paragraph[0].textContent).to.equal('Line one');
        expect(paragraph[1].textContent).to.equal('Line two');
        expect(paragraph[2].textContent).to.equal('Line three');
      });
    });

    context('when text contains bold tags ({b}...{/b})', () => {
      it('should convert {b}...{/b} to strong elements', () => {
        const { container } = render(
          formatDescription('This is {b}bold{/b} text'),
        );
        const strongElement = container.querySelector('strong');
        expect(strongElement).to.exist;
        expect(strongElement.textContent).to.equal('bold');
      });

      it('should handle multiple bold sections', () => {
        const { container } = render(
          formatDescription('{b}First{/b} and {b}Second{/b} bold'),
        );
        const strongElements = container.querySelectorAll('strong');
        expect(strongElements.length).to.equal(2);
        expect(strongElements[0].textContent).to.equal('First');
        expect(strongElements[1].textContent).to.equal('Second');
      });

      it('should handle bold text spanning content', () => {
        const { container } = render(
          formatDescription('{b}Entire text is bold{/b}'),
        );
        const strongElement = container.querySelector('strong');
        expect(strongElement).to.exist;
        expect(strongElement.textContent).to.equal('Entire text is bold');
      });
    });

    context('when text contains list markers ([*] or {*})', () => {
      it('should convert [*] markers to list items', () => {
        const { container } = render(
          formatDescription('[*] First item\n[*] Second item\n[*] Third item'),
        );
        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(3);
        expect(listItems[0].textContent).to.equal('First item');
        expect(listItems[1].textContent).to.equal('Second item');
        expect(listItems[2].textContent).to.equal('Third item');
      });

      it('should convert {*} markers to list items', () => {
        const { container } = render(
          formatDescription('{*} First item\n{*} Second item'),
        );
        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(2);
      });

      it('should handle mixed [*] and {*} markers', () => {
        const { container } = render(
          formatDescription('[*] First item\n{*} Second item'),
        );
        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(2);
      });

      it('should handle inline list markers without preceding newlines', () => {
        const { container } = render(
          formatDescription(
            'Required documents:{*} First item{*} Second item{*} Third item',
          ),
        );
        const paragraph = container.querySelector('p');
        expect(paragraph).to.exist;
        expect(paragraph.textContent).to.equal('Required documents:');
        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(3);
        expect(listItems[0].textContent).to.equal('First item');
        expect(listItems[1].textContent).to.equal('Second item');
        expect(listItems[2].textContent).to.equal('Third item');
      });

      it('should handle inline [*] markers without preceding newlines', () => {
        const { container } = render(
          formatDescription('Items:[*] One[*] Two[*] Three'),
        );
        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(3);
      });
    });

    context('when text contains combined formatting', () => {
      it('should handle bold text within list items', () => {
        const { container } = render(
          formatDescription('[*] {b}Bold{/b} item\n[*] Normal item'),
        );
        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(2);
        const strongInFirstItem = listItems[0].querySelector('strong');
        expect(strongInFirstItem).to.exist;
        expect(strongInFirstItem.textContent).to.equal('Bold');
      });

      it('should handle paragraph text before list items', () => {
        const { container } = render(
          formatDescription(
            'Introduction text\n[*] First item\n[*] Second item',
          ),
        );
        const paragraph = container.querySelector('p');
        expect(paragraph).to.exist;
        expect(paragraph.textContent).to.equal('Introduction text');
        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(2);
      });

      it('should handle paragraph text after list items', () => {
        const { container } = render(
          formatDescription(
            '[*] First item\n[*] Second item\n\nConclusion text',
          ),
        );
        const paragraphs = container.querySelectorAll('p');
        expect(paragraphs.length).to.equal(1);
        const list = container.querySelector('ul');
        expect(list).to.exist;
      });

      it('should handle complex mixed content', () => {
        const { container } = render(
          formatDescription(
            '{b}Important:{/b} Please provide the following:\n[*] {b}Document A{/b}\n[*] Document B\n[*] Document C',
          ),
        );
        const paragraph = container.querySelector('p');
        expect(paragraph).to.exist;
        const strongInParagraph = paragraph.querySelector('strong');
        expect(strongInParagraph).to.exist;
        expect(strongInParagraph.textContent).to.equal('Important:');

        const list = container.querySelector('ul');
        expect(list).to.exist;
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.equal(3);
        const strongInListItem = listItems[0].querySelector('strong');
        expect(strongInListItem).to.exist;
        expect(strongInListItem.textContent).to.equal('Document A');
      });
    });
  });

  describe('hasBeenReviewed', () => {
    it('should check that item is reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'ACCEPTED',
      });

      expect(result).to.be.true;
    });

    it('should check that item has not been reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'SUBMITTED_AWAITING_REVIEW',
      });

      expect(result).to.be.false;
    });
  });

  describe('getFilesNeeded', () => {
    context('when useLighthouse is true', () => {
      const useLighthouse = true;
      it('when trackedItems is empty, should return empty array', () => {
        const trackedItems = [];
        const filesNeeded = getFilesNeeded(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when trackedItems exists, should return data', () => {
        const trackedItems = [{ status: 'NEEDED_FROM_YOU' }];
        const filesNeeded = getFilesNeeded(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
    });

    context('when useLighthouse is false', () => {
      const useLighthouse = false;
      it('when eventsTimeline is empty, should return empty array', () => {
        const eventsTimeline = [];
        const filesNeeded = getFilesNeeded(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when eventsTimeline exists, should return data', () => {
        const eventsTimeline = [
          { type: 'still_need_from_you_list', status: 'NEEDED' },
        ];
        const filesNeeded = getFilesNeeded(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
    });
  });

  describe('getFilesOptional', () => {
    context('when useLighthouse is true', () => {
      const useLighthouse = true;
      it('when trackedItems is empty, should return empty array', () => {
        const trackedItems = [];
        const filesNeeded = getFilesOptional(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when trackedItems exists, should return data', () => {
        const trackedItems = [{ status: 'NEEDED_FROM_OTHERS' }];
        const filesNeeded = getFilesOptional(trackedItems, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
    });

    context('when useLighthouse is false', () => {
      const useLighthouse = false;
      it('when eventsTimeline is empty, should return empty array', () => {
        const eventsTimeline = [];
        const filesNeeded = getFilesOptional(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(0);
      });

      it('when eventsTimeline exists, should return data', () => {
        const eventsTimeline = [
          { type: 'still_need_from_others_list', status: 'NEEDED' },
        ];
        const filesNeeded = getFilesOptional(eventsTimeline, useLighthouse);
        expect(filesNeeded.length).to.equal(1);
      });
    });
  });

  describe('getFailedSubmissionsWithinLast30Days', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const createEvidenceSubmission = (options = {}) => ({
      id: 1,
      uploadStatus: 'FAILED',
      acknowledgementDate: tomorrow,
      ...options,
    });

    it('should return empty array when evidenceSubmissions is undefined', () => {
      const result = getFailedSubmissionsWithinLast30Days(undefined);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });

    it('should return empty array when evidenceSubmissions is null', () => {
      const result = getFailedSubmissionsWithinLast30Days(null);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });

    it('should return empty array when there are no failed submissions', () => {
      const evidenceSubmissions = [
        createEvidenceSubmission({ uploadStatus: 'SUCCESS' }),
        createEvidenceSubmission({ id: 2, uploadStatus: 'PENDING' }),
      ];
      const result = getFailedSubmissionsWithinLast30Days(evidenceSubmissions);

      expect(result.length).to.equal(0);
    });

    it('should only return failed submissions within the last 30 days', () => {
      const evidenceSubmissions = [
        createEvidenceSubmission({ id: 4 }),
        createEvidenceSubmission({ id: 3, acknowledgementDate: yesterday }),
        createEvidenceSubmission({ id: 5 }),
      ];
      const result = getFailedSubmissionsWithinLast30Days(evidenceSubmissions);

      expect(result.length).to.equal(2);
      expect(result[0].id).to.equal(4);
      expect(result[1].id).to.equal(5);
    });
  });

  describe('itemsNeedingAttentionFromVet', () => {
    it('should return number of needed items from vet', () => {
      const itemsNeeded = itemsNeedingAttentionFromVet([
        {
          id: 1,
          status: 'NEEDED_FROM_YOU',
        },
        {
          id: 2,
          status: 'SUBMITTED_AWAITING_REVIEW',
        },
        {
          id: 3,
          status: 'NEEDED_FROM_OTHERS',
        },
      ]);

      expect(itemsNeeded).to.equal(1);
    });
  });

  describe('setDocumentRequestPageTitle', () => {
    it('should display 5103 Evidence Notice', () => {
      const displayName = 'Automated 5103 Notice Response';
      const documentRequestPageTitle = setDocumentRequestPageTitle(displayName);

      expect(documentRequestPageTitle).to.equal(
        'Review evidence list (5103 notice)',
      );
    });
    it('should display Submit buddy statement(s)', () => {
      const displayName = 'Submit buddy statement(s)';
      const documentRequestPageTitle = setDocumentRequestPageTitle(displayName);

      expect(documentRequestPageTitle).to.equal(displayName);
    });
  });

  describe('getTrackedItemDateFromStatus', () => {
    context('when item status is NEEDED_FROM_YOU', () => {
      it('should return item requestedDate', () => {
        const item = {
          id: 1,
          requestedDate: '2023-02-22',
          status: 'NEEDED_FROM_YOU',
          displayName: 'Test',
        };
        const date = getTrackedItemDateFromStatus(item);

        expect(date).to.equal(item.requestedDate);
      });
    });
    context('when item status is NEEDED_FROM_OTHERS', () => {
      it('should return item requestedDate', () => {
        const item = {
          id: 1,
          requestedDate: '2023-02-22',
          status: 'NEEDED_FROM_OTHERS',
          displayName: 'Test',
        };
        const date = getTrackedItemDateFromStatus(item);

        expect(date).to.equal(item.requestedDate);
      });
    });
    context('when item status is NO_LONGER_REQUIRED', () => {
      it('should return item requestedDate', () => {
        const item = {
          id: 1,
          closedDate: '2023-02-22',
          status: 'NO_LONGER_REQUIRED',
          displayName: 'Test',
        };
        const date = getTrackedItemDateFromStatus(item);

        expect(date).to.equal(item.closedDate);
      });
    });
    context('when item status is SUBMITTED_AWAITING_REVIEW', () => {
      it('should return the oldest item.documents.uploadDate requestedDate', () => {
        const item = {
          id: 1,
          date: '2023-02-22',
          status: 'SUBMITTED_AWAITING_REVIEW',
          displayName: 'Test',
          documents: [
            {
              documentId: '{1}',
              documentTypeLabel: 'Correspondence',
              originalFileName: 'file.pdf',
              trackedItemId: 1,
              uploadDate: '2023-02-23',
            },
            {
              documentId: '{2}',
              documentTypeLabel: 'Correspondence',
              originalFileName: 'file2.pdf',
              trackedItemId: 1,
              uploadDate: '2023-02-20',
            },
          ],
        };
        const date = getTrackedItemDateFromStatus(item);

        expect(date).to.equal(item.documents[1].uploadDate);
      });
    });
    context('when item status is INITIAL_REVIEW_COMPLETE', () => {
      it('should return item receivedDate', () => {
        const item = {
          id: 1,
          receivedDate: '2023-02-22',
          status: 'INITIAL_REVIEW_COMPLETE',
          displayName: 'Test',
        };
        const date = getTrackedItemDateFromStatus(item);

        expect(date).to.equal(item.receivedDate);
      });
    });
    context('when item status is ACCEPTED', () => {
      it('should return item receivedDate', () => {
        const item = {
          id: 1,
          receivedDate: '2023-02-22',
          status: 'ACCEPTED',
          displayName: 'Test',
        };
        const date = getTrackedItemDateFromStatus(item);

        expect(date).to.equal(item.receivedDate);
      });
    });
    context('when item status is not recognized', () => {
      it('should return the default item requestedDate', () => {
        const item = {
          id: 1,
          requestedDate: '2023-02-22',
          status: 'TEST',
          displayName: 'Test',
        };
        const date = getTrackedItemDateFromStatus(item);

        expect(date).to.equal(item.requestedDate);
      });
    });
  });

  describe('isStandard5103Notice', () => {
    context('when display name is not a standard 5103 notice', () => {
      it('should return false', () => {
        const displayName = 'Test';
        expect(isStandard5103Notice(displayName)).to.be.false;
      });
    });
    context('when display name is a standard 5103 notice from the API', () => {
      it('should return true', () => {
        const displayName = '5103 Notice Response';
        expect(isStandard5103Notice(displayName)).to.be.true;
      });
    });
    // See comment above the standard5103Item in constants.js
    context(
      'when display name is a standard 5103 notice mocked by the application',
      () => {
        it('should return true', () => {
          const displayName = 'Review evidence list (5103 notice)';
          expect(isStandard5103Notice(displayName)).to.be.true;
        });
      },
    );
  });

  describe('isAutomated5103Notice', () => {
    context('when display name is not an automated 5103 notice', () => {
      it('should return false', () => {
        const displayName = 'Test';
        expect(isAutomated5103Notice(displayName)).to.be.false;
      });
    });
    context('when display name is an automated 5103 notice', () => {
      it('should return true', () => {
        const displayName = 'Automated 5103 Notice Response';
        expect(isAutomated5103Notice(displayName)).to.be.true;
      });
    });
  });

  describe('getTrackedItemDisplayFromSupportingDocument', () => {
    context('when the id is present', () => {
      it('should return the friendlyName when it is present', () => {
        const document = {
          id: '123',
          friendlyName: 'Medical Records',
          displayName: 'Submit Medical Records',
        };
        const result = getTrackedItemDisplayFromSupportingDocument(document);

        expect(result).to.equal('Medical Records');
      });

      it('should return the displayName when the friendlyName is not present', () => {
        const document = {
          id: '123',
          displayName: 'Submit Medical Records',
        };
        const result = getTrackedItemDisplayFromSupportingDocument(document);

        expect(result).to.equal('Submit Medical Records');
      });

      it("should return 'unknown' when neither friendlyName nor displayName are present", () => {
        const document = {
          id: '123',
        };
        const result = getTrackedItemDisplayFromSupportingDocument(document);

        expect(result).to.equal('unknown');
      });
    });

    context('when the id is not present', () => {
      it('should return null', () => {
        const document = {
          friendlyName: 'Medical Records',
        };
        const result = getTrackedItemDisplayFromSupportingDocument(document);

        expect(result).to.equal(null);
      });
    });
  });

  describe('getTrackedItemDisplayNameFromEvidenceSubmission', () => {
    context('when the trackedItemId is present', () => {
      it('should return the trackedItemFriendlyName when it is present', () => {
        const evidenceSubmission = {
          trackedItemId: 123,
          trackedItemFriendlyName: 'Authorization to Disclose Information',
          trackedItemDisplayName: '21-4142/21-4142a',
        };
        const result = getTrackedItemDisplayNameFromEvidenceSubmission(
          evidenceSubmission,
        );

        expect(result).to.equal('Authorization to Disclose Information');
      });

      it('should return the trackedItemDisplayName when the trackedItemFriendlyName is not present', () => {
        const evidenceSubmission = {
          trackedItemId: 123,
          trackedItemDisplayName: '21-4142/21-4142a',
        };
        const result = getTrackedItemDisplayNameFromEvidenceSubmission(
          evidenceSubmission,
        );

        expect(result).to.equal('21-4142/21-4142a');
      });

      it("should return 'unknown' when neither trackedItemFriendlyName nor trackedItemDisplayName are present", () => {
        const evidenceSubmission = {
          trackedItemId: 123,
        };
        const result = getTrackedItemDisplayNameFromEvidenceSubmission(
          evidenceSubmission,
        );

        expect(result).to.equal('unknown');
      });
    });

    context('when the trackedItemId is not present', () => {
      it('should return null', () => {
        const evidenceSubmission = {
          trackedItemFriendlyName: 'Authorization to Disclose Information',
        };
        const result = getTrackedItemDisplayNameFromEvidenceSubmission(
          evidenceSubmission,
        );

        expect(result).to.equal(null);
      });
    });
  });

  describe('getTrackedItemProperty', () => {
    context('when the API provides the property', () => {
      it('should return a boolean value', () => {
        const item = { displayName: 'Test Item', isSensitive: true };

        expect(getTrackedItemProperty(item, 'isSensitive')).to.be.true;
      });
    });

    context('when the API does not provide the property', () => {
      it('should fall back to the evidenceDictionary', () => {
        const item = { displayName: 'ASB - tell us where, when, how exposed' };

        expect(getTrackedItemProperty(item, 'isSensitive')).to.be.true;
      });

      it('should return false for entries not defined in the evidenceDictionary', () => {
        const item = { displayName: 'Unknown item' };

        expect(getTrackedItemProperty(item, 'isSensitive')).to.be.false;
      });

      it('should return false for item properties not defined in the evidenceDictionary', () => {
        const item = { displayName: '21-4142/21-4142a' };

        expect(getTrackedItemProperty(item, 'isSensitive')).to.be.false;
      });
    });

    context('when item is null or undefined', () => {
      it('should return false for null item', () => {
        expect(getTrackedItemProperty(null, 'isSensitive')).to.be.false;
      });
    });
  });

  const booleanPropertyHelpers = [
    {
      name: 'getIsSensitive',
      fn: getIsSensitive,
      property: 'isSensitive',
      apiValue: true,
      displayName: 'ASB - tell us where, when, how exposed',
      evidenceDictionaryValue: true,
    },
    {
      name: 'getNoActionNeeded',
      fn: getNoActionNeeded,
      property: 'noActionNeeded',
      apiValue: false,
      displayName: 'DBQ PSYCH PTSD initial',
      evidenceDictionaryValue: true,
    },
    {
      name: 'getIsProperNoun',
      fn: getIsProperNoun,
      property: 'isProperNoun',
      apiValue: true,
      displayName: 'Employment info needed',
      evidenceDictionaryValue: false,
    },
    {
      name: 'getNoProvidePrefix',
      fn: getNoProvidePrefix,
      property: 'noProvidePrefix',
      apiValue: false,
      displayName: 'Clarification of Claimed Issue',
      evidenceDictionaryValue: true,
    },
  ];

  booleanPropertyHelpers.forEach(
    ({
      name,
      fn,
      property,
      apiValue,
      displayName,
      evidenceDictionaryValue,
    }) => {
      describe(name, () => {
        it(`should return a boolean value when API provides ${property}`, () => {
          const item = { displayName, [property]: apiValue };

          expect(fn(item)).to.equal(apiValue);
        });

        it(`should fall back to the evidenceDictionary when API does not provide ${property}`, () => {
          const item = { displayName };

          expect(fn(item)).to.equal(evidenceDictionaryValue);
        });
      });
    },
  );

  describe('getIsDBQ', () => {
    context('when API provides isDBQ', () => {
      it('should return a boolean value', () => {
        const item = { displayName: 'Test', isDBQ: true };

        expect(getIsDBQ(item)).to.be.true;
      });
    });

    context('when API does not provide isDBQ', () => {
      it('should return true for DBQ items in the evidenceDictionary', () => {
        const item = { displayName: 'DBQ PSYCH PTSD initial' };

        expect(getIsDBQ(item)).to.be.true;
      });

      it('should return false for non-DBQ items that do not contain dbq in the displayName', () => {
        const item = { displayName: 'Employment info needed' };

        expect(getIsDBQ(item)).to.be.false;
      });
    });

    context('string matching fallback', () => {
      it('should return true when displayName contains "DBQ" (case-insensitive)', () => {
        const item = { displayName: 'Some New DBQ Exam Request' };

        expect(getIsDBQ(item)).to.be.true;
      });

      it('should return true even when isDBQ is undefined but the displayName contains DBQ', () => {
        const item = { displayName: 'Some DBQ exam type' };

        expect(getIsDBQ(item)).to.be.true;
      });
    });
  });
});
