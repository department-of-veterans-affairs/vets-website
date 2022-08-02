import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';

import { setData } from 'platform/forms-system/src/js/actions';
import {
  getContestableIssues as getContestableIssuesAction,
  FETCH_CONTESTABLE_ISSUES_INIT,
} from '../actions';

import formConfig from '../config/form';
import { SAVED_CLAIM_TYPE } from '../constants';
import { issuesNeedUpdating, processContestableIssues } from '../utils/helpers';

export const Form0995App = ({
  loggedIn,
  location,
  children,
  profile,
  formData,
  setFormData,
  // router,
  // savedForms,
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
      if (loggedIn) {
        const { veteran = {} } = formData || {};
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
          setFormData({
            ...formData,
            veteran: {
              ...veteran,
              address: mailingAddress,
              phone: mobilePhone,
              email: email?.emailAddress,
            },
            benefitType: contestableIssues?.benefitType || formData.benefitType,
            contestedIssues: processContestableIssues(
              contestableIssues?.issues,
            ),
            legacyCount: contestableIssues?.legacyCount,
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

  if (
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
