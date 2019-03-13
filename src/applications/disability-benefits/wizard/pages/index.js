import start from './start';
import appeals from './appeals';
import bdd from './bdd';
import fileClaim from './file-claim';
import disagreeing from './disagreeing';
import decisionReview from './decision-review';
import fileAppeal from './file-appeal';
import disagreeFileClaim from './disagree-file-claim';

export const pageNames = {
  start: start.name,
  appeals: appeals.name,
  bdd: bdd.name,
  fileClaim: fileClaim.name,
  disagreeing: disagreeing.name,
  decisionReview: decisionReview.name,
  fileAppeal: fileAppeal.name,
  disagreeFileClaim: disagreeFileClaim.name,
};

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
