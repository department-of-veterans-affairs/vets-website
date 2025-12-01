import React from 'react';
import PropTypes from 'prop-types';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { showUpdatedContent } from '../../../helpers';

const Documents = ({ formData }) => {
  const hasFarm = formData?.ownedAssets?.some(
    item => item.assetType === 'FARM',
  );
  const hasBusiness = formData?.ownedAssets?.some(
    item => item.assetType === 'BUSINESS',
  );
  const hasTrust =
    Array.isArray(formData?.trusts) && formData.trusts.length > 0;

  const showAnyDocs = hasTrust || hasFarm || hasBusiness;

  let contentPhrase = '';

  if (showAnyDocs) {
    const parts = [];
    if (hasFarm) parts.push('a farm');
    if (hasBusiness) parts.push('a business');
    if (hasTrust) parts.push('a trust');

    const listPhrase = parts.join(', ').replace(/, ([^,]*)$/, ', and $1');

    contentPhrase = `Because you’ve indicated you have ${listPhrase}, you’ll need to submit these supporting documents:`;
  }

  return (
    <div>
      <p>
        On the next screen, we’ll ask you to submit supporting documents and
        additional evidence. If you upload all this information online now, you
        may be able to get a faster decision on your claim.
      </p>

      {showAnyDocs ? (
        <>
          <p>{contentPhrase}</p>
          <ul className="usa-list">
            {hasBusiness && (
              <li>
                A completed Report of Income from Property or Business (VA Form
                21P-4185){' '}
                <a
                  href="https://www.va.gov/find-forms/about-form-21p-4185/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get VA Form 21P-4185 (opens in new tab)
                </a>
              </li>
            )}
            {hasFarm && (
              <li>
                A completed Pension Claim Questionnaire for Farm Income (VA Form
                21P-4165){' '}
                <a
                  href="https://www.va.gov/find-forms/about-form-21p-4165/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get VA Form 21P-4165 (opens in new tab)
                </a>
              </li>
            )}
            {hasTrust && (
              <>
                <li>
                  Initial contract from financial institution establishing the
                  trust
                </li>
                <li>
                  Current statement showing surrender value and monthly payments
                </li>
                <li>Schedule of assets</li>
              </>
            )}
          </ul>
        </>
      ) : (
        <p>
          There are no documents that we require from you right now, so you may
          skip uploading until we request documents.
        </p>
      )}
      <va-additional-info trigger="What if I have additional supporting documents?">
        We may ask you for additional supporting documents to support your claim
        as we process it, so have your documents ready for when we reach out.
      </va-additional-info>
    </div>
  );
};

Documents.propTypes = {
  formData: PropTypes.shape({
    ownedAssets: PropTypes.arrayOf(
      PropTypes.shape({
        assetType: PropTypes.string,
      }),
    ),
    trusts: PropTypes.array,
  }),
};

export default {
  title: 'Supporting documents',
  path: 'additional-information/supporting-documents',
  depends: () => !showUpdatedContent(),
  uiSchema: {
    ...titleUI('Supporting documents'),
    'ui:description': Documents,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
