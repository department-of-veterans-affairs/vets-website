import start from './start';
import amVeteran from './veteran/amVeteran';
import amServiceMember from './amServiceMember';
import amOther from './amOther';
import noHonorableDischarge from './veteran/01-noHonorableDischarge';
import yesHonorableDischarge from './veteran/01-yesHonorableDischarge';
import disabilityRating from './veteran/02-disabilityRating';
import noDisabilityRating from './veteran/02-noDisabilityRating';
import yesActiveDutySeparation from './veteran/03-yesActiveDutySeparation';
import notInterestedInEmploymentHelp from './veteran/04-notInterestedInEmploymentHelp';
import interestedInEmploymentHelp from './veteran/04-yesInterestedInEmploymentHelp';
import notWithin12Years from './veteran/notWithin12Years';

export default [
  start,
  amVeteran,
  amServiceMember,
  amOther,
  noHonorableDischarge,
  yesHonorableDischarge,
  disabilityRating,
  noDisabilityRating,
  yesActiveDutySeparation,
  interestedInEmploymentHelp,
  notInterestedInEmploymentHelp,
  notWithin12Years,
];
