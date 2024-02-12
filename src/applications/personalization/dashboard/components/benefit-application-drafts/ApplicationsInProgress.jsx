import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { format, fromUnixTime } from 'date-fns';
import PropTypes from 'prop-types';
import { selectProfile } from '~/platform/user/selectors';

import {
  filterOutExpiredForms,
  isSIPEnabledForm,
  presentableFormIDs,
  sipFormSorter,
} from '~/applications/personalization/dashboard/helpers';

import { FORM_BENEFITS, getFormLink } from '~/platform/forms/constants';

import ApplicationInProgress from './ApplicationInProgress';

const ApplicationsInProgress = ({ savedForms, hideH3, isLOA1 }) => {
  // Filter out non-SIP-enabled applications and expired applications
  const verifiedSavedForms = useMemo(
    () =>
      savedForms
        .filter(isSIPEnabledForm)
        .filter(filterOutExpiredForms)
        .sort(sipFormSorter),
    [savedForms],
  );

  // if LOA1 then show 'You have no benefit application drafts to show.', otherwise show 'You have no applications in progress.'
  const emptyStateText = isLOA1
    ? 'You have no benefit application drafts to show.'
    : 'You have no applications in progress.';

  return (
    <div data-testid="applications-in-progress">
      {!hideH3 && (
        <h3
          className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5"
          data-testid="applications-in-progress-header"
        >
          Applications in progress
        </h3>
      )}

      {verifiedSavedForms.length > 0 ? (
        <div className="vads-l-row">
          {verifiedSavedForms.map(form => {
            const formId = form.form;
            const formTitle = `application for ${FORM_BENEFITS[formId]}`;
            const presentableFormId = presentableFormIDs[formId];
            const { lastUpdated, expiresAt } = form.metadata || {};
            const lastSavedDate = format(
              fromUnixTime(lastUpdated),
              'MMMM d, yyyy',
            );
            const expirationDate = format(
              fromUnixTime(expiresAt),
              'MMMM d, yyyy',
            );
            const continueUrl = `${getFormLink(formId)}resume`;
            return (
              <ApplicationInProgress
                key={formId}
                continueUrl={continueUrl}
                expirationDate={expirationDate}
                formId={formId}
                formTitle={formTitle}
                lastSavedDate={lastSavedDate}
                presentableFormId={presentableFormId}
              />
            );
          })}
        </div>
      ) : (
        <p data-testid="applications-in-progress-empty-state">
          {emptyStateText}
        </p>
      )}
    </div>
  );
};

ApplicationsInProgress.propTypes = {
  hideH3: PropTypes.bool,
  isLOA1: PropTypes.bool,
  savedForms: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    savedForms: selectProfile(state).savedForms || [],
  };
};

export default connect(mapStateToProps)(ApplicationsInProgress);
