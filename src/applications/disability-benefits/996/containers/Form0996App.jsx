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

export const Form0996App = ({
  loggedIn,
  location,
  children,
  profile,
  formData,
  setFormData,
  router,
  savedForms,
  hlrV2,
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
          setIsLoadingIssues(true);
          const benefitType =
            sessionStorage.getItem(SAVED_CLAIM_TYPE) || formData.benefitType;
          getContestableIssues({ benefitType, hlrV2 });
        } else if (
          formData?.benefitType !== contestableIssues?.benefitType ||
          email?.emailAddress !== veteran.email ||
          mobilePhone?.updatedAt !== veteran.phone?.updatedAt ||
          mailingAddress?.updatedAt !== veteran.address?.updatedAt ||
          (typeof hlrV2 !== 'undefined' &&
            typeof formData.hlrV2 === 'undefined') ||
          issuesNeedUpdating(
            contestableIssues?.issues,
            formData?.contestedIssues,
          ) ||
          contestableIssues.legacyCount !== formData.legacyCount
        ) {
          setFormData({
            ...formData,
            hlrV2,
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
            legacyCount: contestableIssues?.legacyCount || 0,
          });
        } else if (
          formData.hlrV2 && // easier to test formData.hlrV2 with SiP menu
          (areaOfDisagreement?.length !== formData.areaOfDisagreement?.length ||
            !areaOfDisagreement.every(
              (entry, index) =>
                getIssueNameAndDate(entry) ===
                getIssueNameAndDate(formData.areaOfDisagreement[index]),
            ))
        ) {
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
      hlrV2,
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
  loggedIn: PropTypes.bool,
  formData: PropTypes.shape({}),
  profile: PropTypes.shape({}),
  savedForms: PropTypes.array,
  hlrV2: PropTypes.bool,
  contestableIssues: PropTypes.shape({}),
  setFormData: PropTypes.func.isRequired,
  getContestableIssues: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  formData: state.form?.data || {},
  profile: selectProfile(state) || {},
  savedForms: state.user?.profile?.savedForms || [],
  hlrV2: state.featureToggles?.hlrV2,
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
