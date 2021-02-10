import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import IntroductionPageHelpers from '../components/introduction-page';

import { getAppointTypeFromAppointment } from '../utils';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const { appointment } = props?.questionnaire?.context;
  if (!appointment?.attributes) {
    return <></>;
  }
  const appointmentData = appointment?.attributes?.vdsAppointments
    ? appointment?.attributes?.vdsAppointments[0]
    : {};

  const facilityName = appointmentData.clinic?.facility?.displayName || '';
  let expirationTime = appointmentData.appointmentTime || '';

  if (expirationTime) {
    expirationTime = moment(expirationTime).format('MM/DD/YYYY');
  }

  const { isLoggedIn, route, savedForms, formId } = props;

  const savedForm = savedForms.find(f => f.form === formId);
  const showLoginModel = () => props.toggleLoginModal(true, 'cta-form');

  const getWelcomeMessage = () => {
    const UnAuthedWelcomeMessage = () => (
      <IntroductionPageHelpers.WelcomeAlert toggleLoginModal={showLoginModel} />
    );

    const goToFirstPage = () => {
      const firstPage = route.pageList[1];
      props.router.push(firstPage.path);
    };

    if (savedForm) {
      return (
        <SaveInProgressIntro
          hideUnauthedStartLink
          prefillEnabled={props.route?.formConfig.prefillEnabled}
          messages={props.route?.formConfig.savedFormMessages}
          pageList={props.route?.pageList}
          startText="Start the questionnaire"
          formConfig={props.route?.formConfig}
          resumeOnly={props.route?.formConfig.saveInProgress.resumeOnly}
          renderSignInMessage={UnAuthedWelcomeMessage}
        />
      );
    } else if (isLoggedIn) {
      return (
        <IntroductionPageHelpers.AuthedMessage goToFirstPage={goToFirstPage} />
      );
    } else {
      return <UnAuthedWelcomeMessage />;
    }
  };

  const title = `Answer ${getAppointTypeFromAppointment(
    appointment,
  )} questionnaire`;
  const subTitle = facilityName;
  return (
    <div className="schemaform-intro healthcare-experience">
      <FormTitle title={title} subTitle={subTitle} />
      <h2 className="better-prepare-yours">
        Please try to fill out this questionnaire at least [X] days before your
        appointment. When you tell us about your symptoms and concerns, we can
        better prepare to meet your needs.
      </h2>
      <section className="after-details">
        <h3>What happens after I answer the questions?</h3>
        <p>
          We’ll send your completed questionnaire to your provider through a
          secure electronic communication. We’ll also add the questionnaire to
          your medical record.
        </p>
        <p>
          <strong>
            Your provider will review your answers and discuss them with you
            during your appointment.
          </strong>
        </p>
      </section>
      <section className="personal-information">
        <h3>
          How will VA protect my personal and health information if I answer
          these questions?
        </h3>
        <p>
          We keep all of the information in your medical record private and
          secure. This includes any information you share in this questionnaire.
        </p>
        <section>
          <header>
            <strong>
              To protect your privacy and your personal and health information,
              we:
            </strong>
          </header>
          <ul>
            <li>
              Share your information with only the people who need it as part of
              providing your health care
            </li>
            <li>
              Store all information in our secure electronic systems, and
              encrypt all sensitive data
            </li>
            <li>
              Require all VA employees who handle sensitive data to take
              required training and ongoing education courses on privacy and
              data security
            </li>
          </ul>
          <p>
            If you print or download a copy of your questionnaire, you’ll need
            to take responsibility for protecting that information.
          </p>
        </section>
      </section>
      <section className="emergency-call-out">
        <header>
          <strong>Note:</strong> If you need to talk to someone right away or
          need emergency care,
        </header>
        <ul>
          <li>
            Call <Telephone contact="911" />, <strong>or</strong>
          </li>
          <li>
            Call the Veterans Crisis hotline at{' '}
            <Telephone contact="800-273-8255" /> and select 1
          </li>
        </ul>
      </section>
      {getWelcomeMessage()}
      <div className="omb-info--container">
        <OMBInfo expDate={expirationTime} />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    pages: state?.form?.pages,
    isLoggedIn: state?.user?.login?.currentlyLoggedIn,
    questionnaire: state?.questionnaireData,
    savedForms: state?.user?.profile?.savedForms,
    formId: state.form.formId,
    form: state.form,
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
