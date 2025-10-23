import { PassThroughPage } from '../../shared/components/PassThroughPage';

// Thin wrapper around PassThroughPage that ensures we show the proper array item
// data + call the appropriate data setting functions for this page based on
// whether or not we're on the review screen.
export default function ApplicantSponsorMarriageDatePage(props) {
  // For review page, we have to use a special onChange function
  const customSetFormData = args => {
    // Update current applicant without losing all form data
    const newData = { ...props.data };
    newData.applicants[props.pagePerItemIndex] = args;
    return newData;
  };

  // Set display data and sponsor date of birth assuming we're inside the list loop
  let pageData = props.data;
  let sponsorDob = props?.fullData?.sponsorDob;

  // If we're on review page, display data + sponsor DOB key are different:
  if (props?.onReviewPage) {
    pageData = props.data.applicants[props.pagePerItemIndex];
    sponsorDob = props?.data?.sponsorDob;
  }

  const customData = {
    ...pageData,
    // Setting this allows us to validate applicant date of marriage against sponsor DOB
    'view:sponsorDob': sponsorDob,
  };

  return PassThroughPage({
    ...props,
    data: customData,
    setFormData: customSetFormData,
  });
}
