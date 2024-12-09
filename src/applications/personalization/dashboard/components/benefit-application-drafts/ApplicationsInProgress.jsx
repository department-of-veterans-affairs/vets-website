import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import PropTypes from 'prop-types';
import { selectProfile } from '~/platform/user/selectors';

import {
  filterOutExpiredForms,
  isSIPEnabledForm,
  presentableFormIDs,
  sipFormSorter,
  normalizeSubmissionStatus,
} from '~/applications/personalization/dashboard/helpers';

import { MY_VA_SIP_FORMS } from '~/platform/forms/constants';
import { getFormLink } from '~/platform/forms/helpers';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import DraftCard from './DraftCard';
import MissingApplicationHelp from './MissingApplicationHelp';
import SubmissionCard from './SubmissionCard';
import Error from './Error';

const ApplicationsInProgress = ({
  submittedError,
  submittedForms,
  savedForms,
  hideH3,
}) => {
  // Filter out non-SIP-enabled applications and expired applications
  const verifiedSavedForms = useMemo(
    () =>
      savedForms
        .filter(isSIPEnabledForm)
        .filter(filterOutExpiredForms)
        .sort(sipFormSorter),
    [savedForms],
  );

  const transformedSavedForms = useMemo(
    () =>
      verifiedSavedForms.map(form => {
        const { form: formId, lastUpdated, metadata } = form;
        return {
          ...metadata,
          form: formId,
          lastUpdated,
        };
      }),
    [verifiedSavedForms],
  );

  // Renaming updatedAt to lastUpdated, formType to form, and converting datetime to UNIX time
  const transformedStatusForms = useMemo(
    () =>
      submittedForms.map(form => {
        const {
          formType,
          createdAt,
          updatedAt,
          status,
          ...rest
        } = form.attributes;
        return {
          ...rest,
          status,
          form: formType,
          createdAt: getUnixTime(new Date(createdAt)),
          lastUpdated: getUnixTime(new Date(updatedAt)),
        };
      }),
    [submittedForms],
  );

  const allForms = useMemo(
    () =>
      transformedSavedForms
        .concat(transformedStatusForms)
        .sort((a, b) => b.lastUpdated - a.lastUpdated),
    [transformedSavedForms, transformedStatusForms],
  );

  const isEmptyState = allForms.length === 0 && !submittedError;
  const hasForms = allForms.length > 0 && !submittedError;

  const emptyStateText = 'You have no benefit applications or forms to show.';

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

      <DashboardWidgetWrapper>
        {submittedError && <Error />}
        {isEmptyState && (
          <>
            <p data-testid="applications-in-progress-empty-state">
              {emptyStateText}
            </p>
            <MissingApplicationHelp />
          </>
        )}
        {hasForms && (
          <div>
            {allForms.map(form => {
              const formId = form.form;
              const formStatus = form.status;
              const formTitle = `application for ${
                MY_VA_SIP_FORMS.find(e => e.id === formId).benefit
              }`;
              const presentableFormId = presentableFormIDs[formId];
              const { lastUpdated } = form || {};
              const lastSavedDate = format(
                fromUnixTime(lastUpdated),
                'MMMM d, yyyy',
              );

              if (Object.hasOwn(form, 'savedAt')) {
                // if form is draft, then render Draft Card
                const { expiresAt } = form || {};
                const expirationDate = format(
                  fromUnixTime(expiresAt),
                  'MMMM d, yyyy',
                );
                const continueUrl = `${getFormLink(formId)}resume`;
                // TODO: consider combining all "Application Cards" into single component
                return (
                  <DraftCard
                    key={formId}
                    continueUrl={continueUrl}
                    expirationDate={expirationDate}
                    formId={formId}
                    formTitle={formTitle}
                    lastSavedDate={lastSavedDate}
                    presentableFormId={presentableFormId}
                  />
                );
              }

              if (formStatus) {
                // if form is not a Draft and has status, render Status Card
                const { createdAt } = form || {};
                const submittedDate = format(
                  fromUnixTime(createdAt),
                  'MMMM d, yyyy',
                );
                return (
                  <SubmissionCard
                    key={formId}
                    formId={formId}
                    formTitle={formTitle}
                    lastSavedDate={lastSavedDate}
                    submittedDate={submittedDate}
                    presentableFormId={presentableFormId}
                    status={normalizeSubmissionStatus(formStatus)}
                  />
                );
              }

              return null;
            })}
            <MissingApplicationHelp />
          </div>
        )}
      </DashboardWidgetWrapper>
    </div>
  );
};

ApplicationsInProgress.propTypes = {
  hideH3: PropTypes.bool,
  savedForms: PropTypes.array,
  submittedError: PropTypes.bool, // bool error for _any_ error in request for "submitted forms"
  submittedForms: PropTypes.array,
};

const mapStateToProps = state => {
  // normalize full vs. partial errors into a single true/false value and provide as prop
  const submittedError =
    !!state.submittedForms.error || state.submittedForms.errors?.length > 0;

  return {
    savedForms: selectProfile(state).savedForms || [],
    submittedForms: state.submittedForms.forms || [],
    submittedError,
  };
};

export default connect(mapStateToProps)(ApplicationsInProgress);
