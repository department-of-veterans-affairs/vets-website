import React from 'react';
import { evidenceDictionary } from '../../../utils/evidenceDictionary';
import * as TrackedItem from '../../../utils/trackedItemContent';
import { TrackedItemContent } from '../../TrackedItemContent';

/**
 * Resolves description and next-steps content for a tracked item
 * using a 3-tier priority chain:
 *   Priority 1: API-provided structured content (JSON blocks)
 *   Priority 2: Frontend dictionary JSX (legacy fallback)
 *   Priority 3: Simple API description (plain text with formatting)
 *
 * Returns null for content when nothing matches — each page
 * handles its own fallback for null results.
 */
export const resolveSharedContent = item => {
  // Priority 1: API-provided structured content (JSON blocks → TrackedItemContent)
  const apiLongDescription = item.longDescription?.blocks;
  const apiNextSteps = item.nextSteps?.blocks;

  // Priority 2: Frontend dictionary JSX (legacy fallback during migration)
  const frontendContentOverride = evidenceDictionary[item.displayName];
  const frontendDescription = frontendContentOverride?.longDescription;
  const frontendNextSteps = frontendContentOverride?.nextSteps;

  // Priority 3: Simple API description (plain text with formatting markers)
  const apiDescription = TrackedItem.formatDescription(item.description);

  const hasDescriptionContent =
    apiLongDescription || frontendDescription || apiDescription;

  // Determine longDescription content
  let longDescriptionContent = null;
  let longDescriptionTestId = null;

  if (apiLongDescription) {
    longDescriptionContent = (
      <TrackedItemContent content={apiLongDescription} />
    );
    longDescriptionTestId = 'api-long-description';
  } else if (frontendDescription) {
    longDescriptionContent = frontendDescription;
    longDescriptionTestId = 'frontend-description';
  } else if (apiDescription) {
    longDescriptionContent = apiDescription;
    longDescriptionTestId = 'api-description';
  }

  // Determine nextSteps content
  let nextStepsContent = null;

  if (apiNextSteps) {
    nextStepsContent = (
      <div data-testid="api-next-steps">
        <TrackedItemContent content={apiNextSteps} />
      </div>
    );
  } else if (frontendNextSteps) {
    nextStepsContent = (
      <div data-testid="frontend-next-steps">{frontendNextSteps}</div>
    );
  }

  return {
    longDescriptionContent,
    longDescriptionTestId,
    nextStepsContent,
    hasDescriptionContent,
  };
};
