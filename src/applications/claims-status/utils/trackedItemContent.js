import React from 'react';
import { scrubDescription, setDocumentTitle } from './helpers';
import { standard5103Item } from '../constants';
import { evidenceDictionary } from './evidenceDictionary';

/**
 * @param {Object} item
 * @param {string} propertyName
 * @returns {boolean}
 */
export const getTrackedItemProperty = (item, propertyName) => {
  if (!item) return false;

  if (item[propertyName] !== undefined) {
    return item[propertyName];
  }

  return !!evidenceDictionary[item.displayName]?.[propertyName];
};

/**
 * @param {Object} item
 * @returns {boolean}
 */
export const getIsSensitive = item =>
  getTrackedItemProperty(item, 'isSensitive');

/**
 * @param {Object} item
 * @returns {boolean}
 */
export const getIsDBQ = item =>
  getTrackedItemProperty(item, 'isDBQ') ||
  item?.displayName?.toLowerCase().includes('dbq');

/**
 * @param {Object} item
 * @returns {boolean}
 */
export const getNoActionNeeded = item =>
  getTrackedItemProperty(item, 'noActionNeeded');

/**
 * @param {Object} item
 * @returns {boolean}
 */
export const getIsProperNoun = item =>
  getTrackedItemProperty(item, 'isProperNoun');

/**
 * @param {Object} item
 * @returns {boolean}
 */
export const getNoProvidePrefix = item =>
  getTrackedItemProperty(item, 'noProvidePrefix');

/**
 * @param {Object} trackedItem
 * @returns {boolean}
 */
export const hasBeenReviewed = trackedItem => {
  const reviewedStatuses = ['INITIAL_REVIEW_COMPLETE', 'ACCEPTED'];
  return reviewedStatuses.includes(trackedItem.status);
};

/**
 * Covers two cases:
 *   1. Standard 5103s we get back from the API (only occurs when they're closed).
 *   2. Standard 5103s that we're mocking within our application logic.
 * @param {string} displayName
 * @returns {boolean}
 */
export const isStandard5103Notice = displayName =>
  displayName === '5103 Notice Response' ||
  displayName === standard5103Item.displayName;

/**
 * @param {string} displayName
 * @returns {boolean}
 */
export const isAutomated5103Notice = displayName =>
  displayName === 'Automated 5103 Notice Response';

/**
 * @param {string} displayName
 * @returns {boolean}
 */
export const is5103Notice = displayName =>
  isAutomated5103Notice(displayName) || isStandard5103Notice(displayName);

/**
 * @param {Object} item
 * @returns {string}
 */
export const getDisplayFriendlyName = item => {
  if (!getIsProperNoun(item)) {
    let updatedFriendlyName = item.friendlyName;
    updatedFriendlyName =
      updatedFriendlyName.charAt(0).toLowerCase() +
      updatedFriendlyName.slice(1);
    return updatedFriendlyName;
  }
  return item.friendlyName;
};

/**
 * @param {Object} trackedItem
 * @returns {string}
 */
export const getLabel = trackedItem => {
  if (isAutomated5103Notice(trackedItem?.displayName)) {
    return trackedItem?.displayName;
  }
  if (getIsSensitive(trackedItem)) {
    return 'Request for evidence';
  }
  if (trackedItem?.friendlyName && trackedItem?.status === 'NEEDED_FROM_YOU') {
    return trackedItem.friendlyName;
  }
  if (!trackedItem?.friendlyName && trackedItem?.status === 'NEEDED_FROM_YOU') {
    return 'Request for evidence';
  }
  if (getIsDBQ(trackedItem)) {
    return 'Request for an exam';
  }
  if (trackedItem?.friendlyName) {
    return `Your ${getDisplayFriendlyName(trackedItem)}`;
  }
  return 'Request for evidence outside VA';
};

/**
 * @param {Object} item
 * @returns {string|null}
 */
// START lighthouse_migration
export const getTrackedItemDate = item =>
  item.closedDate || item.receivedDate || item.requestedDate;
// END lighthouse_migration

/**
 * Used to get the oldest document date
 * Logic used in getTrackedItemDateFromStatus()
 * @param {Object} item
 * @returns {string|null}
 */
export const getOldestDocumentDate = item => {
  const arrDocumentDates = item.documents.map(document => document.uploadDate);
  return arrDocumentDates.sort()[0]; // Tried to do Math.min() here and it was erroring out
};

/**
 * Logic here uses a given tracked items status to determine what the date should be.
 * This logic is used in RecentActivity and on the ClaimStatusHeader
 * @param {Object} item
 * @returns {string|null}
 */
export const getTrackedItemDateFromStatus = item => {
  switch (item.status) {
    case 'NEEDED_FROM_YOU':
    case 'NEEDED_FROM_OTHERS':
      return item.requestedDate;
    case 'NO_LONGER_REQUIRED':
      return item.closedDate;
    case 'SUBMITTED_AWAITING_REVIEW':
      return getOldestDocumentDate(item);
    case 'INITIAL_REVIEW_COMPLETE':
    case 'ACCEPTED':
      return item.receivedDate;
    default:
      return item.requestedDate;
  }
};

/**
 * @param {Array} trackedItems
 * @param {boolean} useLighthouse
 * @returns {Array}
 */
export const getFilesNeeded = (trackedItems, useLighthouse = true) => {
  // trackedItems are different between lighthouse and evss
  // Therefore we have to filter them differntly
  if (useLighthouse) {
    return trackedItems.filter(item => item.status === 'NEEDED_FROM_YOU');
  }

  return trackedItems.filter(
    event =>
      event.status === 'NEEDED' && event.type === 'still_need_from_you_list',
  );
};

/**
 * @param {Array} trackedItems
 * @param {boolean} useLighthouse
 * @returns {Array}
 */
export const getFilesOptional = (trackedItems, useLighthouse = true) => {
  // trackedItems are different between lighthouse and evss
  // Therefore we have to filter them differntly
  if (useLighthouse) {
    return trackedItems.filter(item => item.status === 'NEEDED_FROM_OTHERS');
  }

  return trackedItems.filter(
    event =>
      event.status === 'NEEDED' && event.type === 'still_need_from_others_list',
  );
};

/**
 * @param {Array} items
 * @returns {number}
 */
export const itemsNeedingAttentionFromVet = items =>
  items?.filter(item => item.status === 'NEEDED_FROM_YOU').length;

/**
 * Formats description text from VBMS/vets-api by converting special formatting codes
 * to React elements:
 * - \n → separate paragraphs (<p>) for text-only content
 * - [*] or {*} → unordered list items (<ul><li>)
 * - {b}...{/b} → bold text (<strong>)
 *
 * @param {string} text - The raw description text from the API
 * @returns {React.ReactNode} - Formatted React elements, or null if no text
 */
export const formatDescription = text => {
  if (!text || typeof text !== 'string') return null;

  const trimmedText = text.trim();
  if (!trimmedText) return null;

  // Normalize inline list markers by inserting a newline before any [*] or {*}
  // that doesn't already have one (handles cases where markers appear mid-line)
  const normalizedText = trimmedText.replace(
    /(?<!^)(?<!\n)(\[\*\]|\{\*\})/g,
    '\n$1',
  );

  // Helper to process bold tags within a text segment
  const processBoldTags = (segment, keyPrefix) => {
    const boldPattern = /\{b\}([\s\S]*?)\{\/b\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let partIndex = 0;

    // eslint-disable-next-line no-cond-assign
    while ((match = boldPattern.exec(segment)) !== null) {
      if (match.index > lastIndex) {
        parts.push(segment.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`${keyPrefix}-bold-${partIndex}`}>{match[1]}</strong>,
      );
      lastIndex = match.index + match[0].length;
      partIndex += 1;
    }

    if (lastIndex < segment.length) {
      parts.push(segment.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [segment];
  };

  // Helper to add regular text line to paragraph content
  const addTextLine = (content, line, lineIndex) => {
    if (content.length > 0) {
      content.push(<br key={`br-${lineIndex}`} />);
    }
    content.push(...processBoldTags(line, `line-${lineIndex}`));
  };

  // Split text into lines for processing
  const lines = normalizedText.split('\n');

  // Check if we have list items
  const listItemPattern = /^[\s]*(?:\[\*\]|\{\*\})[\s]*/;
  const hasListItems = lines.some(line => listItemPattern.test(line));

  // Unified processing approach
  const result = [];
  let currentListItems = [];
  let paragraphContent = [];
  let elementIndex = 0;

  const flushParagraph = () => {
    if (paragraphContent.length > 0) {
      result.push(<p key={`p-${elementIndex}`}>{paragraphContent}</p>);
      paragraphContent = [];
      elementIndex += 1;
    }
  };

  const flushList = () => {
    if (currentListItems.length > 0) {
      result.push(<ul key={`ul-${elementIndex}`}>{currentListItems}</ul>);
      currentListItems = [];
      elementIndex += 1;
    }
  };

  lines.forEach((line, lineIndex) => {
    if (listItemPattern.test(line)) {
      // This is a list item
      flushParagraph();
      const itemText = line.replace(listItemPattern, '').trim();
      currentListItems.push(
        <li key={`li-${lineIndex}`}>
          {processBoldTags(itemText, `li-${lineIndex}`)}
        </li>,
      );
    } else if (line.trim() === '' && hasListItems) {
      // Empty line - only flush when we have lists (otherwise ignore)
      flushList();
      flushParagraph();
    } else if (line.trim() !== '') {
      // Regular text line
      flushList();
      addTextLine(paragraphContent, line, lineIndex);
      // When there are no list items, each line gets its own paragraph
      if (!hasListItems) {
        flushParagraph();
      }
    }
  });

  // Flush any remaining content
  flushList();
  flushParagraph();

  // Return single paragraph or array of elements
  return result.length === 1 ? result[0] : result;
};

/**
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateDescription = (text, maxLength = 120) => {
  if (text && text.length > maxLength) {
    return `${text.substr(0, maxLength)}…`;
  }
  return scrubDescription(text);
};

/**
 * Use this function to set the Document Request Page Title, Page Tab and Page Breadcrumb Title
 * It is also used to set the Document Request Page breadcrumb text
 * @param {string} displayName
 * @returns {string}
 */
export const setDocumentRequestPageTitle = displayName =>
  isAutomated5103Notice(displayName)
    ? 'Review evidence list (5103 notice)'
    : displayName;

/**
 * @param {Object} trackedItem
 * @returns {void}
 */
export const setPageTitle = trackedItem => {
  if (trackedItem) {
    const pageTitle = setDocumentRequestPageTitle(getLabel(trackedItem));
    setDocumentTitle(pageTitle);
  } else {
    setDocumentTitle('Document Request');
  }
};

/**
 * Gets the display name for a supporting document
 * Supporting documents are documents that have been successfully created in Lighthouse and have an id.
 * These represent documents that exist in the VA's backend system.
 * @param {Object} document - Supporting document object with id
 * @returns {string|null} Friendly name, display name, 'unknown', or null if no id
 */
export const getTrackedItemDisplayFromSupportingDocument = document => {
  if (document.id) {
    return document.friendlyName || document.displayName || 'unknown';
  }
  return null;
};

/**
 * @param {string} displayName
 * @returns {React.ReactNode}
 */
export const renderDefaultThirdPartyMessage = displayName =>
  displayName.toLowerCase().includes('dbq') ? (
    <>
      We’ve requested an exam related to your claim. The examiner’s office will
      contact you to schedule this appointment.
      <br />
    </>
  ) : (
    <>
      <strong>You don’t need to do anything.</strong> We asked someone outside
      VA for documents related to your claim.
      <br />
    </>
  );

/**
 * @param {Object} item
 * @returns {React.ReactNode}
 */
export const renderOverrideThirdPartyMessage = item => {
  if (getIsDBQ(item)) {
    return item.shortDescription || item.activityDescription;
  }

  if (item.shortDescription) {
    return (
      <>
        <strong>You don’t need to do anything.</strong> {item.shortDescription}
      </>
    );
  }
  return item.activityDescription;
};
