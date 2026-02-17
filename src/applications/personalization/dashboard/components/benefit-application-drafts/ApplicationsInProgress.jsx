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
  formatFormTitle,
} from '~/applications/personalization/dashboard/helpers';

import { MY_VA_SIP_FORMS } from '~/platform/forms/constants';
import { getFormLink } from '~/platform/forms/helpers';
import { getCustomCardHeaderConfigs } from '../../utils/custom-card-header-configs';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import DraftCard from './DraftCard';
import MissingApplicationHelp from './MissingApplicationHelp';
import SubmissionCard from './SubmissionCard';
import Error from './Error';

/**
 * formIdLabel is used to construct part of the card header
 */
const getFormIdLabel = (formHeaderConfig, formId, formMeta, isForm) => {
  if (isForm) {
    return formMeta?.title ? `${formId} (${formMeta.title})` : formId;
  }

  if (formHeaderConfig && formHeaderConfig?.formIdLabel) {
    return formHeaderConfig?.formIdLabel;
  }

  return formId.replace(/-V2$/i, '');
};

/**
 * presentableFormId is used to construct the optional card subheader
 * It is always preceded with VA, e.g. "VA {presentableFormId}"
 */
const getPresentableFormId = (formHeaderConfig, formId) => {
  let presentableFormId = presentableFormIDs[formId] || '';
  let hasCustomPresentableFormId = false;

  if (formHeaderConfig && formHeaderConfig?.presentableFormId) {
    presentableFormId = formHeaderConfig?.presentableFormId;
    hasCustomPresentableFormId = true;
  }

  return { presentableFormId, hasCustomPresentableFormId };
};

/**
 * formTitle is used as the card header
 */
const getFormTitle = (
  formHeaderConfig,
  formIdLabel,
  formMeta,
  hasBenefit,
  isForm,
) => {
  let formTitle = hasBenefit
    ? `application for ${formMeta.benefit}`
    : `VA Form ${formIdLabel}`;

  if (formHeaderConfig && formHeaderConfig?.formTitle) {
    formTitle = formHeaderConfig?.formTitle;
  }

  return isForm ? formTitle : formatFormTitle(formTitle);
};

/**
 * Used for defining the default or custom headers and
 * optional subheaders for status cards
 * To define custom headers, add an entry in getCustomCardHeaderConfigs
 */
export const getCardHeaders = (formId, formMeta, hasBenefit) => {
  const customCardHeaderConfigs = getCustomCardHeaderConfigs(formMeta);

  const formHeaderConfig = customCardHeaderConfigs.find(
    config => config.formId === formId,
  );

  const formArrays = ['22-10275', '22-10278', '22-10297'];
  const isForm = formArrays.includes(formId);

  const formIdLabel = getFormIdLabel(
    formHeaderConfig,
    formId,
    formMeta,
    isForm,
  );

  const {
    presentableFormId,
    hasCustomPresentableFormId,
  } = getPresentableFormId(formHeaderConfig, formId);

  const formattedFormTitle = getFormTitle(
    formHeaderConfig,
    formIdLabel,
    formMeta,
    hasBenefit,
    isForm,
  );

  return {
    formTitle: formattedFormTitle,
    hasCustomPresentableFormId,
    isForm,
    presentableFormId,
  };
};

const ApplicationsInProgress = ({
  submittedError,
  submittedForms,
  savedForms,
  hideH3,
  hideMissingApplicationHelp,
  emptyState,
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

  const emptyStateText =
    emptyState || 'You have no benefit applications or forms to show.';

  return (
    <div data-testid="applications-in-progress">
      {!hideH3 && (
        <h3
          className="vads-u-font-size--h4 vads-u-margin-bottom--2p5"
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
            {!hideMissingApplicationHelp && <MissingApplicationHelp />}
          </>
        )}
        {hasForms && (
          <div>
            {allForms.map(form => {
              const formId = form.form;
              const formStatus = form.status;
              const { pdfSupport } = form;
              // Determine form title: use benefit name for SiP forms,
              // otherwise use "VA Form {formId}" for non-SiP forms
              const formMeta = MY_VA_SIP_FORMS.find(e => e.id === formId);
              const hasBenefit = !!formMeta?.benefit;

              const { lastUpdated } = form || {};
              const lastSavedDate = format(
                fromUnixTime(lastUpdated),
                'MMMM d, yyyy',
              );

              const {
                formTitle,
                hasCustomPresentableFormId,
                isForm,
                presentableFormId,
              } = getCardHeaders(formId, formMeta, hasBenefit);

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
                    presentableFormId={
                      hasBenefit || hasCustomPresentableFormId
                        ? presentableFormId
                        : false
                    }
                    isForm={isForm}
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
                    guid={form.id}
                    lastSavedDate={lastSavedDate}
                    submittedDate={submittedDate}
                    pdfSupport={pdfSupport}
                    presentableFormId={
                      hasBenefit || hasCustomPresentableFormId
                        ? presentableFormId
                        : false
                    }
                    status={normalizeSubmissionStatus(formStatus)}
                  />
                );
              }

              return null;
            })}
            {!hideMissingApplicationHelp && <MissingApplicationHelp />}
          </div>
        )}
      </DashboardWidgetWrapper>
    </div>
  );
};

ApplicationsInProgress.propTypes = {
  emptyState: PropTypes.string,
  hideH3: PropTypes.bool,
  hideMissingApplicationHelp: PropTypes.bool,
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
