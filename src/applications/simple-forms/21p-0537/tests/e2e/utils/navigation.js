import {
  fillVeteranName,
  fillVeteranIdentifier,
  fillContactInfo,
  fillRemarriageStatus,
  fillMarriageInfo,
  fillSpouseVeteranStatus,
  fillSpouseVeteranId,
  fillTerminationStatus,
  fillTerminationDetails,
} from './fillers';
import { goToNextPage, checkAccessibility } from './helpers';

/**
 * Navigate through veteran information pages
 */
export const advanceToMaritalStatus = testData => {
  checkAccessibility();
  fillVeteranName(testData);
  goToNextPage('/veteran-identifier');

  checkAccessibility();
  fillVeteranIdentifier(testData);
  goToNextPage('/remarriage-status');
};

/**
 * Navigate through remarriage information pages (when hasRemarried is true)
 */
export const advanceThroughRemarriageInfo = testData => {
  checkAccessibility();
  fillRemarriageStatus(testData);
  goToNextPage();

  if (testData.hasRemarried === true) {
    // Marriage info page
    checkAccessibility();
    fillMarriageInfo(testData);
    goToNextPage('/spouse-veteran-status');

    // Spouse veteran status
    checkAccessibility();
    fillSpouseVeteranStatus(testData);
    goToNextPage();

    // Spouse veteran ID (if spouse is a veteran)
    if (testData.remarriage?.spouseIsVeteran === true) {
      checkAccessibility();
      fillSpouseVeteranId(testData);
      goToNextPage('/remarriage-end-status');
    }

    // Termination status
    checkAccessibility();
    fillTerminationStatus(testData);
    goToNextPage();

    // Termination details (if marriage has terminated)
    if (testData.remarriage?.hasTerminated === true) {
      checkAccessibility();
      fillTerminationDetails(testData);
      goToNextPage('/contact-info');
    }
  }
};

/**
 * Navigate through contact information to review page
 */
export const advanceToReviewAndSubmit = testData => {
  checkAccessibility();
  fillContactInfo(testData);
  goToNextPage('/review-and-submit');
};
