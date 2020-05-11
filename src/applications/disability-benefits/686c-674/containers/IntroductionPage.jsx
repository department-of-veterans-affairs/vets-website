import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { verifyVaFileNumber } from '../actions';

// We need to check for the presence of VA file number by performing an API request to vets-api.
// If a VA file number exists, proceed with the form. If it doesn't, show an error.
// 1. Fire off an action on component did mount.
// 2. Action should fire off API call.
// 3. Reducer should consume response from action.
// 4. Component should update based on new state from reducer.

const VerifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account and your
        account is verified, we can prefill part of your application based on
        your account details. You can also save your form in progress and come
        back later to finish filling it out.
      </div>
    </div>
    <br />
  </div>
);
class IntroductionPage extends React.Component {
  componentDidMount() {
    this.props.verifyVaFileNumber();
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const {
      vaFileNumber: { hasVaFileNumber, isLoading },
    } = this.props;

    let alertState;
    if (isLoading) {
      alertState = (
        <LoadingIndicator message="Verifying veteran account information..." />
      );
    } else if (!isLoading && !hasVaFileNumber) {
      const errorContent = (
        <>
          <h2 className="vads-u-margin-y--0 vads-u-font-size--lg">
            Your profile is missing some required information
          </h2>
          <p>
            The personal information we have on file for your is missing your VA
            file number.
          </p>
          <p>
            You'll need to update your personal information. Please call
            Veterans Benefits Assistance at
            <a href="tel: 800-827-1000" aria-label="800. 8 2 7. 1000.">
              800-827-1000
            </a>{' '}
            between 8:00 a.m. and 9:00 p.m. ET Monday through Friday.
          </p>
        </>
      );
      alertState = <AlertBox content={errorContent} status="error" isVisible />;
    } else {
      alertState = (
        <SaveInProgressIntro
          {...this.props}
          hideUnauthedStartLink
          verifiedPrefillAlert={VerifiedAlert}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Add or remove a dependent"
        >
          Please complete the 21-686 form to apply for declare or remove a
          dependent.
        </SaveInProgressIntro>
      );
    }
    const content = (
      <div className="schemaform-intro">
        <FormTitle title="Add or remove dependents from your VA benefits" />
        <p>
          Equal to VA Form 21-686c (Application Request to Add And/Or Remove
          Dependents) and/or Equal to VA Form 21-674 (Request for Approval of
          School Attendance)
        </p>
        {alertState}
        <h4>Follow the steps below to apply to add or remove a dependent.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Prepare</h5>
              <h6>When you apply, be sure to have these on hand:</h6>
              <ul>
                <li>Social Security numbers for you and your dependents</li>
                <li>
                  Your current and previous marriage details, such as places and
                  dates. If your spouse was married before, you'll need those
                  details too
                </li>
                <li>
                  Details about your children, including their full names,
                  Social Security numbers, and places and dates of birth
                </li>
                <li>
                  If you are removing a stepchild under 18 from your benefit,
                  you'll need the name and address of the person the child now
                  lives with
                </li>
                <li>
                  If you are removing a deceased dependent from your benefit,
                  you'll need the date and place of death
                </li>
                <li>
                  If you are removing other dependents due to divorce, a child
                  under 18 getting married, or a student under 23 leaving
                  school, you'll need the date of the event
                </li>
              </ul>
              <h6>
                If you are adding a student 18 to 23 years old (equal to VA Form
                21-674), you'll need:
              </h6>
              <ul>
                <li>Social Security numbers for you and your dependent</li>
                <li>
                  Details about your dependent, including their full names,
                  Social Security numbers, birthdate, and school address
                </li>
                <li>
                  School names and addresses for where the student will attend,
                  as well as where the student attended last term
                </li>
                <li>
                  Details about what the student will be studying, for example
                  their major
                </li>
                <li>
                  Important term start, and end dates, and expected graduation
                  date
                </li>
                <li>
                  Details about your dependent's past and expected income, and
                  information about any property or assets the student may have
                </li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited representative, with a Veterans Service
                Organization (VSO), can help you fill out your application.{' '}
                <a href="/disability-benefits/apply/help/index.html">
                  Get help filing your claim
                </a>
                .
              </p>
            </li>
            <li className="process-step list-two">
              <h5>Apply</h5>
              <p>
                Complete this dependents form and upload additional information
                if needed.
              </p>
              <h6>
                You will need to upload additional evidence to add your spouse
                if you:
              </h6>
              <ul>
                <li>
                  Live outside the U.S. its bases or territories, you'll need to
                  provide the marriage certificate, church record or other
                  public marriage document
                </li>
                <li>
                  Married by <strong>common-law</strong>, you'll need to provide
                  two{' '}
                  <a href="https://www.va.gov/vaforms/form_detail.asp?FormNo=21-4170">
                    VA Forms 21-4170
                  </a>
                  , one completed by the claimant, the other by the spouse.
                  You'll also need two{' '}
                  <a href="https://www.va.gov/vaforms/form_detail.asp?FormNo=21P-4171">
                    VA Forms 21P-4171
                  </a>{' '}
                  completed by two different people. If there are children from
                  the marriage, you'll also need to provide their birth
                  certificates
                </li>
                <li>
                  Married according to <strong>tribal custom</strong>, you'll
                  need to provide affidavits of all parties involved, including
                  two witnesses and the person who performed the ceremony. These
                  affidavits must include the marriage date and location. All of
                  these documents must also include the mailing address of the
                  person who performed the ceremony
                </li>
                <li>
                  Married <strong>by proxy</strong>, you'll need to provide all
                  the documents and/or certificates issued to conduct the
                  marriage
                </li>
              </ul>
              <h6>
                You will need to upload additional evidence to add a child if:
              </h6>
              <ul>
                <li>
                  You live outside the U.S. its bases or territories, you'll
                  need to provide the child's birth certificate
                </li>
                <li>
                  Your <strong>child is adopted</strong>, you must provide the
                  final adoption decree, the placement agreement or the child's
                  revised birth certificate
                </li>
                <li>
                  Your <strong>child is not capable of self-support</strong>,
                  you must provide medical evidence of an existing permanent
                  mental or physical disability before the child's 18th
                  birthday. You'll also need to send a doctor's statement
                  describing your child's impairment
                </li>
              </ul>
              <p>
                After submitting your application, you'll get a confirmation
                message. You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h5>VA Review</h5>
              <p>
                We process applications in the order we receive them. We may
                contact you if we have questions or need more information.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>Decision</h5>
              <p>
                You’ll get a notice in the mail once we've processed your claim.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          verifiedPrefillAlert={VerifiedAlert}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Add or remove a dependent"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="2900-0043" expDate="09/30/2021" />
        </div>
      </div>
    );
    return content;
  }
}

const mapStateToProps = state => {
  const { form, user, vaFileNumber } = state;
  return {
    form,
    user,
    vaFileNumber,
  };
};

const mapDispatchToProps = {
  verifyVaFileNumber,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);

export { IntroductionPage };
