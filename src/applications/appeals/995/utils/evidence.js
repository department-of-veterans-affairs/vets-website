import { getIssueName, getSelected } from '../../shared/utils/issues';
import {
  FORMAT_COMPACT_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
} from '../../shared/constants';
import { parseDate } from '../../shared/utils/dates';
import { getPrivateEvidence, getVAEvidence } from './form-data-retrieval';
import numberToWords from './number-to-words';

export const hasErrors = errors =>
  Object.values(errors).filter(err => (Array.isArray(err) ? err.length : err))
    .length;

export const getIndex = (data, testingIndex, testSearch) => {
  // get index from url '/{path}?index={index}' or testingIndex
  const searchIndex = new URLSearchParams(testSearch || window.location.search);
  let index = parseInt(searchIndex.get('index') || testingIndex || '0', 10);
  if (Number.isNaN(index)) {
    index = 0;
  } else if (index > data.length) {
    index = data.length;
  }
  return index;
};

// Update evidence issues if they change
export const evidenceNeedsUpdating = formData => {
  let needsUpdate = false;
  const selectedIssues = getSelected(formData).map(getIssueName);
  const iterator = ({ issues }) =>
    (issues || []).every(issue => selectedIssues.includes(issue));

  const locations = getVAEvidence(formData);
  const facility = getPrivateEvidence(formData);
  if (locations.length > 0) {
    needsUpdate = !locations.every(iterator);
  }
  if (!needsUpdate && facility.length > 0) {
    needsUpdate = !facility.every(iterator);
  }
  return needsUpdate;
};

/**
 * Remove non-selected issues from VA locations and private facilities
 * Needed in case issues are added or changed on the review & submit page. The
 * evidence entries need to be auto-updated
 * @param {Object} data - form data
 * @returns {Object} - cleaned up data
 */
export const removeNonSelectedIssuesFromEvidence = data => {
  const formData = data || {};
  const selectedIssues = getSelected(formData).map(getIssueName);
  const mapper = obj => ({
    ...obj,
    issues: obj.issues.filter(issue => selectedIssues.includes(issue)),
  });
  return {
    ...formData,
    locations: getVAEvidence(formData).map(mapper),
    providerFacility: getPrivateEvidence(formData).map(mapper),
  };
};

export const getAddOrEditMode = () => {
  const search = new URLSearchParams(window.location.search);
  return search.get('edit') === 'true' ? 'edit' : 'add';
};

export const formatDate = (date = '', format = FORMAT_COMPACT_DATE_FNS) =>
  // Use `parse` from date-fns because it is a non-ISO8061 formatted date string
  // const parsedDate = parse(date, FORMAT_YMD_DATE_FNS, new Date());
  parseDate(date, format, FORMAT_YMD_DATE_FNS) || '';

const getContent = (type, numberToWord, addOrEdit, scRedesign = false) => {
  const content = {
    va: {
      add: `What${numberToWord} VA or military treatment location should we request records from?`,
      // ------- ADJUST when design toggle is removed - we won't need the "Edit" text at the beginning anymore
      edit: `${
        !scRedesign ? 'Edit ' : ''
      }the${numberToWord} VA or military treatment location we should request records from`,
    },
    nonVa: {
      add: `What${numberToWord} location should we request your private provider or VA Vet Center records from?`,
      edit: `${
        !scRedesign ? 'Edit ' : ''
      }the${numberToWord} location we should request your private provider or VA Vet Center records from`,
    },
  };

  return content?.[type]?.[addOrEdit] || '';
};

/**
 * Used to create the titles for the VA and non-VA evidence
 * entry (details) pages. When adding details, the initial provider
 * is not numbered, but subsequent providers are (e.g. "What second location...?")
 * When editing details, all providers are numbered.
 * Full examples:
 *
 * VA provider - add first provider details: "What VA or military treatment location should we request records from?"
 * VA provider - add second provider details: "What second VA or military... (cont'd from above)?"
 * VA provider - edit first provider details: "Edit the first VA or military treatment location"
 * VA provider - edit second provider details: "Edit the second VA or military... (cont'd from above)"
 * @param {string} addOrEdit - "add" or "edit" depending on mode
 * @param {number} index - index of provider being added or edited
 * @param {string} providerType - either "va" or "nonVa" to indicate which type of content we need
 * @param {boolean} scRedesign - whether this is the list & loop flow (content differs slightly)
 * @returns
 */
export const getProviderDetailsTitle = (
  addOrEdit,
  index,
  providerType,
  scRedesign = false,
) => {
  // Add a space before the "first," "20th" etc.
  // to account for when it is blank (below) so we don't
  // have extra spaces in the sentence
  let numberToWord = ` ${numberToWords(index)}`;

  if (addOrEdit === 'add' && index === 1) {
    numberToWord = '';
  }

  return getContent(providerType, numberToWord, addOrEdit, scRedesign);
};

/**
 * Used to create the modal title when deleting a provider entry
 * If locationAndName is provided, it is included in the title.
 * Otherwise, a generic title is returned.
 * @param {string} locationAndName - name of provider location
 * @returns {string} - modal title
 */
export const getProviderModalDeleteTitle = locationAndName => {
  if (typeof locationAndName === 'string' && locationAndName) {
    return `Do you want to keep ${locationAndName}?`;
  }

  return `Do you want to keep this location?`;
};

/**
 * Used to determine which issue checkboxes were selected
 * in the array builder flow
 * @param {Object} issues e.g. { Hypertension: true, Tendonitis: undefined }
 * @returns ['Hypertension']
 */
export const getSelectedIssues = issues => {
  if (!issues) {
    return null;
  }

  return Object.keys(issues).filter(issue => issues[issue]);
};
