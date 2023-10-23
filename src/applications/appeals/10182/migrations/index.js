import renameContestedIssues from './01-rename-contested-issues';

// We launched at version 1 and not version 0, so the first _real_ migration is
// at migrations[1]
// NOTE: This will probably just get skipped over, but it's here to be safe
const emptyMigration = savedData => savedData;

export default [emptyMigration, renameContestedIssues];
