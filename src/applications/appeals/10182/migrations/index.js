import renameContestedIssues from './01-rename-contested-issues';
import redirectToV2Questions from './02-redirect-to-v2-questions';

import { SHOW_PART3_STORAGE } from '../constants';

// We launched at version 1 and not version 0, so the first _real_ migration is
// at migrations[1]
// NOTE: This will probably just get skipped over, but it's here to be safe
const emptyMigration = savedData => savedData;

const migrations = [emptyMigration, renameContestedIssues];

if (window.sessionStorage.getItem(SHOW_PART3_STORAGE) === 'true') {
  migrations.push(redirectToV2Questions);
}

export default migrations;
