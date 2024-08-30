import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import PropTypes from 'prop-types';
import { selectProfile } from '~/platform/user/selectors';
import { Toggler } from '~/platform/utilities/feature-toggles';

import {
  filterOutExpiredForms,
  isSIPEnabledFormV2,
  presentableFormIDsV2,
  sipFormSorter,
  normalizeSubmissionStatus,
} from '~/applications/personalization/dashboard/helpers';

import { MY_VA_SIP_FORMS } from '~/platform/forms/constants';
import { getFormLink } from '~/platform/forms/helpers';

import ApplicationInProgress from './ApplicationInProgress';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import DraftCard from './DraftCard';
import MissingApplicationHelp from './MissingApplicationHelp';
import SubmissionCard from './SubmissionCard';

const ApplicationsInProgress = ({
  submittedForms,
  savedForms,
  hideH3,
  isLOA1,
}) => {
  // Filter out non-SIP-enabled applications and expired applications
  const verifiedSavedForms = useMemo(
    () =>
      savedForms
        .filter(isSIPEnabledFormV2)
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

      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaFormSubmissionStatuses}>
        <DashboardWidgetWrapper>
          {allForms.length > 0 ? (
            <div>
              <Toggler.Enabled>
                {allForms.map(form => {
                  const formId = form.form;
                  const formStatus = form.status;
                  const formTitle = `application for ${
                    MY_VA_SIP_FORMS.find(e => e.id === formId).benefit
                  }`;
                  const presentableFormId = presentableFormIDsV2[formId];
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
              </Toggler.Enabled>
              <Toggler.Disabled>
                {verifiedSavedForms.map(form => {
                  const formId = form.form;
                  const formTitle = `application for ${
                    MY_VA_SIP_FORMS.find(e => e.id === formId).benefit
                  }`;
                  const presentableFormId = presentableFormIDsV2[formId];
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
              </Toggler.Disabled>
            </div>
          ) : (
            <p data-testid="applications-in-progress-empty-state">
              {emptyStateText}
            </p>
          )}
          <Toggler.Enabled>
            <MissingApplicationHelp />
          </Toggler.Enabled>
        </DashboardWidgetWrapper>
      </Toggler>
    </div>
  );
};

ApplicationsInProgress.propTypes = {
  hideH3: PropTypes.bool,
  isLOA1: PropTypes.bool,
  savedForms: PropTypes.array,
  submittedForms: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    savedForms: selectProfile(state).savedForms || [],
    submittedForms: state.submittedForms.forms || [],
  };
};

export default connect(mapStateToProps)(ApplicationsInProgress);
