import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getIntroState } from 'platform/forms/save-in-progress/selectors';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { getAppData } from '../selectors';
import IntroductionLogin from '../components/IntroductionLogin';

export const IntroductionPage = ({
  isFormSaved,
  isLOA3,
  isLoggedIn,
  isPersonalInfoFetchFailed,
  showMeb5490EMaintenanceAlert,
  route,
}) => {
  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Apply for education benefits as an eligible dependent"
        subTitle="Form 22-5490 (Dependent's Application for VA Education Benefits)"
      />
      <p>
        <strong>Note:</strong> This application is only for these 2 education
        benefits:
      </p>
      <ul>
        <li>
          <strong>Fry Scholarship</strong> (Chapter 33)
        </li>
        <li>
          <strong>Survivors’ and Dependents’ Educational Assistance</strong>{' '}
          (DEA, Chapter 35)
        </li>
      </ul>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to get started
      </h2>

      {isFormSaved && <IntroductionLogin route={route} />}

      <va-process-list>
        <va-process-list-item header="Check your eligibility">
          <p>
            Make sure you meet our eligibility requirements before you apply.
          </p>
          <va-additional-info trigger="What are the Fry Scholarship (Chapter 33) eligibility requirements?">
            <p>
              <strong>
                You may be eligible for Fry Scholarship benefits if you’re the
                child or surviving spouse of:
              </strong>
            </p>
            <ul className="vads-u-margin-bottom--0">
              <li>
                {' '}
                A member of the Armed Forces who died in the line of duty while
                serving on active duty on or after September 11, 2001,{' '}
                <strong>or</strong>
              </li>
              <li>
                A member of the Armed Forces who died in the line of duty while
                not on active duty on or after September 11, 2001,{' '}
                <strong>or</strong>
              </li>
              <li>
                A member of the Selected Reserve who died from a
                service-connected disability on or after September 11, 2001,{' '}
                <strong>and</strong>
              </li>
              <li>You meet other requirements</li>
            </ul>
          </va-additional-info>

          <va-additional-info trigger="What are the Survivors' and Dependents' Educational Assistance (DEA, Chapter 35)?">
            <p>
              <strong>
                You may be eligible to get these benefits if both you and the
                Veteran or service member meet certain eligibility requirements:
              </strong>
            </p>
            <ul className="vads-u-margin-bottom--0">
              <li>
                {' '}
                The Veteran or service member is permanently and totally
                disabled due to a service-connected disability,{' '}
                <strong>or</strong>
              </li>
              <li>
                The Veteran or service member died in the line of duty,{' '}
                <strong>or</strong>
              </li>
              <li>
                The Veteran or service member died as a result of a
                service-connected disability, <strong>or</strong>
              </li>
              <li>
                The Veteran or service member is missing in action or was
                captured in the line of duty by a hostile force for more than 90
                days, <strong>or</strong>
              </li>
              <li>
                The Veteran or service member was forcibly detained (held) or
                interned in the line of duty by a foreign entity for more than
                90 days, <strong>or</strong>
              </li>
              <li>
                The service member is in the hospital or getting outpatient
                treatment for a service-connected permanent and total disability
                and is likely to be discharged for the disability,{' '}
                <strong>and</strong>
              </li>
              <li>You meet other requirements</li>
            </ul>
          </va-additional-info>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <h4>Here’s what you’ll need to apply:</h4>
          <div>
            <ul>
              <li>Knowledge of your military service history</li>
              <li>Your current address and contact information</li>
              <li>Bank account direct deposit information</li>
            </ul>
          </div>
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            We’ll take you through each step of the process. It should take
            about 15 minutes.
          </p>
          <va-additional-info trigger="What happens after I apply?">
            <ul className="vads-u-margin-bottom--0">
              <li>
                {' '}
                After you apply, you may get an automatic decision. If we
                approve your application, you’ll be able to download your
                Certificate of Eligibility (or award letter) right away. If we
                deny your application, you can download your denial letter.
                We’ll also mail you a copy of your decision letter.
              </li>
              <li>
                <strong>Note:</strong> In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. And we’ll contact you if we need more
                information.
              </li>
            </ul>
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>

      {!isFormSaved && <IntroductionLogin route={route} />}

      {isLoggedIn &&
      isPersonalInfoFetchFailed === false && // Ensure the error didn't occur.
      showMeb5490EMaintenanceAlert === false && // Ensure the mainenance flag is not on.
        isLOA3 && (
          <SaveInProgressIntro
            headingLevel={2}
            prefillEnabled={route.formConfig.prefillEnabled}
            messages={route.formConfig.savedFormMessages}
            pageList={route.pageList}
            startText="Start the Application"
          >
            Please complete the 22-5490 form to apply for DEPENDENTS&#39;
            APPLICATION FOR VA EDUCATION BENEFITS .
          </SaveInProgressIntro>
        )}
      <p />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.arrayOf(PropTypes.string),
    }),
    pageList: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  isFormSaved: PropTypes.bool,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isPersonalInfoFetchFailed: PropTypes.bool,
  showMeb5490EMaintenanceAlert: PropTypes.bool,
};

const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  isPersonalInfoFetchFailed: state.data?.isPersonalInfoFetchFailed || false,
  isFormSaved: state.user?.profile?.savedForms?.some(
    savedForm => savedForm.form === '22-5490',
  ),
  showMeb5490EMaintenanceAlert:
    state.featureToggles?.showMeb5490EMaintenanceAlert,
});

export default connect(mapStateToProps)(IntroductionPage);
