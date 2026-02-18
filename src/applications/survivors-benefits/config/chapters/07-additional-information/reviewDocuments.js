// IN PROGRESS: this is a new file being created as part of the CAVE implementation.

import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const Description = () => (
  <p>
    The information below was automatically extracted from a few of the
    documents that you uploaded. Review each form and make any necessary
    corrections.
  </p>
);

// Render uploaded files as accordion items. `formData` is passed in by the
// forms system when using a function for 'ui:description'. Uploaded files are
// expected at `formData.files` and have the shape { name, size, confirmationCode }.
const Documents = formData => {
  const files = (formData && formData.files) || [];

  // Map filenames to headings.
  const mapFileNameToHeader = name => {
    if (!name) return 'Uploaded document';
    const n = name.toLowerCase();
    if (n.includes('dd214') || n.includes('dd-214') || n.includes('dd 214'))
      return 'DD214';
    if (n.includes('death')) return 'Death certificate';
    if (n.includes('marri')) return 'Marriage license';
    if (n.includes('birth')) return 'Birth certificate';
    if (n.includes('divorc')) return 'Divorce decree';
    if (n.includes('adopt')) return 'Adoption decree';
    return name;
  };

  if (!files.length) {
    return (
      <div>
        <p>You haven’t uploaded any supporting documents yet.</p>
      </div>
    );
  }

  // Track duplicates so repeated mapped headings get a numeric suffix.
  const seen = {};

  return (
    <div>
      <va-accordion>
        {files.map((file, idx) => {
          const baseTitle = mapFileNameToHeader(file.name);
          seen[baseTitle] = (seen[baseTitle] || 0) + 1;
          const title =
            seen[baseTitle] > 1
              ? `${baseTitle} (${seen[baseTitle]})`
              : baseTitle;

          return (
            <va-accordion-item header={title} key={`${file.name}-${idx}`}>
              <p>
                <strong>Filename:</strong> {file.name}
              </p>

              {file.size ? (
                <p>
                  <strong>Size:</strong> {file.size} bytes
                </p>
              ) : null}

              {file.confirmationCode ? (
                <p>
                  <strong>Confirmation code:</strong> {file.confirmationCode}
                </p>
              ) : null}
              {/* Placeholder: extracted fields for this document would go here */}
            </va-accordion-item>
          );
        })}
      </va-accordion>
    </div>
  );
};

export default {
  title: 'Review supporting documents',
  path: 'additional-information/review-documents',
  uiSchema: {
    ...titleUI('Review supporting documents', Description),
    'ui:description': Documents,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
