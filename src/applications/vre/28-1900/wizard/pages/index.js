import start from './start';

// Veteran Path Imports
import amVeteran from './veteran/amVeteran';
import noHonorableDischarge from './veteran/01-noHonorableDischarge';
import yesHonorableDischarge from './veteran/01-yesHonorableDischarge';
import disabilityRating from './veteran/02-disabilityRating';
import noDisabilityRating from './veteran/02-noDisabilityRating';
import yesActiveDutySeparation from './veteran/03-yesActiveDutySeparation';
import notInterestedInEmploymentHelp from './veteran/04-notInterestedInEmploymentHelp';
import interestedInEmploymentHelp from './veteran/04-yesInterestedInEmploymentHelp';

// Service Member Path Imports
import amServiceMember from './service-member/amServiceMember';
import noHonorableDischargeSM from './service-member/01-noHonorableDischarge';
import yesHonorableDischargeSM from './service-member/01-yesHonorableDischarge';
import noVaMemorandum from './service-member/02-noVaMemorandum';
import yesVaMemorandum from './service-member/02-yesVaMemorandum';
import notInterestedInHelp from './service-member/03-notInterestedInHelp';
import yesInterestedInHelp from './service-member/03-yesInterestedInHelp';
import noIDES from './service-member/03-noIDES';
import yesIDES from './service-member/03-yesIDES';

// Other Path Imports
// import amOther from './amOther';

export default [
  start,
  amVeteran,
  amServiceMember,
  // amOther,
  noHonorableDischarge,
  yesHonorableDischarge,
  disabilityRating,
  noDisabilityRating,
  yesActiveDutySeparation,
  interestedInEmploymentHelp,
  notInterestedInEmploymentHelp,
  noHonorableDischargeSM,
  yesHonorableDischargeSM,
  noVaMemorandum,
  yesVaMemorandum,
  notInterestedInHelp,
  yesInterestedInHelp,
  noIDES,
  yesIDES,
];
