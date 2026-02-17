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
import ApplicationCard from './ApplicationCard';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import Error from './Error';
import MissingApplicationHelp from './MissingApplicationHelp';

const FormsAndApplications = ({
  savedForms,
  submittedError,
  submittedForms,
}) => {
  const sectionRef = useRef(null);

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

  const transformedSubmittedForms = useMemo(
    () =>
      submittedForms.map(form => {
        // Renaming updatedAt to lastUpdated, formType to form, and converting datetime to UNIX time
        const { formType, createdAt, updatedAt, status, ...rest } =
          form.attributes;
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
        .concat(transformedSubmittedForms)
        .sort((a, b) => b.lastUpdated - a.lastUpdated),
    [transformedSavedForms, transformedSubmittedForms],
  );

  const { inProgressCardList, completedCardList } = useMemo(() => {
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
        const { expiresAt } = form || {};
        const expirationDate = format(fromUnixTime(expiresAt), 'MMMM d, yyyy');
        const continueUrl = `${getFormLink(formId)}resume`;

        cards.inProgressCardList.push({
          continueUrl,
          expirationDate,
          formId,
          formTitle: isForm ? formTitle : formatFormTitle(formTitle),
          isForm,
          lastSavedDate,
          presentableFormId: hasBenefit ? presentableFormId : false,
        });
      } else if (formStatus) {
        const { createdAt } = form || {};
        const submittedDate = format(fromUnixTime(createdAt), 'MMMM d, yyyy');
        const cardStatus = normalizeSubmissionStatus(formStatus);

        const card = {
          formId,
          formTitle,
          guid: form.id,
          lastSavedDate,
          pdfSupport,
          presentableFormId: hasBenefit ? presentableFormId : false,
          status: cardStatus,
          submittedDate,
        };

        // "actionNeeded" is also an In Progress card
        if (cardStatus === 'actionNeeded') {
          cards.inProgressCardList.push(card);
        } else {
          cards.completedCardList.push(card);
        }
      }
    });

    return cards;
  }, [allForms]);

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
          <h3 className="vads-u-margin-y--2">In-progress forms</h3>
          {inProgressCardList.length === 0 ? (
            <p data-testid="applications-in-progress-empty-state">
              You don’t have any benefit forms or applications in progress.
            </p>
          ) : (
            <div
              className="vads-l-grid-container--full"
              style={{ overflow: 'hidden' }}
              data-testid="applications-in-progress-list"
            >
              <div className="vads-l-row vads-u-margin-right--neg3">
                {inProgressCardList.map(card => (
                  <DashboardWidgetWrapper key={card.formId}>
                    <ApplicationCard {...card} />
                  </DashboardWidgetWrapper>
                ))}
              </div>
            </div>
          )}

          <h3
            className="vads-u-margin-top--0 vads-u-margin-bottom--2"
            // Hide this from AT if there are completed forms to avoid duplicate heading from accordion item
            aria-hidden={completedCardList.length ? 'true' : 'false'}
          >
            Completed forms
          </h3>
          {completedCardList.length === 0 ? (
            <p data-testid="applications-completed-empty-state">
              You don’t have any completed benefit forms or applications to
              show.
            </p>
          ) : (
            <va-accordion open-single>
              <va-accordion-item
                header="Completed forms"
                level="3"
                id="completed-forms-accordion-item"
              >
                <div
                  className="vads-l-grid-container--full"
                  style={{ overflow: 'hidden' }}
                  data-testid="applications-completed-list"
                >
                  <div className="vads-l-row vads-u-margin-right--neg3">
                    {completedCardList.map(card => (
                      <DashboardWidgetWrapper key={card.formId}>
                        <ApplicationCard {...card} />
                      </DashboardWidgetWrapper>
                    ))}
                  </div>
                </div>
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
  // Normalize full vs. partial errors into a single true/false value and provide as prop
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
