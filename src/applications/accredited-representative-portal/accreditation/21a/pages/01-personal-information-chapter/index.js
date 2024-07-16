import role from './role';
import yesNoPageSchema from '../helpers/yesNoPageSchema';
import personalInformation from './personalInformation';
import placeOfBirth from './placeOfBirth';
import contactInformation from './contactInformation';
import homeAddress from './homeAddress';
import employmentStatus from './employmentStatus';
import workAddress from './workAddress';
import communicationAddress from './communicationAddress';
import otherAddress from './otherAddress';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  pages: {
    role,
    barStanding: yesNoPageSchema({
      title: 'Standing with the bar',
      path: 'bar-standing',
      question:
        'Are you currently a member in good standing of the bar of the highest court of a state or territory of the United States?',
    }),
    personalInformation,
    placeOfBirth,
    contactInformation,
    homeAddress,
    employmentStatus,
    workAddress,
    communicationAddress,
    otherAddress,
  },
};
