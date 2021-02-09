import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { selectProfile } from '~/platform/user/selectors';
import {
  formLinks,
  formTitles,
  isSIPEnabledForm,
  presentableFormIDs,
  recordDashboardClick,
  sipFormSorter,
} from '~/applications/personalization/dashboard/helpers';

const ApplicationInProgress = ({
  continueUrl,
  expirationDate,
  formId,
  formTitle,
  lastOpenedDate,
}) => {
  return (
    <div className="vads-u-display--flex vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4 medium-screen:vads-u-padding-right--3 vads-u-padding-bottom--3">
      <div className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-background-color--gray-lightest vads-u-padding--2p5">
        <div>
          <div style={{ textTransform: 'uppercase' }}>{formId}</div>
          <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
            {formTitle}
          </h4>
          <div className="vads-u-display--flex">
            <i
              aria-hidden="true"
              className={`fas fa-fw fa-exclamation-circle vads-u-margin-right--1 vads-u-margin-top--0p5`}
            />
            <div>
              <p className="vads-u-margin-top--0">
                Application expires on: {expirationDate}
              </p>
              <p>Last opened on: {lastOpenedDate}</p>
            </div>
          </div>
        </div>
        <a
          className="usa-button usa-button-primary"
          aria-label={`Continue your ${formTitle}`}
          href={continueUrl}
          onClick={recordDashboardClick(formId, 'continue-button')}
        >
          Continue your application
        </a>
      </div>
    </div>
  );
};

const ApplyForBenefits = ({ savedForms }) => {
  return (
    <div>
      <h2>Apply for benefits</h2>
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        Applications in progress
      </h3>
      {savedForms.length > 0 && (
        <div className="vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            {savedForms.map(form => {
              const formId = form.form;
              const formTitle = `Application for ${formTitles[formId]}`;
              const presentableFormId = presentableFormIDs[formId];
              const { lastUpdated, expiresAt } = form.metadata;
              const lastOpenedDate = moment
                .unix(lastUpdated)
                .format('MMMM D, YYYY');
              const expirationDate = moment
                .unix(expiresAt)
                .format('MMMM D, YYYY');
              const continueUrl = `${formLinks[formId]}resume`;
              return (
                <ApplicationInProgress
                  key={formId}
                  formId={presentableFormId}
                  formTitle={formTitle}
                  lastOpenedDate={lastOpenedDate}
                  expirationDate={expirationDate}
                  continueUrl={continueUrl}
                />
              );
            })}
          </div>
        </div>
      )}
      {!savedForms.length && <p>You have no applications in progress.</p>}
    </div>
  );
};

const mapStateToProps = state => {
  const profileState = selectProfile(state);
  const { savedForms } = profileState;
  // const savedForms = [
  //   {
  //     form: '21P-527EZ',
  //     metadata: {
  //       version: 3,
  //       returnUrl: '/military/reserve-national-guard',
  //       savedAt: 1604951152710,
  //       expiresAt: 1610135152,
  //       lastUpdated: 1604951152,
  //       inProgressFormId: 5105,
  //     },
  //     lastUpdated: 1604951152,
  //   },
  //   {
  //     form: '28-1900',
  //     metadata: {
  //       version: 0,
  //       returnUrl: '/communication-preferences',
  //       savedAt: 1611946775267,
  //       submission: {
  //         status: false,
  //         errorMessage: false,
  //         id: false,
  //         timestamp: false,
  //         hasAttemptedSubmit: false,
  //       },
  //       expiresAt: 1617130775,
  //       lastUpdated: 1611946775,
  //       inProgressFormId: 9332,
  //     },
  //     lastUpdated: 1611946775,
  //   },
  //   {
  //     form: '686C-674',
  //     metadata: {
  //       version: 1,
  //       returnUrl: '/net-worth',
  //       savedAt: 1607012813063,
  //       submission: {
  //         status: false,
  //         errorMessage: false,
  //         id: false,
  //         timestamp: false,
  //         hasAttemptedSubmit: false,
  //       },
  //       expiresAt: 1612196813,
  //       lastUpdated: 1607012813,
  //       inProgressFormId: 5179,
  //     },
  //     lastUpdated: 1607012813,
  //   },
  //   {
  //     form: '28-8832',
  //     metadata: {
  //       version: 0,
  //       returnUrl: '/claimant-information',
  //       savedAt: 1611192804861,
  //       submission: {
  //         status: false,
  //         errorMessage: false,
  //         id: false,
  //         timestamp: false,
  //         hasAttemptedSubmit: false,
  //       },
  //       expiresAt: 1616376805,
  //       lastUpdated: 1611192805,
  //       inProgressFormId: 9240,
  //     },
  //     lastUpdated: 1611192805,
  //   },
  //   {
  //     form: '21-526EZ',
  //     metadata: {
  //       version: 6,
  //       returnUrl: '/review-veteran-details/separation-location',
  //       savedAt: 1612535290474,
  //       submission: {
  //         status: false,
  //         errorMessage: false,
  //         id: false,
  //         timestamp: false,
  //         hasAttemptedSubmit: false,
  //       },
  //       expiresAt: 1644071290,
  //       lastUpdated: 1612535290,
  //       inProgressFormId: 9374,
  //     },
  //     lastUpdated: 1612535290,
  //   },
  // ];
  const verifiedSavedForms = savedForms
    .filter(isSIPEnabledForm)
    .sort(sipFormSorter);

  return { savedForms: verifiedSavedForms };
};

export default connect(mapStateToProps)(ApplyForBenefits);
