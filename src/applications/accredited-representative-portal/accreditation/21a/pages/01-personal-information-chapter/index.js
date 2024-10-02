import personalInformationIntro from './personalInformationIntro';
import role from './role';
import lawLicense from './lawLicense';
import notInGoodStanding from './notInGoodStanding';
import nameDateOfBirth from './nameDateOfBirth';
import placeOfBirth from './placeOfBirth';
import contactInformation from './contactInformation';
import homeAddress from './homeAddress';
import primaryMailingAddress from './primaryMailingAddress';
import otherAddress from './otherAddress';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  pages: {
    personalInformationIntro,
    role,
    lawLicense,
    notInGoodStanding,
    nameDateOfBirth,
    placeOfBirth,
    contactInformation,
    homeAddress,
    primaryMailingAddress,
    otherAddress,
  },
};
