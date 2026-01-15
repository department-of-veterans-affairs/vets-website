export const PAGE_TITLE = 'Add or remove dependents on VA benefits';
// Tried to use platform/utilities/data/titleCase on the PAGE_TITLE, but it
// makes "Or" lowercase
export const DOC_TITLE = 'Add or remove dependents on VA benefits';

export const TASK_KEYS = {
  addChild: 'addChild',
  addDisabledChild: 'addDisabledChild',
  addSpouse: 'addSpouse',
  reportDivorce: 'reportDivorce',
  reportDeath: 'reportDeath',
  reportStepchildNotInHousehold: 'reportStepchildNotInHousehold',
  reportMarriageOfChildUnder18: 'reportMarriageOfChildUnder18',
  reportChild18OrOlderIsNotAttendingSchool:
    'reportChild18OrOlderIsNotAttendingSchool',
  report674: 'report674',
};

export const MARRIAGE_TYPES = {
  ceremonial: 'CEREMONIAL',
  civil: 'CIVIL',
  commonLaw: 'COMMON-LAW',
  tribal: 'TRIBAL',
  proxy: 'PROXY',
  other: 'OTHER',
};

export const SERVER_ERROR_REGEX = /^5\d{2}$/;
export const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const NETWORTH_VALUE = '163,699';

export const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';
export const FORMAT_COMPACT_DATE_FNS = 'MMM d, yyyy';
export const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';

export const PICKLIST_DATA = 'view:removeDependentPickList';
export const PICKLIST_PATHS = 'view:removeDependentPaths';

export const PICKLIST_EDIT_REVIEW_FLAG = 'editFromReviewPage';
