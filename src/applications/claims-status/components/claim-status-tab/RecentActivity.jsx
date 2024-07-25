import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { ITEMS_PER_PAGE } from '../../constants';
import {
  buildDateFormatter,
  getPhaseItemText,
  isDisabilityCompensationClaim,
} from '../../utils/helpers';

export default function RecentActivity({ claim }) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cst5103UpdateEnabled = useToggleValue(
    TOGGLE_NAMES.cst5103UpdateEnabled,
  );
  const cstClaimPhasesEnabled = useToggleValue(TOGGLE_NAMES.cstClaimPhases);
  // When feature flag cstClaimPhases is enabled and claim type code is for a disability
  // compensation claim we show 8 phases instead of 5 with updated description, link text
  // and statuses
  const showEightPhases =
    cstClaimPhasesEnabled &&
    isDisabilityCompensationClaim(claim.attributes.claimTypeCode);
  const getOldestDocumentDate = item => {
    const arrDocumentDates = item.documents.map(
      document => document.uploadDate,
    );
    return arrDocumentDates.sort()[0]; // Tried to do Math.min() here and it was erroring out
  };

  const getTrackedItemDateFromStatus = item => {
    switch (item.status) {
      case 'NEEDED_FROM_YOU':
      case 'NEEDED_FROM_OTHERS':
        return item.requestedDate;
      case 'NO_LONGER_REQUIRED':
        return item.closedDate;
      case 'SUBMITTED_AWAITING_REVIEW':
        return getOldestDocumentDate(item);
      case 'INITIAL_REVIEW_COMPLETE':
      case 'ACCEPTED':
        return item.receivedDate;
      default:
        return item.requestedDate;
    }
  };

  const is5103Notice = item => {
    return (
      item.displayName === 'Automated 5103 Notice Response' ||
      item.displayName === '5103 Notice Response'
    );
  };

  const getTrackedItemDescription = item => {
    const displayName =
      is5103Notice(item) && cst5103UpdateEnabled
        ? '5103 Evidence Notice'
        : item.displayName;
    switch (item.status) {
      case 'NEEDED_FROM_YOU':
      case 'NEEDED_FROM_OTHERS':
        return `We opened a request for "${displayName}"`;
      case 'NO_LONGER_REQUIRED':
        return `We closed a request for "${displayName}"`;
      case 'SUBMITTED_AWAITING_REVIEW':
        return `We received your document(s) for "${displayName}"`;
      case 'INITIAL_REVIEW_COMPLETE':
      case 'ACCEPTED':
        return `We completed a review for "${displayName}"`;
      default:
        return 'There was an update to this item';
    }
  };

  const getPhaseItemDescription = (currentPhaseBack, phase) => {
    const phaseItemText = getPhaseItemText(phase, showEightPhases);
    const movedIntoText = `Your claim moved into ${phaseItemText}`;
    const movedBackText = `Your claim moved back to ${phaseItemText}`;
    switch (phase) {
      case 1:
      case 8:
        if (showEightPhases) return phaseItemText;
        return movedIntoText;
      case 2:
      case 7:
        return movedIntoText;
      case 3:
      case 4:
      case 5:
      case 6:
        if (currentPhaseBack) return movedBackText;
        return movedIntoText;
      default:
        return '';
    }
  };

  const generateTrackedItems = () => {
    const { trackedItems } = claim.attributes;

    return trackedItems.map(item => ({
      id: item.id,
      date: getTrackedItemDateFromStatus(item),
      description: getTrackedItemDescription(item),
      displayName: item.displayName,
      status: item.status,
      type: 'tracked_item',
    }));
  };

  const generatePhaseItems = () => {
    const {
      currentPhaseBack,
      previousPhases,
    } = claim.attributes.claimPhaseDates;
    const claimPhases = [];

    const regex = /\d+/;

    // Add phase dates using the complete date of other phases
    const phaseKeys = Object.keys(previousPhases);
    phaseKeys.forEach(phaseKey => {
      const phase = Number(phaseKey.match(regex)[0]) + 1;
      claimPhases.push({
        id: `phase_${phase}`,
        type: 'phase_entered',
        // We are assuming here that each phaseKey is of the format:
        // phaseXCompleteDate, where X is some integer between 1 and 7
        // NOTE: Adding 1 because the a claimPhases completion date is
        // analagous to the phase after it's start date
        // eg. phase1CompleteDate = start date for phase 2
        phase,
        description: getPhaseItemDescription(currentPhaseBack, phase),
        date: previousPhases[phaseKey],
      });
    });

    // Add initial phase date since its not inculded in previousPhases
    claimPhases.push({
      id: 'phase_1',
      type: 'filed',
      phase: 1,
      description: getPhaseItemDescription(currentPhaseBack, 1),
      date: claim.attributes.claimDate,
    });

    // When cst_claim_phases is enabled and is a disability compensation claim
    // then we remove steps 4-6 and only keep step 3
    return showEightPhases
      ? claimPhases
      : claimPhases.filter(
          claimPhase => claimPhase.phase <= 3 || claimPhase.phase >= 7,
        );
  };

  const getSortedItems = () => {
    // Get items from trackedItems and claimPhaseDates
    const trackedItems = generateTrackedItems();
    const phaseItems = generatePhaseItems();
    const items = [...trackedItems, ...phaseItems];

    return items.sort((item1, item2) => {
      return moment(item2.date) - moment(item1.date);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const items = getSortedItems();
  const pageLength = items.length;
  const numPages = Math.ceil(pageLength / ITEMS_PER_PAGE);
  const shouldPaginate = numPages > 1;
  const hasRequestType = itemStatus => {
    return (
      itemStatus === 'NEEDED_FROM_OTHERS' || itemStatus === 'NEEDED_FROM_YOU'
    );
  };
  const requestType = itemStatus => {
    if (itemStatus === 'NEEDED_FROM_OTHERS') {
      return 'Request for others';
    }
    return 'Request for you';
  };

  let currentPageItems = items;

  if (shouldPaginate) {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, pageLength);
    currentPageItems = items.slice(start, end);
  }

  const onPageSelect = useCallback(
    selectedPage => {
      setCurrentPage(selectedPage);
    },
    [setCurrentPage],
  );

  return (
    <div className="recent-activity-container">
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Recent activity
      </h3>
      {pageLength > 0 && (
        <ol className="va-list-horizontal">
          {currentPageItems.map(item => (
            <li
              key={item.id}
              className="vads-u-margin-bottom--2 vads-u-padding-bottom--1"
            >
              <h4 className="vads-u-margin-y--0">
                {buildDateFormatter()(item.date)}
              </h4>
              {hasRequestType(item.status) ? (
                <>
                  <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                    {requestType(item.status)}
                  </p>
                  <p
                    className="item-description vads-u-margin-top--0 vads-u-margin-bottom--1"
                    data-dd-privacy="mask"
                    data-dd-action-name="item description"
                  >
                    {item.description}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="item-description vads-u-margin-top--0p5 vads-u-margin-bottom--1"
                    data-dd-privacy="mask"
                    data-dd-action-name="item description"
                  >
                    {item.description}
                  </p>
                </>
              )}

              {item.status === 'NEEDED_FROM_OTHERS' && (
                <va-alert
                  class="optional-alert vads-u-padding-bottom--1"
                  status="info"
                  slim
                >
                  You don’t have to do anything, but if you have this
                  information you can{' '}
                  <Link
                    aria-label={`Add information for ${item.displayName}`}
                    className="add-your-claims-link"
                    to={`../document-request/${item.id}`}
                  >
                    add it here.
                  </Link>
                </va-alert>
              )}
            </li>
          ))}
        </ol>
      )}
      {shouldPaginate && (
        <VaPagination
          className="vads-u-border--0"
          page={currentPage}
          pages={numPages}
          onPageSelect={e => onPageSelect(e.detail.page)}
        />
      )}
    </div>
  );
}

RecentActivity.propTypes = {
  claim: PropTypes.object,
};
