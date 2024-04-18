import { pageProps, reviewPageProps } from '../config/constants';
import CheckboxCustomLabelsPage, {
  CheckboxCustomLabelsReviewPage,
} from '../../shared/components/applicantLists/CustomCheckboxRadioPage.jsx';
import { applicantWording } from '../../shared/utilities';

const KEYNAME = 'applicantPrimaryInsuranceType';
const SECONDARY_KEYNAME = 'applicantSecondaryInsuranceType';

function generateOptions({ data, pagePerItemIndex, isPrimary }) {
  const applicant = applicantWording(
    data?.applicants?.[pagePerItemIndex],
    undefined,
    false,
  );
  const labels = [
    {
      value: 'hmo',
      title: `${applicant} is enrolled in a Health Maintenance Organization (HMO) program`,
    },
    {
      value: 'ppo',
      title: `${applicant} is enrolled in a Preferred Provider Organization (PPO) program`,
    },
    {
      value: 'medicaidOrStateAssistance',
      title: `${applicant} is enrolled in Medicaid or a State Assistance program`,
    },
    {
      value: 'rxDiscount',
      title: `${applicant} is enrolled in a Prescription Discount program`,
    },
    {
      value: 'other',
      title: `${applicant} is enrolled in other (specialty, limited coverage, or exclusively CHAMPVA supplemental) insurance`,
    },
    {
      value: 'medigap',
      title: `${applicant} is enrolled in a Medigap program`,
    },
  ];

  return {
    labels,
    applicant,
    keyname: isPrimary ? KEYNAME : SECONDARY_KEYNAME,
    description: `What type of insurance is ${applicant} enrolled in?`,
    customTitle: `${applicant}’s ${
      isPrimary
        ? data?.applicants?.[pagePerItemIndex]?.applicantPrimaryProvider
        : data?.applicants?.[pagePerItemIndex]?.applicantSecondaryProvider
    } ${!isPrimary ? 'secondary' : ''} insurance plan type`,
  };
}

export function ApplicantInsuranceTypePage(props) {
  return CheckboxCustomLabelsPage({
    ...props,
    keyname: KEYNAME,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}
export function ApplicantInsuranceTypeReviewPage(props) {
  return CheckboxCustomLabelsReviewPage({
    ...props,
    keyname: KEYNAME,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}

export function ApplicantSecondaryInsuranceTypePage(props) {
  return CheckboxCustomLabelsPage({
    ...props,
    keyname: SECONDARY_KEYNAME,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}
export function ApplicantSecondaryInsuranceTypeReviewPage(props) {
  return CheckboxCustomLabelsReviewPage({
    ...props,
    keyname: SECONDARY_KEYNAME,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}

ApplicantInsuranceTypePage.propTypes = pageProps;
ApplicantInsuranceTypeReviewPage.propTypes = reviewPageProps;
ApplicantSecondaryInsuranceTypePage.propTypes = pageProps;
ApplicantSecondaryInsuranceTypeReviewPage.propTypes = reviewPageProps;
