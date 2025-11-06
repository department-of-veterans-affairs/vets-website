import React from 'react';
import { useSelector } from 'react-redux';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import MailingAddress from './MailingAddress';

const MAX_FILE_SIZE_MB = 20;

const useOwnedAssetContext = () => {
  const formData = useSelector(store => store.form.data);
  const arrayIndex = getArrayIndexFromPathName();
  const assetType = formData?.ownedAssets?.[arrayIndex]?.assetType;

  return { formData, arrayIndex, assetType };
};

export const DocumentMailingAddressDescription = () => {
  const { assetType } = useOwnedAssetContext();

  const formDescription =
    assetType === 'FARM'
      ? 'Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)'
      : 'Report of Income from Property or Business (VA Form 21p-4185)';

  return (
    <>
      <p>
        Since you aren’t uploading the form now, you’ll need to mail the
        completed {formDescription}.
      </p>
      <p>Send it to this address:</p>
      <MailingAddress />
    </>
  );
};

export const SupportingDocumentsNeededList = () => (
  <ul>
    <li>
      Initial trust agreement establishing the trust and its purpose,{' '}
      <strong>and</strong>
    </li>
    <li>
      The initial schedule of the assets in the trust, <strong>and</strong>
    </li>
    <li>
      Any changes to the schedule of assets, <strong>and</strong>
    </li>
    <li>
      Monthly payments out of this trust (if any), <strong>and</strong>
    </li>
    <li>The cash value you would receive if you withdraw from the trust</li>
  </ul>
);

export const AdditionalFormNeededDescription = () => {
  const { assetType } = useOwnedAssetContext();

  if (assetType === 'FARM') {
    return (
      <>
        <p>
          Since you added a farm, you’ll need to submit a Pension Claim
          Questionnaire for Farm Income (VA Form 21P-4165).
        </p>
        <va-link
          external
          text="Get VA Form 21P-4165 to download"
          href="/find-forms/about-form-21p-4165/"
        />
      </>
    );
  }

  if (assetType === 'BUSINESS') {
    return (
      <>
        <p>
          Since you added a business, you’ll need to submit a Report of Income
          from Property or Business (VA Form 21p-4185).
        </p>
        <va-link
          external
          text="Get VA Form 21p-4185 to download"
          href="/find-forms/about-form-21p-4185/"
        />
      </>
    );
  }

  return null;
};

export const DocumentUploadGuidelines = ({ formDescription }) => (
  <>
    <p>
      Be sure that the {formDescription} you submit follow these guidelines:
    </p>
    <ul>
      <li>The document is a .pdf, .jpeg, or .png file</li>
      <li>
        The document isn’t larger than {MAX_FILE_SIZE_MB}
        MB
      </li>
    </ul>
  </>
);

export const DocumentUploadGuidelinesDescription = () => {
  const { assetType } = useOwnedAssetContext();

  const formDescription =
    assetType === 'FARM'
      ? 'Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)'
      : 'Report of Income from Property or Business (VA Form 21p-4185)';

  return <DocumentUploadGuidelines formDescription={formDescription} />;
};

export const SummaryDescription = () => {
  return (
    <>
      <p>
        In this section, we’ll ask about properties and any income you receive
        from physical assets that you solely own or that you own with someone
        else. Here’s what you’ll need to prepare.
      </p>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Types of property to report
      </h2>
      <p>
        If you receive any income from a physical asset or own a physical asset,
        you’ll need to report it in this form. Examples include:
      </p>
      <ul>
        <li>Rental property</li>
        <li>Farm income</li>
        <li>Business income</li>
      </ul>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Establish the asset’s value
      </h2>
      <p>
        To establish the asset’s value, subtract any unpaid mortgage or debt
        from the asset’s value. Only report the value of your share of the
        asset.
      </p>
      <p>
        <strong>Note:</strong> To establish the market value of a property, use
        a licensed appraiser, realtor, or trusted online estimate. Don’t use a
        property tax assessment.
      </p>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Documents you may need to submit
      </h2>
      <p>You may need to provide documents to verify each income source.</p>
      <ul>
        <li>
          For farm income, submit a Pension Claim Questionnaire for Farm Income
          (VA Form 21P-4165).
        </li>
        <li>
          For rental properties or business income, submit a Report of Income
          from Property or Business (VA Form 21P-4185).
        </li>
        <li>
          For a property, submit a statement showing the fair market value.
        </li>
      </ul>
    </>
  );
};
