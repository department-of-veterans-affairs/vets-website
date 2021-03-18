import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { selectProfile } from '~/platform/user/selectors';

import {
  filterOutExpiredForms,
  formLinks,
  formTitles,
  isSIPEnabledForm,
  presentableFormIDs,
  sipFormSorter,
} from '~/applications/personalization/dashboard/helpers';

import ApplicationInProgress from './ApplicationInProgress';

const ApplicationsInProgress = ({ savedForms }) => {
  // Filter out non-SIP-enabled applications and expired applications
  const verifiedSavedForms = useMemo(
    () =>
      savedForms
        .filter(isSIPEnabledForm)
        .filter(filterOutExpiredForms)
        .sort(sipFormSorter),
    [savedForms],
  );

  return (
    <>
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        Applications in progress
      </h3>

      {verifiedSavedForms.length > 0 && (
        <div className="vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            {verifiedSavedForms.map(form => {
              const formId = form.form;
              const formTitle = `application for ${formTitles[formId]}`;
              const presentableFormId = presentableFormIDs[formId];
              const { lastUpdated, expiresAt } = form.metadata || {};
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
                  continueUrl={continueUrl}
                  expirationDate={expirationDate}
                  formId={formId}
                  formTitle={formTitle}
                  lastOpenedDate={lastOpenedDate}
                  presentableFormId={presentableFormId}
                />
              );
            })}
          </div>
        </div>
      )}
      {!verifiedSavedForms.length && (
        <p>You have no applications in progress.</p>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  savedForms: selectProfile(state).savedForms || [],
});

export default connect(mapStateToProps)(ApplicationsInProgress);
