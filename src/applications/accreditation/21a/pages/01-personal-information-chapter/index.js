import personalInformation from './personalInformation';
import placeOfBirth from './placeOfBirth';
import contactInformation from './contactInformation';
import homeAddress from './homeAddress';
import workAddress from './workAddress';
import militaryHistory from './militaryHistory';
import militaryServiceExperience from './militaryServiceExperience';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  pages: {
    personalInformation,
    placeOfBirth,
    contactInformation,
    homeAddress,
    workAddress,
    militaryHistory,
    militaryServiceExperience,
  },
};
