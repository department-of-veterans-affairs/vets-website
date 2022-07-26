import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  getContestableIssues as getContestableIssuesAction,
  FETCH_CONTESTABLE_ISSUES_INIT,
} from '../actions';

import formConfig from '../config/form';
import { SAVED_CLAIM_TYPE } from '../constants';
import { getHlrWizardStatus, shouldShowWizard } from '../wizard/utils';
import {
  issuesNeedUpdating,
  getSelected,
  getIssueNameAndDate,
  processContestableIssues,
} from '../utils/helpers';
import { copyAreaOfDisagreementOptions } from '../utils/disagreement';
import forcedMigrations from '../migrations/forceMigrations';

export const Form0996App = ({
  loggedIn,
  location,
  children,
  profile,
  formData,
  setFormData,
  router,
  savedForms,
  getContestableIssues,
  contestableIssues = {},
  legacyCount,
}) => {
  const { email = {}, mobilePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};
  // Make sure we're only loading issues once - see
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/33931
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);

  useEffect(
    () => {
      if (loggedIn && getHlrWizardStatus() === WIZARD_STATUS_COMPLETE) {
        const { veteran = {} } = formData || {};
        const areaOfDisagreement = getSelected(formData);
        if (!isLoadingIssues && (contestableIssues?.status || '') === '') {
          // load benefit type contestable issues
          setIsLoadingIssues(true);
          const benefitType =
            sessionStorage.getItem(SAVED_CLAIM_TYPE) || formData.benefitType;
          getContestableIssues({ benefitType });
        } else if (
          formData?.benefitType !== contestableIssues?.benefitType ||
          email?.emailAddress !== veteran.email ||
          mobilePhone?.updatedAt !== veteran.phone?.updatedAt ||
          mailingAddress?.updatedAt !== veteran.address?.updatedAt ||
          issuesNeedUpdating(
            contestableIssues?.issues,
            formData?.contestedIssues,
          ) ||
          contestableIssues.legacyCount !== formData.legacyCount
        ) {
          /**
           * Force HLR v2 update
           * The migration itself should handle this, but it only calls the
           * function if the save-in-progress version number changes (migration
           * length in form config). Since Lighthouse is reporting seeing v1
           * submissions still, we need to prevent v1 data from being submitted
           */
          const data = formData?.informalConferenceRep?.name
            ? forcedMigrations(formData)
            : formData;

          /** Update dynamic data:
           * user changed address, phone, email
           * user changed benefit type
           * changes to contestable issues (from a backend update)
           */
          setFormData({
            ...data,
            veteran: {
              ...veteran,
              address: mailingAddress,
              phone: mobilePhone,
              email: email?.emailAddress,
            },
            // Add benefitType from wizard
            benefitType: contestableIssues?.benefitType || formData.benefitType,
            contestedIssues: processContestableIssues(
              contestableIssues?.issues,
            ),
            legacyCount: contestableIssues?.legacyCount,
          });
        } else if (
          areaOfDisagreement?.length !== formData.areaOfDisagreement?.length ||
          !areaOfDisagreement.every(
            (entry, index) =>
              getIssueNameAndDate(entry) ===
              getIssueNameAndDate(formData.areaOfDisagreement[index]),
          )
        ) {
          // Area of Disagreement is created by combining the loaded contestable
          // issues with the Veteran-added additional issues
          setFormData({
            ...formData,
            // save existing settings
            areaOfDisagreement: copyAreaOfDisagreementOptions(
              areaOfDisagreement,
              formData.areaOfDisagreement,
            ),
          });
        }
      }
    },
    [
      loggedIn,
      email,
      mobilePhone,
      mailingAddress,
      formData,
      setFormData,
      contestableIssues,
      isLoadingIssues,
      getContestableIssues,
      legacyCount,
    ],
  );

  let content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  if (shouldShowWizard(formConfig.formId, savedForms)) {
    router.push('/start');
    content = (
      <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
        <va-loading-indicator message="Please wait while we restart the application for you." />
      </h1>
    );
  } else if (
    loggedIn &&
    ((contestableIssues?.status || '') === '' ||
      contestableIssues?.status === FETCH_CONTESTABLE_ISSUES_INIT)
  ) {
    content = (
      <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
        <va-loading-indicator
          set-focus
          message="Loading your previous decisions..."
        />
      </h1>
    );
  }

  // Add data-location attribute to allow styling specific pages
  return (
    <article id="form-0996" data-location={`${location?.pathname?.slice(1)}`}>
      {content}
    </article>
  );
};

Form0996App.propTypes = {
  getContestableIssues: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  children: PropTypes.any,
  contestableIssues: PropTypes.shape({}),
  formData: PropTypes.shape({
    additionalIssues: PropTypes.array,
    areaOfDisagreement: PropTypes.array,
    benefitType: PropTypes.string,
    contestedIssues: PropTypes.array,
    legacyCount: PropTypes.number,
    informalConferenceRep: PropTypes.shape({}),
  }),
  legacyCount: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  profile: PropTypes.shape({
    vapContactInfo: PropTypes.shape({}),
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  savedForms: PropTypes.array,
};

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  formData: state.form?.data || {},
  profile: selectProfile(state) || {},
  savedForms: state.user?.profile?.savedForms || [],
  contestableIssues: state.contestableIssues || {},
  legacyCount: state.legacyCount || 0,
});

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form0996App);
