import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { selectProfile } from '~/platform/user/selectors';
import {
  filterOutExpiredForms,
  formatFormTitle,
  isSIPEnabledForm,
  normalizeSubmissionStatus,
  presentableFormIDs,
  sipFormSorter,
} from '~/applications/personalization/dashboard/helpers';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { MY_VA_SIP_FORMS } from 'platform/forms/constants';
import { getFormLink } from 'platform/forms/helpers';
import DraftCard from './DraftCard';
import SubmissionCard from './SubmissionCard';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import Error from './Error';
import MissingApplicationHelp from './MissingApplicationHelp';

const ApplicationsStatusHeader = ({ headingText }) => (
  <h3
    className="vads-u-font-size--h4 vads-u-margin-bottom--2p5"
    data-testid="applications-by-status-header"
  >
    {headingText}
  </h3>
);
ApplicationsStatusHeader.propTypes = {
  headingText: PropTypes.string.isRequired,
};

const ApplicationsEmptyText = ({ emptyText }) => (
  <p data-testid="applications-in-progress-empty-state">{emptyText}</p>
);
ApplicationsEmptyText.propTypes = {
  emptyText: PropTypes.string.isRequired,
};

const FormsAndApplications = ({
  savedForms,
  submittedError,
  submittedForms,
}) => {
  const sectionRef = useRef(null);

  // console.log('form data', savedForms, submittedForms);
  /*
  in progress forms are determined by
  - form.savedAt < savedForms < inProgressForms  < metadata.savedAt
  come back to outlining these
  - error
  - expired
   */

  useLayoutEffect(() => {
    const handleAnchorLink = () => {
      if (document.location.hash === '#benefit-applications') {
        const elt = sectionRef.current;
        const sectionPosition =
          elt?.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition,
          behavior: 'smooth',
        });
        elt?.focus();
      }
    };

    handleAnchorLink();
  }, []);

  const transformedSavedForms = useMemo(
    () =>
      savedForms
        // Filter out non-SIP-enabled applications and expired applications
        .filter(isSIPEnabledForm)
        .filter(filterOutExpiredForms)
        .sort(sipFormSorter)
        // Transform some properties
        .map(form => {
          const { form: formId, lastUpdated, metadata } = form;
          return {
            ...metadata,
            form: formId,
            lastUpdated,
          };
        }),
    [savedForms],
  );

  // console.log('transformedSavedForms', transformedSavedForms);

  const transformedSubmittedForms = useMemo(
    () =>
      submittedForms.map(form => {
        // Renaming updatedAt to lastUpdated, formType to form, and converting datetime to UNIX time
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

  // console.log('transformedSubmittedForms', transformedSubmittedForms);

  const allForms = useMemo(
    () =>
      transformedSavedForms
        .concat(transformedSubmittedForms)
        .sort((a, b) => b.lastUpdated - a.lastUpdated),
    [transformedSavedForms, transformedSubmittedForms],
  );

  /*
  common card props:
  status: progress.status, submitted.
  */

  const { inProgressCardList, completedCardList } = useMemo(
    () => {
      const cards = {
        inProgressCardList: [],
        completedCardList: [],
      };

      allForms.forEach(form => {
        const formArrays = ['22-10275', '22-10278', '22-10297'];

        const formId = form.form;
        const formStatus = form.status;
        const { pdfSupport } = form;
        // Determine form title: use benefit name for SiP forms,
        // otherwise use "VA Form {formId}" for non-SiP forms
        const formMeta = MY_VA_SIP_FORMS.find(e => e.id === formId);
        const hasBenefit = !!formMeta?.benefit;
        const isForm = formArrays.includes(formId);
        // Temporary custom label for 21-4142 via 526 claim
        // and for 686C-674-v2 so they can be user-friendly
        let formIdLabel;
        if (formId === 'form526_form4142') {
          formIdLabel = '21-4142 submitted with VA Form 21-526EZ';
        } else if (isForm) {
          formIdLabel = formMeta?.title
            ? `${formId} (${formMeta.title})`
            : formId;
        } else if (formId === 'form0995_form4142') {
          formIdLabel = '21-4142 submitted with VA Form 20-0995';
        } else {
          formIdLabel = form.form.replace(/-V2$/i, '');
        }
        const formTitle = hasBenefit
          ? `application for ${formMeta.benefit}`
          : `VA Form ${formIdLabel}`;
        const presentableFormId = presentableFormIDs[formId] || '';
        const { lastUpdated } = form || {};
        const lastSavedDate = format(fromUnixTime(lastUpdated), 'MMMM d, yyyy');

        if (Object.hasOwn(form, 'savedAt')) {
          // if form is draft, then render Draft Card
          const { expiresAt } = form || {};
          const expirationDate = format(
            fromUnixTime(expiresAt),
            'MMMM d, yyyy',
          );
          const continueUrl = `${getFormLink(formId)}resume`;
          // TODO: consider combining all "Application Cards" into single component

          cards.inProgressCardList.push(
            <DraftCard
              key={formId}
              continueUrl={continueUrl}
              expirationDate={expirationDate}
              formId={formId}
              formTitle={isForm ? formTitle : formatFormTitle(formTitle)}
              lastSavedDate={lastSavedDate}
              presentableFormId={hasBenefit ? presentableFormId : false}
              isForm={isForm}
            />,
          );
        } else if (formStatus) {
          // if form is not a Draft and has status, render Status Card
          const { createdAt } = form || {};
          const submittedDate = format(fromUnixTime(createdAt), 'MMMM d, yyyy');
          const cardStatus = normalizeSubmissionStatus(formStatus);

          const card = (
            <SubmissionCard
              key={formId}
              formId={formId}
              formTitle={formTitle}
              guid={form.id}
              lastSavedDate={lastSavedDate}
              submittedDate={submittedDate}
              pdfSupport={pdfSupport}
              presentableFormId={hasBenefit ? presentableFormId : false}
              status={cardStatus}
            />
          );
          if (cardStatus === 'actionNeeded') {
            cards.inProgressCardList.push(card);
          } else {
            cards.completedCardList.push(card);
          }
        }
      });

      return { inProgressCardList, completedCardList };
    },
    [allForms],
  );

  return (
    <div
      data-testid="dashboard-section-benefit-application-drafts"
      id="benefit-applications"
      ref={sectionRef}
      tabIndex={-1}
    >
      <h2>Forms and applications</h2>
      {submittedError && (
        <DashboardWidgetWrapper>
          <Error />
        </DashboardWidgetWrapper>
      )}
      {!submittedError && (
        <>
          {/* In progress forms */}
          <ApplicationsStatusHeader headingText="In-progress forms" />
          {inProgressCardList.length === 0 ? (
            <ApplicationsEmptyText emptyText="You don't have any benefit forms or applications in progress." />
          ) : (
            inProgressCardList
          )}

          {/* Completed forms */}
          <ApplicationsStatusHeader headingText="Completed forms" />
          {completedCardList.length === 0 ? (
            <ApplicationsEmptyText emptyText="You don't have any completed benefit forms or applications to show." />
          ) : (
            <va-accordion open-single>
              <va-accordion-item
                header="Completed forms"
                id="completed-forms-accordion-item"
              >
                {completedCardList}
              </va-accordion-item>
            </va-accordion>
          )}

          <div className="vads-u-margin-top--2">
            <MissingApplicationHelp />
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  // normalize full vs. partial errors into a single true/false value and provide as prop
  const submittedError =
    !!state.submittedForms.error || state.submittedForms.errors?.length > 0;

  return {
    savedForms: selectProfile(state).savedForms || [],
    submittedError,
    submittedForms: state.submittedForms.forms || [],
  };
};

FormsAndApplications.propTypes = {
  getESREnrollmentStatus: PropTypes.func,
  getFormStatuses: PropTypes.func,
  savedForms: PropTypes.array,
  submittedError: PropTypes.bool,
  submittedForms: PropTypes.array,
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormsAndApplications);
