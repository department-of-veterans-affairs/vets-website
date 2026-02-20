import AddressSelectionPage, {
  NOT_SHARED,
} from '../../components/FormPages/AddressSelectionPage';
import AddressSelectionReviewPage from '../../components/FormReview/AddressSelectionReviewPage';
import { blankSchema } from '../../definitions';
import { whenAll } from '../../utils/helpers';
import contactInformation from './contactInformation';
import deathInformation from './deathInformation';
import identityInformation from './identityInformation';
import livingStatus from './livingStatus';
import mailingAddress from './mailingAddress';
import personalInformation from './personalInformation';
import sectionOverview from './sectionOverview';

// Shared `depends` predicates
const isSponsor = formData => formData?.certifierRole === 'sponsor';
const isNotSponsor = formData => !isSponsor(formData);

const isDeceased = formData =>
  isNotSponsor(formData) && Boolean(formData?.sponsorIsDeceased);
const isNotDeceased = formData => !isDeceased(formData);

const hasCertifierStreet = formData =>
  Boolean(formData?.certifierAddress?.street);
const noSharedAddress = formData =>
  formData?.['view:sharesAddressWith'] === NOT_SHARED;

// CustomPage declarations
const SponsorAddressSelectionPage = props =>
  AddressSelectionPage({ ...props, dataKey: 'sponsorAddress' });

export const sponsorPages = {
  overview: {
    path: 'veteran-information-overview',
    title: 'Veteran information',
    ...sectionOverview,
  },
  personalInformation: {
    path: 'veteran-name-and-date-of-birth',
    title: 'Veteran’s name and date of birth',
    ...personalInformation,
  },
  identityInformation: {
    path: 'veteran-social-security-number',
    title: `Veteran’s identification information`,
    ...identityInformation,
  },
  livingStatus: {
    path: 'veteran-life-status',
    title: 'Veteran’s status',
    depends: isNotSponsor,
    ...livingStatus,
  },
  deathInformation: {
    path: 'veteran-death-information',
    title: 'Veteran’s death details',
    depends: isDeceased,
    ...deathInformation,
  },
  addressSelection: {
    path: 'veteran-address',
    title: 'Veteran’s address',
    depends: whenAll(isNotSponsor, isNotDeceased, hasCertifierStreet),
    CustomPage: SponsorAddressSelectionPage,
    CustomPageReview: AddressSelectionReviewPage,
    uiSchema: {},
    schema: blankSchema,
  },
  mailingAddress: {
    path: 'veteran-mailing-address',
    title: 'Veteran’s mailing address',
    depends: whenAll(isNotDeceased, noSharedAddress),
    ...mailingAddress,
  },
  contactInformation: {
    path: 'veteran-contact-information',
    title: 'Veteran’s contact information',
    depends: isNotDeceased,
    ...contactInformation,
  },
};
