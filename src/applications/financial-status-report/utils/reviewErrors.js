import { ERROR_MAPPING, errorMessages } from '../constants/errorMessages';

const _override = (error, fullError) => {
  if (!error) {
    return null;
  }

  const errorKey = error.includes('selectedDebtsAndCopays')
    ? 'selectedDebtsAndCopays'
    : error.split('.').pop();

  if (ERROR_MAPPING[errorKey]) {
    return ERROR_MAPPING[errorKey];
  }

  if (fullError?.__errors?.some(str => str.includes('resolution amount'))) {
    return {
      chapterKey: 'resolutionOptionsChapter',
      pageKey: 'resolutionComment',
    };
  }

  return null;
};

export default {
  ...errorMessages,
  _override,
};
