import React from 'react';
import * as TrackedItem from '../../../utils/trackedItemContent';
import { TrackedItemContent } from '../../TrackedItemContent';

/**
 * Resolves description and next-steps content for a tracked item:
 *   Priority 1: Structured content (longDescription/nextSteps blocks)
 *   Priority 2: Plain-text description (item.description with formatting)
 *
 * Returns null for content when nothing matches — each page
 * handles its own fallback for null results.
 */
export const resolveSharedContent = item => {
  // Priority 1: API-provided structured content (JSON blocks → TrackedItemContent)
  const apiLongDescription = item.longDescription?.blocks;
  const apiNextSteps = item.nextSteps?.blocks;

  // Priority 2: Simple API description (plain text with formatting markers)
  const apiDescription = TrackedItem.formatDescription(item.description);

  const hasDescriptionContent = apiLongDescription || apiDescription;

  // Determine longDescription content
  let longDescriptionContent = null;
  let longDescriptionTestId = null;

  if (apiLongDescription) {
    longDescriptionContent = (
      <TrackedItemContent content={apiLongDescription} />
    );
    longDescriptionTestId = 'api-long-description';
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
  }

  return {
    longDescriptionContent,
    longDescriptionTestId,
    nextStepsContent,
    hasDescriptionContent,
  };
};
