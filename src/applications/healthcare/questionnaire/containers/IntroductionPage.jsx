import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import IntroductionPageHelpers from '../components/introduction-page';

const IntroductionPage = props => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const { appointment } = props?.questionnaire?.context;
  const facilityName = appointment?.vdsAppointments
    ? appointment?.vdsAppointments[0]?.clinic?.facility?.displayName
    : '';

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
          resumeOnly
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

  const title = 'Primary care questionnaire';
  const subTitle = facilityName;
  return (
    <div className="schemaform-intro healthcare-experience">
      <FormTitle title={title} subTitle={subTitle} />
      <h2 className="better-prepare-yours">
        To help us better prepare for your appointment, fill out this short
        questionnaire about your upcoming visit. This is where you can give us
        more detail about your appointment or let us know if there are any
        specific health issues you want to discuss with your provider.
      </h2>
      <section className="after-details">
        <h3>What happens after I answer the questions?</h3>
        <p>
          After you answer the questions, your questionnaire will be securely
          sent to your provider for review. The questionnaire will also be added
          to your medical record. Please try to submit the questionnaire [X]
          days before your appointment.
        </p>
        <p>
          <strong>
            Your provider will discuss the information on your questionnaire
            during your appointment.
          </strong>
        </p>
        <section className="emergency-call-out">
          <header>
            Note: If you need to talk to someone right away or need emergency
            care,
          </header>
          <ul>
            <li>
              Call <Telephone contact="911" />, or
            </li>
            <li>
              Call the Veterans Crisis hotline at{' '}
              <Telephone contact="800-273-8255" /> and select 1
            </li>
          </ul>
        </section>
      </section>
      <section className="personal-information">
        <h3>
          How will VA protect my personal and health information if I answer
          these questions?
        </h3>
        <p>
          Like your medical record, we’ll keep the information you enter in the
          questionnaire private.
        </p>
        <section>
          <header>
            <strong>
              To protect your privacy and your personal and health information,
              we:
            </strong>
          </header>
          <ul>
            <li>Share your information only with your provider</li>
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
        </section>
      </section>

      {getWelcomeMessage()}
      <div className="omb-info--container">
        <OMBInfo ombNumber="0000-0000" expDate="mm/dd/yyyy" />
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
