import start from './start';
import appeals from './appeals';
import bdd from './bdd';
import fileClaim from './file-claim';
import disagreeing from './disagreeing';
import decisionReview from './decision-review';
import fileAppeal from './file-appeal';
import disagreeFileClaim from './disagree-file-claim';

export default [
  start,
  appeals,
  bdd,
  fileClaim,
  disagreeing,
  decisionReview,
  fileAppeal,
  disagreeFileClaim,
];

export const pageNames = {
  start: 'start',
  appeals: 'appeals',
  bdd: 'bdd',
  fileClaim: 'file-claim',
  disagreeing: 'disagreeing',
  decisionReview: 'decision-review',
  fileAppeal: 'file-appeal',
  disagreeFileClaim: 'disagree-file-claim',
};
