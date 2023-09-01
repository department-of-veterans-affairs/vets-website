import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  isLOA3 as isLOA3Selector,
  selectProfile,
} from '~/platform/user/selectors';

import {
  filterOutExpiredForms,
  formLinks,
  formBenefits,
  isSIPEnabledForm,
  presentableFormIDs,
  sipFormSorter,
} from '~/applications/personalization/dashboard/helpers';

import ApplicationInProgress from './ApplicationInProgress';

const ApplicationsInProgress = ({ savedForms, hideH3, isLOA3 }) => {
  // Filter out non-SIP-enabled applications and expired applications
  const verifiedSavedForms = useMemo(
    () =>
      savedForms
        .filter(isSIPEnabledForm)
        .filter(filterOutExpiredForms)
        .sort(sipFormSorter),
    [savedForms],
  );

  // if LOA3 then show 'You have no benefit application drafts to show.', otherwise show 'You have no applications in progress.'
  const emptyStateText = isLOA3
    ? 'You have no benefit application drafts to show.'
    : 'You have no applications in progress.';

  return (
    <>
      {!hideH3 && (
        <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
          Applications in progress
        </h3>
      )}

      {verifiedSavedForms.length > 0 ? (
        <div className="vads-l-row">
          {verifiedSavedForms.map(form => {
            const formId = form.form;
            const formTitle = `application for ${formBenefits[formId]}`;
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
      ) : (
        <p>{emptyStateText}</p>
      )}
    </>
  );
};

ApplicationsInProgress.propTypes = {
  hideH3: PropTypes.bool,
  isLOA3: PropTypes.bool,
  savedForms: PropTypes.array,
};

const mapStateToProps = state => {
  const isLOA3 = isLOA3Selector(state);

  return {
    savedForms: selectProfile(state).savedForms || [],
    isLOA3,
  };
};

export default connect(mapStateToProps)(ApplicationsInProgress);
