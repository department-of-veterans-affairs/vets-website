import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { scrollToTop } from 'platform/utilities/scroll';
import environment from 'platform/utilities/environment';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import i18nDebtApp from '../i18n';
import ShowAlertOrSip from '../components/ShowAlertOrSip';

export const IntroductionPage = props => {
  const { route, location, user } = props;

  const { formConfig, pageList } = route;

  const {
    formId = formConfig.formId,
    prefillEnabled,
    savedFormMessages,
    downtime,
  } = formConfig;

  const { useToggleValue, useToggleLoadingValue, TOGGLE_NAMES } =
    useFeatureToggle();
  const disputeDebtActive = useToggleValue(TOGGLE_NAMES.disputeDebt);
  const isLoadingFeatures = useToggleLoadingValue();

  const sipOptions = {
    formId,
    startText: i18nDebtApp.t('sip-options.start-text'),
    unauthStartText: i18nDebtApp.t('sip-options.unauth-start-text'),
    messages: savedFormMessages,
    gaStartEventName: 'digital-dispute-request',
    pageList,
    formConfig,
    retentionPeriod: i18nDebtApp.t('sip-options.retention-period'),
    downtime,
    prefillEnabled,
    hideUnauthedStartLink: true,
    useActionLinks: true,
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  // Show loading indicator while feature flags are loading
  if (isLoadingFeatures) {
    return (
      <va-loading-indicator
        label={i18nDebtApp.t('loading-indicator.label')}
        message={i18nDebtApp.t('loading-indicator.message')}
        set-focus
      />
    );
  }

  const FormInstructions = () => (
    <div>
      <p className="va-introtext">
        {i18nDebtApp.t('form-intro.info.about-form')}
      </p>
      <h2>{i18nDebtApp.t('form-intro.info.before-form')}</h2>
      <div>
        <ul>
          <li>
            {i18nDebtApp.t('form-intro.info.form-usage')}
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/health-care/pay-copay-bill/dispute-charges/"
                text={i18nDebtApp.t('form-intro.info.dispute-charges-link')}
              />
            </span>
          </li>
          <li>{i18nDebtApp.t('form-intro.info.payments-note')} </li>
        </ul>
      </div>
    </div>
  );

  const VaAlertFormIntro = () => (
    <va-alert status="error" visible>
      <h2 slot="headline">{i18nDebtApp.t('form-intro.alert.title')}</h2>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        {i18nDebtApp.t('form-intro.alert.description')}
      </p>
      <a
        className="vads-c-action-link--green vads-u-margin-top--1p5"
        href={`${environment.BASE_URL}`}
      >
        {i18nDebtApp.t('form-intro.alert.link')}
      </a>
    </va-alert>
  );

  return (
    <article className="schemaform-intro">
      <FormTitle title={i18nDebtApp.t('form-intro.title')} />
      {disputeDebtActive ? (
        <>
          <FormInstructions />
          <br />
          <ShowAlertOrSip
            user={user}
            basename={location?.basename || ''}
            sipOptions={sipOptions}
            pageList={pageList}
            formConfig={formConfig}
            bottom
          />
        </>
      ) : (
        <VaAlertFormIntro />
      )}
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
      downtime: PropTypes.object,
      formId: PropTypes.string,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  user: PropTypes.shape({
    profile: PropTypes.object,
  }),
};

export default IntroductionPage;
