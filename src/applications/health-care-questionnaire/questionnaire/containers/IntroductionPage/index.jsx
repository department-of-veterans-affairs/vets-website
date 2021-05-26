import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import PrivacyAct from '../../components/legal/PrivacyAct';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import IntroductionPageHelpers from '../../components/introduction-page';
import NeedHelpSmall from '../../../shared/components/footer/NeedHelpSmall';

import environment from 'platform/utilities/environment';
import { removeFormApi } from 'platform/forms/save-in-progress/api';

import { selectQuestionnaireContext } from '../../../shared/redux-selectors';
import {
  organizationSelector,
  appointmentSelector,
  locationSelector,
} from '../../../shared/utils/selectors';

const IntroductionPage = props => {
  const { isLoggedIn, route, savedForms, formId } = props;
  const { appointment, location, organization } = props?.context;
  if (!appointment?.id) {
    return (
      <>
        <LoadingIndicator message="Please wait while we load your appointment details..." />
      </>
    );
  }

  const facilityName = organizationSelector.getName(organization);
  const appointmentTime = appointmentSelector.getStartDateTime(appointment);
  let expirationTime = appointmentTime;

  if (expirationTime) {
    expirationTime = moment(expirationTime).format('MM/DD/YYYY');
  }

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

    const appointmentInPast = moment(appointmentTime).isSameOrBefore(
      moment(new Date()),
    );

    if (appointmentInPast) {
      recordEvent({
        event: `hcq-questionnaire-expired-loaded`,
      });
      return (
        <va-alert status="warning">
          <h3 slot="headline">Your questionnaire has expired</h3>
          <div> {props.route?.formConfig.saveInProgress.messages.expired}</div>
        </va-alert>
      );
    } else if (savedForm) {
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
          downtime={props.route.formConfig.downtime}
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

  const title = `Answer ${locationSelector
    .getType(location)
    ?.toLowerCase()} questionnaire`;
  const subTitle = facilityName;
  return (
    <div className="schemaform-intro healthcare-experience">
      <FormTitle title={title} subTitle={subTitle} />
      <p className="better-prepare-yours">
        Please try to fill out this questionnaire before your appointment. When
        you tell us about your symptoms and concerns, we can better prepare to
        meet your needs.
      </p>
      <section className="after-details">
        <h2>What happens after I answer the questions?</h2>
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
        <h2>Will VA protect my personal health information?</h2>
        <p>
          We make every effort to keep your personal information private and
          secure.
        </p>
        <p>
          <a href="/privacy-policy/">
            Read more about privacy and security on VA.gov
          </a>
        </p>
        <p>
          You're also responsible for protecting your personal health
          information. If you print or download your information—or share it
          electronically with others—you’ll need to take steps to protect it.
        </p>
        <p>
          <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information">
            Get tips for protecting your personal health information
          </a>
        </p>
      </section>
      <NeedHelpSmall />
      {getWelcomeMessage()}
      <div className="omb-info--container">
        <PrivacyAct expDate={expirationTime} />
      </div>
      {environment.isLocalhost() && (
        <>
          <button
            onClick={() => {
              removeFormApi(formId);
            }}
          >
            Clear SiP Data
          </button>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    pages: state?.form?.pages,
    isLoggedIn: state?.user?.login?.currentlyLoggedIn,
    context: selectQuestionnaireContext(state),
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
