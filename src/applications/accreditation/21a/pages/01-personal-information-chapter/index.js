import intro from './intro';
import role from './role';
import yesNoPageSchema from '../helpers/yesNoPageSchema';
import notInGoodStanding from './notInGoodStanding';
import nameDateOfBirth from './nameDateOfBirth';
import placeOfBirth from './placeOfBirth';
import contactInformation from './contactInformation';
import homeAddress from './homeAddress';
import employmentStatus from './employmentStatus';
import workAddress from './workAddress';
import primaryMailingAddress from './primaryMailingAddress';
import otherAddress from './otherAddress';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  pages: {
    intro,
    role,
    standingWithBar: yesNoPageSchema({
      title: 'Standing with the bar',
      path: 'standing-with-bar',
      question:
        'Are you currently a member in good standing of the bar of the highest court of a state or territory of the United States?',
    }),
    notInGoodStanding,
    nameDateOfBirth,
    placeOfBirth,
    contactInformation,
    homeAddress,
    employmentStatus,
    workAddress,
    primaryMailingAddress,
    otherAddress,
  },
};
