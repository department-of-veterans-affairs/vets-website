import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { uniqueId } from 'lodash';
import { ITEMS_PER_PAGE } from '../../constants';
import {
  buildDateFormatter,
  getOldestDocumentDate,
  getPhaseItemText,
  is5103Notice,
  getShowEightPhases,
  renderDefaultThirdPartyMessage,
  getDisplayFriendlyName,
  getIsDBQ,
} from '../../utils/helpers';
import TimezoneDiscrepancyMessage from '../TimezoneDiscrepancyMessage';

export default function RecentActivity({ claim }) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstClaimPhasesEnabled = useToggleValue(TOGGLE_NAMES.cstClaimPhases);
  const showEightPhases = getShowEightPhases(
    claim.attributes.claimTypeCode,
    cstClaimPhasesEnabled,
  );

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
    const items = [];
    const addItems = (date, description, item) => {
      items.push({
        id: `${item.id}-${uniqueId()}`,
        date,
        description,
        oldDisplayName: item.displayName,
        displayName: item.friendlyName || item.displayName,
        activityDescription: item.activityDescription,
        status: item.status,
        type: 'tracked_item',
      });
    };

    trackedItems.forEach(item => {
      const updatedDisplayName =
        (item.friendlyName && getDisplayFriendlyName(item)) || item.displayName;
      const displayName = is5103Notice(item.displayName)
        ? 'List of evidence we may need (5103 notice)'
        : updatedDisplayName;

      if (item.closedDate) {
        addItems(
          item.closedDate,
          `We closed a request: “${displayName}”`,
          item,
        );
      }

      if (item.receivedDate) {
        addItems(
          item.receivedDate,
          `We completed a review for the request: “${displayName}”`,
          item,
        );
      }

      if (item.documents?.length > 0) {
        addItems(
          getOldestDocumentDate(item),
          `We received your document(s) for the request: “${displayName}”`,
          item,
        );
      }

      if (item.requestedDate) {
        if (item.status === 'NEEDED_FROM_OTHERS') {
          addItems(
            item.requestedDate,
            getIsDBQ(item)
              ? `We made a request: "${displayName}."`
              : `We made a request outside the VA: "${displayName}."`,
            item,
          );
        } else {
          addItems(
            item.requestedDate,
            `We opened a request: "${displayName}"`,
            item,
          );
        }
      }
    });

    return items;
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
      return new Date(item2.date) - new Date(item1.date);
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
    if (itemStatus === 'NEEDED_FROM_YOU') return 'Request for you';
    return undefined;
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

  const thirdPartyRequesAlertText = item => {
    return (
      <va-alert
        data-testid={`item-from-others-${item.id}`}
        class="optional-alert vads-u-padding-bottom--1"
        status="info"
        slim
      >
        {item.activityDescription ? (
          <>
            {item.activityDescription}
            <br />
          </>
        ) : (
          renderDefaultThirdPartyMessage(item.oldDisplayName)
        )}
        <Link
          aria-label={`About this notice for ${item.friendlyName ||
            item.displayName}`}
          className="add-your-claims-link"
          to={`../needed-from-others/${item.id}`}
        >
          About this notice
        </Link>
      </va-alert>
    );
  };

  return (
    <div className="recent-activity-container">
      <h3 className="vads-u-margin-top--0">Recent activity</h3>
      <TimezoneDiscrepancyMessage />
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
                  {requestType(item.status) && (
                    <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                      {requestType(item.status)}
                    </p>
                  )}
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
              {item.status === 'NEEDED_FROM_OTHERS' &&
                thirdPartyRequesAlertText(item)}
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
