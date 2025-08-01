import start from './start';

// Veteran Path Imports
import isVeteran from './veteran/isVeteran';
import noHonorableDischarge from './veteran/01-noHonorableDischarge';
import yesHonorableDischarge from './veteran/01-yesHonorableDischarge';
import yesDisabilityRating from './veteran/02-yesDisabilityRating';
import noDisabilityRating from './veteran/02-noDisabilityRating';

// Service Member Path Imports
import isServiceMember from './service-member/isServiceMember';
import noHonorableDischargeSM from './service-member/01-noHonorableDischarge';
import yesHonorableDischargeSM from './service-member/01-yesHonorableDischarge';
import noVaMemorandum from './service-member/02-noVaMemorandum';
import yesVaMemorandum from './service-member/02-yesVaMemorandum';
import noIDES from './service-member/03-noIDES';
import yesIDES from './service-member/03-yesIDES';

// Other Path Imports
import isOther from './other/isOther';

export default [
  start,
  isVeteran,
  isServiceMember,
  isOther,
  noHonorableDischarge,
  yesHonorableDischarge,
  yesDisabilityRating,
  noDisabilityRating,
  noHonorableDischargeSM,
  yesHonorableDischargeSM,
  noVaMemorandum,
  yesVaMemorandum,
  noIDES,
  yesIDES,
];
