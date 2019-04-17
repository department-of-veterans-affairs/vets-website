import redirectToClaimTypePage from './01-require-claim-type';
import convertCountryCode from './02-convert-country-code';
import upgradeHasSeparationPay from './03-upgrade-hasSeparationPay';

// We launched at version 1 and not version 0, so the first _real_ migration is at
//  migrations[1]
// NOTE: This will probably just get skipped over, but it's here to be safe
const emptyMigration = savedData => savedData;

export default [
  emptyMigration,
  redirectToClaimTypePage,
  convertCountryCode,
  upgradeHasSeparationPay,
];
