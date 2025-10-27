import React, { useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import {
  createFormPageList,
  createPageList,
  getActiveExpandedPages,
} from '@department-of-veterans-affairs/platform-forms-system/helpers';
// import { uniq } from 'lodash';
import formConfig from '../config/form';
// import { showForm0781Pages } from '../../utils/form0781';

export default function ClaimFormSideNavWC({
  enableAnalytics = false,
  formData,
  pathname,
  router,
  setFormData,
}) {
  // MVP chapters:
  // veteranDetails
  // disabilities
  // mentalHealth
  // supportingEvidence
  // additionalInformation
  // reviewAndSubmit

  // This is converting the config into a list of pages with chapter keys,
  // finding the current page, then getting the chapter name using the key
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);
  const eligiblePageList = getActiveExpandedPages(pageList, formData);

  const [visitedChapters, setVisitedChapters] = useState(
    formData['view:visitedChapters'] || [],
  );
  const page = eligiblePageList.filter(p => p.path === pathname)[0];
  const currentChapter = page?.chapterKey;
  if (page?.chapterKey && !visitedChapters.includes(page?.chapterKey)) {
    setVisitedChapters([...visitedChapters, page?.chapterKey]);
    setFormData({
      ...formData,
      'view:visitedChapters': [...visitedChapters, page?.chapterKey],
    });
  }

  const handleClick = (e, destination) => {
    e.preventDefault();
    if (enableAnalytics) {
      recordEvent?.({
        event: 'form-sidenav-click',
        'form-sidenav-source-path': pathname,
        'form-sidenav-destination-path': destination,
      });
    }
    // set form data first
    setFormData(formData);
    router.push(destination);
  };

  const disabledClass =
    'vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-left--2 vads-u-padding-right--0p5 vads-u-color--gray vads-u-border-color--gray-lightest vads-u-border-bottom--1px';
  /* TODO: 
    - update - component-ize side nav ternery bits
    - fix - current-page isn't properly rendering on entry
    - fix - SiP loading indicator is all wonky and shifted to the side
    - meh - is there a way to tidy up these classes 
    - think how can we easily stamp this into platform FormNav.jsx?
  */

  return (
    <va-sidenav
      header={null}
      icon-background-color={null}
      icon-name={null}
      id="default-sidenav"
    >
      {visitedChapters.includes('veteranDetails') ? (
        <va-sidenav-item
          current-page={currentChapter === 'veteranDetails'}
          key="veteran-details"
          label="1. Veteran Details"
          href="#"
          onClick={e => {
            e.preventDefault();
            // no depends
            handleClick(e, `/veteran-information`);
          }}
        />
      ) : (
        <p className={disabledClass}>1. Veteran Details</p>
      )}
      {visitedChapters.includes('disabilities') ? (
        <va-sidenav-item
          current-page={currentChapter === 'disabilities'}
          key="conditions"
          label="2. Conditions"
          href="#"
          onClick={e => {
            e.preventDefault();
            // TODO: add depends logic here, so things don't bork
            // `/claim-type` - disabilityBenefitsWorkflow - hasRatedDisabilities(formData)
            // `/conditions/orientation` - disabilityConditionsWorkflow - no depends
            // `/new-disabilities/add` - isClaimingNew - in all-claims/utils/index.js
            handleClick(e, `/conditions/orientation`);
          }}
        />
      ) : (
        <p className={disabledClass}>2. Conditions</p>
      )}
      {visitedChapters.includes('mentalHealth') ? (
        <va-sidenav-item
          current-page={currentChapter === 'mentalHealth'}
          key="mental-health"
          label="3. Mental Health"
          href="#"
          onClick={e => {
            e.preventDefault();
            // TODO: add depends logic here, so things don't bork
            // showForm0781Pages(formData) - in all-claims/config/form0781/index.js
            handleClick(e, `/mental-health-form-0781/workflow`);
          }}
        />
      ) : (
        <p className={disabledClass}>3. Mental Health</p>
      )}
      {visitedChapters.includes('supportingEvidence') ? (
        <va-sidenav-item
          current-page={currentChapter === 'supportingEvidence'}
          key="supporting-evidence"
          label="4. Supporting Evidence"
          href="#"
          onClick={e => {
            e.preventDefault();
            // TODO: add depends logic here, so things don't bork
            // !isBDD(formData) - in form.js
            handleClick(e, `/supporting-evidence/evidence-types`);
          }}
        />
      ) : (
        <p className={disabledClass}>4. Supporting Evidence</p>
      )}
      {visitedChapters.includes('additionalInformation') ? (
        <va-sidenav-item
          current-page={currentChapter === 'additionalInformation'}
          key="additional-information"
          label="5. Additional Information"
          href="#"
          onClick={e => {
            e.preventDefault();
            // no depends
            handleClick(e, `/payment-information`);
          }}
        />
      ) : (
        <p className={disabledClass}>5. Additional Information</p>
      )}
      {visitedChapters.includes('review') ? (
        <va-sidenav-item
          current-page={currentChapter === 'review'}
          key="review-and-submit"
          label="6. Review and Submit"
          href="#"
          onClick={e => {
            e.preventDefault();
            // no depends
            handleClick(e, `/review-and-submit`);
          }}
        />
      ) : (
        <p className={disabledClass}>6. Review and Submit</p>
      )}
    </va-sidenav>
  );
}

ClaimFormSideNavWC.propTypes = {
  enableAnalytics: PropTypes.bool,
  formData: PropTypes.object,
  pathname: PropTypes.string,
  router: PropTypes.object,
  setFormData: PropTypes.func,
};
