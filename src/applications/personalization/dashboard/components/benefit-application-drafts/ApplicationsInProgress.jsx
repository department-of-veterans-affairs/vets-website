import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import PropTypes from 'prop-types';
import { selectProfile } from '~/platform/user/selectors';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';

import {
  filterOutExpiredForms,
  isSIPEnabledForm,
  isSIPEnabledFormV2,
  presentableFormIDs,
  presentableFormIDsV2,
  sipFormSorter,
} from '~/applications/personalization/dashboard/helpers';

import { FORM_BENEFITS, MY_VA_SIP_FORMS } from '~/platform/forms/constants';
import { getFormLink } from '~/platform/forms/helpers';

import ApplicationInProgress from './ApplicationInProgress';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import Draft from './Draft';
import Received from './Received';

const ApplicationsInProgress = ({
  formsWithStatus,
  savedForms,
  hideH3,
  isLOA1,
}) => {
  // the following will be removed in issue #82798
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isUsingNewSipConfig = useToggleValue(
    TOGGLE_NAMES.myVaEnableNewSipConfig,
  );

  // Filter out non-SIP-enabled applications and expired applications
  const verifiedSavedForms = useMemo(
    () =>
      savedForms
        .filter(isUsingNewSipConfig ? isSIPEnabledFormV2 : isSIPEnabledForm)
        .filter(filterOutExpiredForms)
        .sort(sipFormSorter),
    [savedForms, isUsingNewSipConfig],
  );

  const transformedSavedForms = verifiedSavedForms.map(form => {
    const { form: formId, lastUpdated, metadata } = form;

    return {
      ...metadata,
      form: formId,
      lastUpdated,
    };
  });

  // Renaming updatedAt to lastUpdated, formType to form, and converting datetime to UNIX time
  const formsStatusEdited = formsWithStatus?.map(form => {
    const { formType, updatedAt, ...rest } = form.attributes;
    return {
      ...rest,
      form: formType,
      lastUpdated: getUnixTime(new Date(updatedAt)),
    };
  });

  // gather all forms and sort by lastUpdated
  const allFormSorted = transformedSavedForms
    .concat(formsStatusEdited)
    .sort((a, b) => b.lastUpdated - a.lastUpdated);

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
          {allFormSorted.length > 0 ? (
            <div>
              <Toggler.Enabled>
                {allFormSorted.map(form => {
                  const formId = form.form;
                  const formTitle = isUsingNewSipConfig
                    ? `application for ${
                        MY_VA_SIP_FORMS.find(e => e.id === formId).benefit
                      }`
                    : `application for ${FORM_BENEFITS[formId]}`;
                  const presentableFormId = isUsingNewSipConfig
                    ? presentableFormIDsV2[formId]
                    : presentableFormIDs[formId];
                  const { lastUpdated } = form || {};
                  const lastSavedDate = format(
                    fromUnixTime(lastUpdated),
                    'MMMM d, yyyy',
                  );

                  // if form is draft, then render Draft
                  if (Object.hasOwn(form, 'savedAt')) {
                    const { expiresAt } = form || {};
                    const expirationDate = format(
                      fromUnixTime(expiresAt),
                      'MMMM d, yyyy',
                    );
                    const continueUrl = `${getFormLink(formId)}resume`;

                    return (
                      <Draft
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

                  // if form is Received, then render Received
                  if (Object.hasOwn(form, 'status')) {
                    const { createdAt } = form || {};
                    const submittedDate = format(
                      new Date(createdAt),
                      'MMMM d, yyyy',
                    );
                    return (
                      <Received
                        key={formId}
                        formId={formId}
                        formTitle={formTitle}
                        lastSavedDate={lastSavedDate}
                        submittedDate={submittedDate}
                        presentableFormId={presentableFormId}
                      />
                    );
                  }

                  return null;
                })}
              </Toggler.Enabled>
              <Toggler.Disabled>
                {verifiedSavedForms.map(form => {
                  const formId = form.form;
                  const formTitle = isUsingNewSipConfig
                    ? `application for ${
                        MY_VA_SIP_FORMS.find(e => e.id === formId).benefit
                      }`
                    : `application for ${FORM_BENEFITS[formId]}`;
                  const presentableFormId = isUsingNewSipConfig
                    ? presentableFormIDsV2[formId]
                    : presentableFormIDs[formId];
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
        </DashboardWidgetWrapper>
      </Toggler>
    </div>
  );
};

ApplicationsInProgress.propTypes = {
  formsWithStatus: PropTypes.array,
  hideH3: PropTypes.bool,
  isLOA1: PropTypes.bool,
  savedForms: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    savedForms: selectProfile(state).savedForms || [],
    formsWithStatus: state.allFormsWithStatuses.forms || [],
  };
};

export default connect(mapStateToProps)(ApplicationsInProgress);
