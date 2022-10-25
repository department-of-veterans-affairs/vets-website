import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';

import { setData } from 'platform/forms-system/src/js/actions';
import { getStoredSubTask } from 'platform/forms/sub-task';

import {
  getContestableIssues as getContestableIssuesAction,
  FETCH_CONTESTABLE_ISSUES_INIT,
} from '../actions';

import formConfig from '../config/form';
import { issuesNeedUpdating, processContestableIssues } from '../utils/helpers';

export const Form0995App = ({
  loggedIn,
  location,
  children,
  profile,
  formData,
  setFormData,
  router,
  // savedForms,
  getContestableIssues,
  contestableIssues = {},
  legacyCount,
}) => {
  const { email = {}, homePhone = {}, mobilePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};

  // Make sure we're only loading issues once - see
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/33931
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);

  const subTaskBenefitType =
    formData?.benefitType || getStoredSubTask()?.benefitType;

  useEffect(
    () => {
      // form data is reset after logging in and from the save-in-progress data,
      // so get it from the session storage
      if (!formData.benefitType && subTaskBenefitType) {
        setFormData({
          ...formData,
          benefitType: subTaskBenefitType,
        });
      } else if (loggedIn && formData.benefitType) {
        const { veteran = {} } = formData || {};
        if (!isLoadingIssues && (contestableIssues?.status || '') === '') {
          // load benefit type contestable issues
          setIsLoadingIssues(true);
          getContestableIssues({ benefitType: formData.benefitType });
        } else if (
          email?.emailAddress !== veteran.email ||
          homePhone?.updatedAt !== veteran.homePhone?.updatedAt ||
          mobilePhone?.updatedAt !== veteran.mobilePhone?.updatedAt ||
          mailingAddress?.updatedAt !== veteran.address?.updatedAt ||
          issuesNeedUpdating(
            contestableIssues?.issues,
            formData?.contestedIssues,
          ) ||
          contestableIssues.legacyCount !== formData.legacyCount
        ) {
          // resetStoredSubTask();
          setFormData({
            ...formData,
            veteran: {
              ...veteran,
              address: mailingAddress,
              mobilePhone,
              homePhone,
              email: email?.emailAddress,
            },
            contestedIssues: processContestableIssues(
              contestableIssues?.issues,
            ),
            legacyCount: contestableIssues?.legacyCount,
          });
        }
      }
    },
    [
      contestableIssues,
      email,
      formData,
      getContestableIssues,
      homePhone,
      isLoadingIssues,
      legacyCount,
      loggedIn,
      mailingAddress,
      mobilePhone,
      setFormData,
      subTaskBenefitType,
    ],
  );

  let content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  if (!subTaskBenefitType) {
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

  return (
    <article id="form-0995" data-location={`${location?.pathname?.slice(1)}`}>
      {content}
    </article>
  );
};

Form0995App.propTypes = {
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
)(Form0995App);
