import redirectToClaimTypePage from './01-require-claim-type';
import convertCountryCode from './02-convert-country-code';
import upgradeHasSeparationPay from './03-upgrade-hasSeparationPay';
import truncateOtherHomelessHousing from './04-truncate-otherHomelessHousing';
import truncateOtherAtRiskHousing from './05-truncate-otherAtRiskHousing';
import fixTreatedDisabilityNamesKey from './06-fix-treatedDisabilityNames';
import mapServiceBranches from './07-map-service-branches';
import reorderHousingIllnessRemoveFdc from './08-paper-sync';

// We launched at version 1 and not version 0, so the first _real_ migration is at
//  migrations[1]
// NOTE: This will probably just get skipped over, but it's here to be safe
const emptyMigration = savedData => savedData;

const migrations = [
  emptyMigration,
  redirectToClaimTypePage,
  convertCountryCode,
  upgradeHasSeparationPay,
  truncateOtherHomelessHousing,
  truncateOtherAtRiskHousing,
  fixTreatedDisabilityNamesKey,
  mapServiceBranches,
  reorderHousingIllnessRemoveFdc,
];

export default migrations;
