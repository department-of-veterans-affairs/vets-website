import role from './role';
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
