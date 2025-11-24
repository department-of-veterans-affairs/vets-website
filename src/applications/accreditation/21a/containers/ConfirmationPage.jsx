import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const ConfirmationPage = props => {
  const { submission } = props.form;
  const submitDate = new Date(submission?.timestamp);

  // const showDateRange = (label, start, end) => {
  //   if(!start && !end) return null;
  //   return `${start} to ${end ? end : 'Present'}`;
  // }

  // const showItem = (label, value) =>
  //   value ? (
  //     <li>
  //       <div className="vads-u-color--gray">{label}</div>
  //       <div style={{"marginBottom": "8px"}} className="dd-privacy-mask" dd-action-name={label}>
  //         {value}
  //       </div>
  //     </li>
  //   ) : null;

  // const multiLineShowItem = (label, values) =>
  //   values && values.length > 0 ? (
  //     <li>
  //       <div className="vads-u-color--gray">{label}</div>
  //       <div className="dd-privacy-mask" dd-action-name={label}>
  //         {values.map((value, index) => (
  //           <div key={index} style={index === values.length - 1 ? {"marginBottom": "8px"} : null}>{value}</div>
  //         ))}
  //       </div>
  //     </li>
  //   ) : null;

  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      // confirmationNumber={confirmationNumber}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert style={{ padding: '16px 20px' }} status="success" visible>
        <h2 slot="headline">
          You’ve submitted your application for VA accreditation on{' '}
          {submitDate ? format(submitDate, 'MMMM d, yyyy') : ''}
        </h2>
        <p className="vads-u-margin-y--0">
          Thank you for submitted your application for VA accreditation. Each
          application is unique, and the circumstances determine the amount of
          time needed for due diligence in our decisions. Our time and resources
          are committed to ensuring Veterans receive responsible and qualified
          representation.
        </p>
      </va-alert>

      <h2 style={{ marginTop: '32px' }}>Save a copy of your form</h2>
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <h2 style={{ marginTop: '32px', marginBottom: '8px' }}>What to expect</h2>
      <ul style={{ margin: '0' }}>
        <li>
          We will review your application and reach out to you if we have
          questions or need additional information
        </li>
        <li>
          Attorney applications are typically processed within 60 to 120 days
          from the date of submission. Because the process includes more steps,
          claims agent applications take, on average, 1 year to process
        </li>
        <li>
          If you change your mind and would like to withdraw your application
          for accreditation, contact OGC using the Accredition Mailbox at{' '}
          <a href="ogcaccreditationmailbox@va.gov">
            ogcaccreditationmailbox@va.gov
          </a>
        </li>
        <li>
          If you are applying for accreditation as a claims agent, you are
          required to pass a written examination before you can be accredited.
          We will reach out to you to schedule your examination if we make a
          favorable preliminary determination on your character and reputation.
        </li>
        <li>
          We will provide you with notice of our decision on your application.
          If your application is denied, we will notify you of your options
          should you disagree with our decisions.
        </li>
      </ul>
      <h2 style={{ marginTop: '32px', marginBottom: '8px' }}>
        How do I update my application?
      </h2>
      <ul style={{ margin: '0' }}>
        <li>
          It is your responsibility to keep the Office of General Counsel
          updated regarding changes to the information in your application prior
          to our decision on your application. If you need to update your
          application because of a change in your situation, contact OGC using
          the Accreditation Mailbox at{' '}
          <a href="ogcaccreditationmailbox@va.gov">
            ogcaccreditationmailbox@va.gov
          </a>
        </li>
        <li>
          You should update your application if your address changes, your
          employment situation changes, you are charged with a crime, or you
          experience any other significant change thath might be relevant to
          your application for accrditation.
        </li>
      </ul>
      <h2 style={{ marginTop: '32px', marginBottom: '8px' }}>
        What if I have questions?
      </h2>
      <ul style={{ margin: '0' }}>
        <li>
          Please visit the <a href="https://www.va.gov/ogc/">OGC Website</a>{' '}
          which has fact sheets and FAQs. Other accreditation questions and
          comments may be sent to the Accreditation Mailbox at{' '}
          <a href="ogcaccreditationmailbox@va.gov">
            ogcaccreditationmailbox@va.gov
          </a>
        </li>
      </ul>
      <h3 style={{ marginTop: '56px', borderBottom: '2px solid #005EA2' }}>
        Need help?
      </h3>
      <p style={{ marginBottom: '56px', marginTop: '8px' }}>
        For questions about the accreditation process, visit the{' '}
        <a href="https://www.va.gov/ogc/">OGC Website</a>
      </p>
    </ConfirmationView>
    // return (
    // <div>
    //
    //   <va-accordion bordered open-single>
    //     <va-accordion-item
    //         header="Information you submitted on this form"
    //         bordered
    //       >
    //         <div>
    //           <h3 className="vads-u-margin-top--0">Personal information</h3>
    //           {showItem('First name', data.fullName?.first)}
    //           {showItem('Middle name', data.fullName?.middle)}
    //           {showItem('Last name', data.fullName?.last)}
    //           {showItem('Role', data.role)}
    //           {showItem('Date of Birth', data.dateOfBirth)}
    //           {showItem('Place of birth', `${data.placeOfBirth.city}, ${data.placeOfBirth.state} ${data.placeOfBirth.country}`)}
    //           {showItem('Type of phone', data.typeOfPhone)}
    //           {showItem('Phone number', `${data.phone?.callingCode}-${data.phone?.contact}`)}
    //           {showItem('Email address', data.email)}
    //           {multiLineShowItem("Home address", [data.homeAddress.street, data.homeAddress.street2, `${data.homeAddress.city}, ${data.homeAddress.state} ${data.homeAddress.postalCode}` ])}
    //           <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
    //           <h3 className="vads-u-margin-top--0">Military service experience</h3>
    //           {data.militaryServiceExperiences?.length > 0 ? data.militaryServiceExperiences.map((experience, index) => {
    //             return (<div key={index}>
    //               {showItem('Branch', experience.branch)}
    //               {showDateRange('Date range', experience.dateRange.from, experience.dateRange.to)}
    //               {showItem('Character of discharge', experience.characterOfDischarge)}
    //               {showItem('Explanation of discharge', experience.explanationOfDischarge)}
    //             </div>)
    //           }) : "No experience listed"}
    //           <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
    //           <h3 className="vads-u-margin-top--0">Employment information</h3>
    //           {showItem('Employment status', data.employmentStatus)}
    //           {data.employers?.length > 0 ? data.employers.map((employer, index) => {
    //             return (<div key={index}>
    //               <div className="vads-u-color--gray">Employer {index + 1}</div>
    //               {showItem('Name', employer.name)}
    //               {showItem('Position title', employer.positionTitle)}
    //               {showItem('Supervisor name', employer.supervisorName)}
    //               {multiLineShowItem("Address", [employer.address.street, employer.address.street2, `${employer.address.city}, ${employer.address.state} ${employer.address.postalCode}` ])}
    //               {showItem('Phone number', `${employer.phone?.callingCode}-${employer.phone?.contact}`)}
    //               {showItem('Extension', employer.extension)}
    //               {showItem('Date range', employer.dateRange.from, employer.dateRange.to)}
    //               {showItem('Currently employed', employer.currentlyEmployed ? "Yes" : "No")}
    //               <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />

    //               </div>)}
    //             )
    //           : "No employers listed"}
    //           <div className="vads-u-color--gray">Employment activities</div>
    //           {showItem('Business', data.employmentActivities.BUSINESS ? "Selected": "Not selected")}
    //           {showItem('Consulting', data.employmentActivities.CONSULTING ? "Selected": "Not selected")}
    //           {showItem('Financial', data.employmentActivities.FINANCIAL ? "Selected": "Not selected")}
    //           {showItem('Home or nursing', data.employmentActivities.HOME_OR_NURSING ? "Selected": "Not selected")}
    //           {showItem('Medical', data.employmentActivities.MEDICAL ? "Selected": "Not selected")}
    //           {showItem('Social work', data.employmentActivities.SOCIAL_WORK ? "Selected": "Not selected")}
    //           {showItem('Vocational rehabilitation', data.employmentActivities.VOCATIONAL_REHABILITATION ? "Selected": "Not selected")}
    //           {showItem('None', data.employmentActivities.NONE ? "Selected": "Not selected")}
    //           <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
    //           <h3 className="vads-u-margin-top--0">Education information</h3>
    //           {data.educationalInstitutions?.length >0 ? data.educationalInstitutions.map((education, index) => {
    //             return (<div key={index}>
    //               {showItem('Name', education.name)}
    //               {showItem('Date range', education.dateRange.from, education.dateRange.to)}
    //               {showItem('Degree received', education.degreeReceived ? "Yes" : "No")}
    //               {showItem('Major', education.major)}
    //               {showItem('Degree', education.degree)}
    //               {multiLineShowItem("Address", [education.address.street, education.address.street2, `${education.address.city}, ${education.address.state} ${education.address.postalCode}` ])}
    //             </div>)
    //           }): "No educational institutions listed"}
    //           <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
    //           <h3 className="vads-u-margin-top--0">Jurisdictions</h3>
    //           {data.jurisdictions?.length > 0 ? data.jurisdictions.map((jurisdiction, index) => (
    //             <div key={index}>
    //               {showItem('Jurisdiction', jurisdiction.jurisdiction)}
    //               {showItem('Other jurisdiction', jurisdiction.otherJurisdiction)}
    //               {showItem('Admission date', jurisdiction.admissionDate)}
    //               {showItem('Membership or registration number', jurisdiction.membershipOrRegistrationNumber)}
    //             </div>
    //           )) : "No jurisdictions listed"}
    //           <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />

    //           <h3 className="vads-u-margin-top--0">State or federal agencies or courts</h3>
    //           {data.agenciesOrCourts?.length > 0 ? data.agenciesOrCourts.map((agencyOrCourt, index) => (
    //             <div key={index}>
    //               {showItem('Name', agencyOrCourt.agencyOrCourt) }
    //               {showItem('Other agency or court', agencyOrCourt.otherAgencyOrCourt)}
    //               {showItem('Admission date', agencyOrCourt.admissionDate)}
    //               {showItem('Membership or registration number', agencyOrCourt.membershipOrRegistrationNumber)}
    //             </div>
    //           )) : "No state or federal agencies or courts listed"}

    //           <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
    //           <h3 className="vads-u-margin-top--0">Background information</h3>

    //           {showItem('Have you ever been convicted of a felony?', data.conviction ? "Yes" : "No")}
    //           {data.convictionDetailsExplanation && showItem('Explanation', data.convictionDetailsExplanation)}

    //           {showItem('Have you ever been convicted by a military court-martial?', data.courtMartialed ? "Yes" : "No")}
    //           {data.courtMartialedDetailsExplanation && showItem('Explanation', data.courtMartialedDetailsExplanation)}

    //           {showItem('Are you now under charges for any violations of law?', data.underCharges ? "Yes" : "No")}
    //           {data.underChargesDetailsExplanation && showItem('Explanation', data.underChargesDetailsExplanation)}

    //           {showItem('Have you ever been suspended, expelled, or asked to resign or withdraw from any educational institution?', data.resignedFromEducation ? "Yes" : "No")}
    //           {data.resignedFromEducationDetailsExplanation && showItem('Explanation', data.resignedFromEducationDetailsExplanation)}

    //           {showItem('Have you ever withdrawn from any educational institution in time to avoid discipline, suspension, or expulsion for conduct involving dishonesty, fraud, misrepresentation, or deceit?', data.withdrawnFromEducation ? "Yes" : "No")}
    //           {data.withdrawnFromEducationDetailsExplanation && showItem('Explanation', data.withdrawnFromEducationDetailsExplanation)}

    //           {showItem('Have you ever been disciplined, reprimanded, suspended, or terminated in any job for conduct involving dishonesty, fraud, misrepresentation, deceit, or any violation of Federal or state laws or regulations?', data.disciplinedForDishonesty ? "Yes" : "No")}
    //           {data.disciplinedForDishonestyDetailsExplanation && showItem('Explanation', data.disciplinedForDishonestyDetailsExplanation)}

    //           {showItem('Have you ever resigned, retired from, or quit a job when you were under investigation or inquiry for conduct which could have been considered as involving dishonesty, fraud, misrepresentation, deceit, or violation of Federal or state laws or regulations, or after receiving notice or being advised of possible investigation, inquiry, or disciplinary action for such conduct?', data.resignedForDishonesty ? "Yes" : "No")}
    //           {data.resignedForDishonestyDetailsExplanation && showItem('Explanation', data.resignedForDishonestyDetailsExplanation)}

    //           {showItem('Have you ever functioned as a representative, agent, or attorney before a state or Federal department or agency?', data.representativeForAgency ? "Yes" : "No")}
    //           {data.representativeForAgencyDetailsExplanation && showItem('Explanation', data.representativeForAgencyDetailsExplanation)}

    //           {showItem('Have you ever been reprimanded, suspended, denied from practice, or barred from practice before any court, bar, Federal, or state agency?', data.reprimandedInAgency ? "Yes" : "No")}
    //           {data.reprimandedInAgencyDetailsExplanation && showItem('Explanation', data.reprimandedInAgencyDetailsExplanation)}

    //           {showItem('Have you ever resigned membership in the bar of any court, or Federal or state agency to avoid reprimand, suspension, or disbarment for conduct involving dishonesty, fraud, misrepresentation, or deceit?', data.resignedFromAgency ? "Yes" : "No")}
    //           {data.resignedFromAgencyDetailsExplanation && showItem('Explanation', data.resignedFromAgencyDetailsExplanation)}

    //           {showItem('Have you ever applied for accreditation by the Department of Veterans Affairs as a representative of a Veterans Service Organization (VSO), agent, or attorney?', data.appliedForVaAccreditation ? "Yes" : "No")}
    //           {data.appliedForVaAccreditationDetailsExplanation && showItem('Explanation', data.appliedForVaAccreditationDetailsExplanation)}

    //           {showItem('If you were previously accredited as a representative of a VSO, was that accreditation terminated or suspended at the request of the organization?', data.terminatedByVsorg ? "Yes" : "No")}
    //           {data.terminatedByVsorgDetailsExplanation && showItem('Explanation', data.terminatedByVsorgDetailsExplanation)}

    //           {showItem('Do you have any condition or impairment that in any way currently affects, or, if untreated or not otherwise actively manager, could affect your ability to represent claimants in a competent and professional manner?', data.conditionThatAffectsRepresentation ? "Yes" : "No")}
    //           {data.conditionThatAffectsRepresentationDetailsExplanation && showItem('Explanation', data.conditionThatAffectsRepresentationDetailsExplanation)}

    //           <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />

    //           <h3 className="vads-u-margin-top--0">Optional supplementary statements</h3>
    //           {showItem('Supplemental statement', data.supplementalStatement)}
    //           {showItem('Personal statement', data.personalStatement)}
    //         </div>

    //     </va-accordion-item>
    //   </va-accordion>

    //   <h3 style={{"marginTop": "32px", "marginBottom": "0"}}>Print this confirmation page</h3>
    //   <p style={{"marginTop": "16px", "marginBottom": "16px"}}>If you'd like to keep a copy of the information on this page, you can print it now.</p>
    //   <va-button
    //     uswds
    //     class="screen-only vads-u-margin-top--1"
    //     text="Print this page for your records"
    //     onClick={() => window.print()}
    //   />

    // </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      }),
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.instanceOf(Date),
    }),
  }),
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);
