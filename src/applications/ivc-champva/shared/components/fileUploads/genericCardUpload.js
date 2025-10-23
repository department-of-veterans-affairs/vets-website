import React from 'react';
import { titleSchema } from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import { fileUploadBlurbCustom } from './attachments';
import { fileUploadUi } from './upload';

/**
 * Creates a reusable upload schema that can be used for different types of insurance card uploads
 *
 * @param {object} options Configuration options for the upload schema
 * @param {React.ReactNode} options.customDescription JSX element to display above the images
 * @param {boolean} options.showFilesBlurb Whether or not to show fileUploadBlurb after the card images
 * @param {string} options.frontProperty Property name for the front card upload (e.g., 'medicareFrontCard')
 * @param {string} options.backProperty Property name for the back card upload (e.g., 'medicareBackCard')
 * @param {string} options.frontImageSrc Image source path for the front card example
 * @param {string} options.backImageSrc Image source path for the back card example
 * @param {string} options.cardTitle Custom title text displayed above the sample images (e.g., "Sample of Original Medicare card")
 * @param {string} options.frontLabel Label for the front card upload field (e.g., "Upload front of Medicare card")
 * @param {string} options.backLabel Label for the back card upload field (e.g., "Upload back of Medicare card")
 * @returns {object} UI Schema and Schema objects for the card upload
 */
export const createCardUploadSchema = ({
  customDescription,
  showFilesBlurb = true,
  frontProperty,
  backProperty,
  frontImageSrc,
  backImageSrc,
  frontAltText,
  backAltText,
  cardTitle = 'Sample card',
  frontLabel = 'Upload front of card',
  backLabel = 'Upload back of card',
  frontAttachmentId = '',
  backAttachmentId = '',
}) => {
  // Shows what the front and back of the specified card look like
  // (e.g., medicare red, white, and blue card or something)
  const cardSampleDisplay = (
    <div
      key="sample-container"
      className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--center"
    >
      <h2
        key="sample-title"
        className="vads-u-margin-top--0 vads-u-font-size--h3"
      >
        {cardTitle}
      </h2>
      <div
        key="sample-images"
        className="vads-u-display--flex vads-u-flex-direction--column"
      >
        <div key="front-container" className="vads-u-margin-bottom--2">
          <p key="front-label">Front of card</p>
          <img
            key="front-image"
            alt={frontAltText ?? `Sample ${cardTitle} front`}
            className="vads-u-margin-bottom--2"
            src={frontImageSrc}
            width="300"
          />
        </div>
        <div key="back-container">
          <p key="back-label">Back of card</p>
          <img
            key="back-image"
            alt={backAltText ?? `Sample ${cardTitle} back`}
            src={backImageSrc}
            width="300"
          />
        </div>
      </div>
    </div>
  );

  // Hold UI elements in a list so we can organize the order based
  // on config options.
  const uiElements = [];

  // Add custom description first
  if (customDescription) {
    uiElements.push({
      'view:cardUploadDescription': {
        'ui:description': customDescription,
      },
    });
  }

  // Add card sample display
  uiElements.push({
    'view:cardSampleDisplay': {
      'ui:description': cardSampleDisplay,
    },
  });

  // Add file upload blurb after images
  if (showFilesBlurb) {
    uiElements.push(fileUploadBlurbCustom());
  }

  // Add front card upload
  uiElements.push({
    [frontProperty]: fileUploadUi({
      label: (
        <div key="front-upload-label">
          {frontLabel}
          <br key="front-upload-br" />
          <span key="front-upload-hint" className="usa-hint">
            Upload front and back as separate files.
          </span>
        </div>
      ),
      attachmentId: frontAttachmentId,
    }),
  });

  // Add back card upload
  uiElements.push({
    [backProperty]: fileUploadUi({
      label: (
        <div key="back-upload-label">
          {backLabel}
          <br key="back-upload-br" />
          <span key="back-upload-hint" className="usa-hint">
            Upload front and back as separate files.
          </span>
        </div>
      ),
      attachmentId: backAttachmentId,
    }),
  });

  // Combine all UI elements
  const uiSchema = uiElements.reduce(
    (acc, element) => ({ ...acc, ...element }),
    {},
  );

  // Create schema with front and back properties
  const schemaProperties = {
    titleSchema,
    'view:cardUploadDescription': blankSchema,
    'view:cardSampleDisplay': blankSchema,
    'view:fileUploadBlurb': blankSchema,
  };

  // Add front property schema
  schemaProperties[frontProperty] = {
    type: 'array',
    maxItems: 1,
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
  };

  // Add back property schema
  schemaProperties[backProperty] = {
    type: 'array',
    maxItems: 1,
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
  };

  if (!showFilesBlurb) {
    delete schemaProperties['view:fileUploadBlurb'];
  }

  // Create the complete schema
  const schema = {
    type: 'object',
    required: [frontProperty, backProperty],
    properties: schemaProperties,
  };

  return {
    uiSchema,
    schema,
  };
};
