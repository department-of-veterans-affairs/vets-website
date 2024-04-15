import { pageProps, reviewPageProps } from '../config/constants';
import CheckboxCustomLabelsPage, {
  CheckboxCustomLabelsReviewPage,
} from '../../shared/components/applicantLists/CustomCheckboxRadioPage.jsx';
import { applicantWording } from '../../shared/utilities';

const KEYNAME = 'applicantPrimaryInsuranceType';

function generateOptions({ data, pagePerItemIndex }) {
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
    keyname: KEYNAME,
    description: `What type of insurance is ${applicant} enrolled in?`,
    customTitle: `${applicant}’s ${
      data[pagePerItemIndex]?.applicantPrimaryProvider
    } insurance plan`,
  };
}

export function ApplicantInsuranceTypePage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return CheckboxCustomLabelsPage(newProps);
}
export function ApplicantInsuranceTypeReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return CheckboxCustomLabelsReviewPage(newProps);
}

ApplicantInsuranceTypePage.propTypes = pageProps;
ApplicantInsuranceTypeReviewPage.propTypes = reviewPageProps;
