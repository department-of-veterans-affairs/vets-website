import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ShowAlertOrSip from '../components/shared/ShowAlertOrSip';
import IntroProcessList from '../components/shared/IntroProcessList';
import { clearJobIndex } from '../utils/session';

const IntroductionPage = ({
  route,
  location,
  user,
  formId: formIdFromState,
}) => {
  useEffect(() => {
    focusElement('h1');
    clearJobIndex();
  }, []);

  if (!route || !route.formConfig || !route.pageList) {
    return <VaLoadingIndicator message="Loading..." />;
  }

  const { formConfig, pageList } = route;
  const {
    formId = formIdFromState,
    prefillEnabled,
    savedFormMessages,
    downtime,
  } = formConfig;

  const sipOptions = {
    formId,
    startText: 'Start your request now',
    unauthStartText: 'Sign in or create an account',
    messages: savedFormMessages,
    gaStartEventName: 'fsr-request-debt-help-form-5655',
    pageList,
    formConfig,
    retentionPeriod: '60 days',
    downtime,
    prefillEnabled,
    hideUnauthedStartLink: true,
    useActionLinks: true,
  };

  return (
    <div className="fsr-introduction schemaform-intro">
      <FormTitle
        title="Request help with VA debt for overpayments and copay bills"
        subTitle="Financial Status Report (VA Form 5655)"
      />
      <p>
        If you’re a Veteran who needs to request certain types of help with a VA
        benefit overpayment or health care copay debt, you can request help
        online now.
      </p>
      <ShowAlertOrSip
        basename={location?.basename || ''}
        sipOptions={sipOptions}
      />
      <h2 className="vads-u-font-size--h3">
        Follow these steps to request help
      </h2>
      <IntroProcessList />
      <div className="vads-u-margin-y--4">
        <ShowAlertOrSip
          user={user}
          basename={location?.basename || ''}
          sipOptions={sipOptions}
          bottom
        />
      </div>
      <va-omb-info
        res-burden={60}
        omb-number="2900-0165"
        exp-date="11/30/2026"
        class="vads-u-margin-top--2"
        uswds
      />
    </div>
  );
};

const mapStateToProps = state => ({
  formId: state.form.formId,
  user: state.user,
  location: state.location,
});

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.array.isRequired,
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      downtime: PropTypes.object,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      verifyRequiredPrefill: PropTypes.string,
    }).isRequired,
  }).isRequired,
  formId: PropTypes.string,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  user: PropTypes.shape({}),
};

export default connect(mapStateToProps)(IntroductionPage);
