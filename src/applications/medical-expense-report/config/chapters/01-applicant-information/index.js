import mailingAddress from './mailingAddress';
import veteranInformation from './veteranInformation';
import claimantRelationship from './claimantRelationship';
import claimantInformation from './claimantInformation';
import contactInformation from './contactInformation';

export default {
  title: 'Applicant information',
  pages: {
    claimantRelationship,
    claimantInformation,
    mailingAddress,
    contactInformation,
    veteranInformation,
  },
};
