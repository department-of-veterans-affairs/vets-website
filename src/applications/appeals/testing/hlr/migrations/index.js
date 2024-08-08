import lighthouseVersion2Updates from './01-lighthouse-v2-updates';
import repPhoneFix from './02-rep-phone-fix';

// We launched at version 1 and not version 0, so the first _real_ migration is
// at migrations[1]
// NOTE: This will probably just get skipped over, but it's here to be safe
export const emptyMigration = savedData => savedData;

export default [emptyMigration, lighthouseVersion2Updates, repPhoneFix];
