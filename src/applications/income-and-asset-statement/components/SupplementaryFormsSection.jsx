import React from 'react';
import PropTypes from 'prop-types';
import MailingAddress from './MailingAddress';
import { getIncompleteOwnedAssets } from '../helpers';

const bodyTextMap = {
  BUSINESS: 'Report of Income from Property or Business (VA Form 21P-4185)',
  FARM: 'Questionnaire for Farm Income (VA Form 21P-4165)',
};

const formLinks = {
  BUSINESS: {
    text: 'Get VA Form 21P-4185 to download',
    href: 'https://www.va.gov/find-forms/about-form-21p-4185/',
  },
  FARM: {
    text: 'Get VA Form 21P-4165 to download',
    href: 'https://www.va.gov/find-forms/about-form-21p-4165/',
  },
};

/**
 * Renders the appropriate VA form links for a given set of asset types.
 * @param {string[]} types - An array of asset types to include links for.
 */
const renderFormLinks = types => {
  return types.filter(type => formLinks[type]).map(type => {
    const { text, href } = formLinks[type];
    return (
      <p key={type}>
        <va-link external text={text} href={href} />
      </p>
    );
  });
};

const SupplementaryFormsSection = ({ formData }) => {
  const { alertAssets, hasFarm, hasBusiness } = getIncompleteOwnedAssets(
    formData,
  );

  if (alertAssets.length === 0) return null;

  const renderContent = () => {
    if (hasFarm && hasBusiness) {
      return (
        <>
          <p>
            Since you decided to mail the {bodyTextMap.BUSINESS} and{' '}
            {bodyTextMap.FARM}, complete the forms and send them to this
            address:
          </p>
          <MailingAddress />
          {renderFormLinks(['BUSINESS', 'FARM'])}
        </>
      );
    }
    if (hasBusiness) {
      return (
        <>
          <p>
            Since you decided to mail the {bodyTextMap.BUSINESS}, complete the
            form and send it to this address:
          </p>
          <MailingAddress />
          {renderFormLinks(['BUSINESS'])}
        </>
      );
    }
    if (hasFarm) {
      return (
        <>
          <p>
            Since you decided to mail the {bodyTextMap.FARM}, complete the form
            and send it to this address:
          </p>
          <MailingAddress />
          {renderFormLinks(['FARM'])}
        </>
      );
    }
    return null;
  };

  return (
    <section>
      <h3>Where to mail supporting documents</h3>
      {renderContent()}
    </section>
  );
};

SupplementaryFormsSection.propTypes = {
  formData: PropTypes.shape({
    ownedAssets: PropTypes.arrayOf(
      PropTypes.shape({
        assetType: PropTypes.string,
        'view:addFormQuestion': PropTypes.bool,
        uploadedDocuments: PropTypes.object,
      }),
    ),
  }),
};

export default SupplementaryFormsSection;
