import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SupplementaryFormsAlert from '../../../components/FormAlerts/SupplementaryFormsAlert';

const genAssets = assetTypes => {
  const types = assetTypes.map(assetType => ({
    assetType,
  }));

  return { ownedAssets: types };
};

describe('income-and-assets <SupplementaryFormsAlert>', () => {
  // Handle cases where the component should return null
  // instead of rendering an alert
  context('should not render', () => {
    it('when no assets are present', () => {
      const { container } = render(<SupplementaryFormsAlert formData={{}} />);

      const selector = container.querySelector('va-alert');

      expect(selector).to.not.exist;
    });

    it('when no whitelisted asset types are present', () => {
      const { container } = render(
        <SupplementaryFormsAlert formData={genAssets(['RENTAL_PROPERTY'])} />,
      );

      const selector = container.querySelector('va-alert');

      expect(selector).to.not.exist;
    });
  });

  // Basic check that the component renders an alert
  // when assets with whitelisted assetTypes are present
  context('should render', () => {
    it('when assets with assetType "BUSINESS" are present', () => {
      const { container } = render(
        <SupplementaryFormsAlert formData={genAssets(['BUSINESS'])} />,
      );

      const selector = container.querySelector('va-alert');

      expect(selector).to.exist;
    });

    it('when assets with assetType "FARM" are present', () => {
      const { container } = render(
        <SupplementaryFormsAlert formData={genAssets(['FARM'])} />,
      );

      const selector = container.querySelector('va-alert');

      expect(selector).to.exist;
    });
  });

  // Check that the text used in the alert is using singular terms when only one
  // whitelisted asset type is present
  context('should use singular terms in the alert text', () => {
    it('when one whitelisted asset is present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['BUSINESS'])} />,
      );

      // Alert headline
      getByText('Additional form needed');
      // Last sentence of body text
      getByText(/You can upload it at a later part of this process./);
    });

    it('when one whitelisted asset and one non-whitelisted asset are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert
          formData={genAssets(['BUSINESS', 'RENTAL_PROPERTY'])}
        />,
      );

      // Alert headline
      getByText('Additional form needed');
      // Last sentence of body text
      getByText(/You can upload it at a later part of this process./);
    });
  });

  // Check that the type-agnostic text used in the alert is using plural terms
  // when more than one whitelisted asset type is present
  context('should use plural terms in the alert text', () => {
    it('when multiple whitelisted assets are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['BUSINESS', 'FARM'])} />,
      );

      // Alert headline
      getByText('Additional forms needed');
      // Last sentence of body text
      getByText(/You can upload them at a later part of this process./);
    });
  });

  // Check that the opening sentence of the alert body text is correct
  // based on the asset types present in the form data
  context('should render the correct opening text', () => {
    it('when assets with assetType "BUSINESS" are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['BUSINESS'])} />,
      );

      getByText(/You’ve added a business,/);
    });

    it('when assets with assetType "FARM" are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['FARM'])} />,
      );

      getByText(/You’ve added a farm,/);
    });

    it('when assets with assetType "BUSINESS" and "FARM" are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['BUSINESS', 'FARM'])} />,
      );

      getByText(/You’ve added a business and farm,/);
    });
  });

  // Check that the correct supplementary form information is rendered
  // based on the asset types present in the form data
  context('should render the correct supplementary form information', () => {
    const businessFormText = /Report of Income from Property or Business \(VA Form 21P-4185\)/;
    const farmFormText = /Pension Claim Questionnaire for Farm Income \(VA Form 21P-4165\)/;

    it('when assets with assetType "BUSINESS" are present', () => {
      const { getByText, queryByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['BUSINESS'])} />,
      );

      getByText(businessFormText);
      expect(queryByText(farmFormText)).to.not.exist;
    });

    it('when assets with assetType "FARM" are present', () => {
      const { getByText, queryByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['FARM'])} />,
      );

      getByText(farmFormText);
      expect(queryByText(businessFormText)).to.not.exist;
    });

    it('when assets with assetType "BUSINESS" and "FARM" are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['BUSINESS', 'FARM'])} />,
      );

      getByText(businessFormText);
      getByText(farmFormText);
    });
  });

  // Check that a single link to the corect form is rendered if only one whitelisted
  // asset type is present (regardless of how many assets of that type are present)
  context('should render a single link to the correct form:', () => {
    it('21P-4185 - when assets with assetType "BUSINESS" are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert
          formData={genAssets(['BUSINESS', 'BUSINESS'])}
        />,
      );

      // Link text
      getByText('Get VA Form 21P-4185 (opens in new tab)');
    });

    it('21P-4165 - when assets with assetType "FARM" are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert formData={genAssets(['FARM', 'FARM'])} />,
      );

      // Link text
      getByText('Get VA Form 21P-4165 (opens in new tab)');
    });
  });

  // Check that links to both forms are rendered when assets with both whitelisted
  // asset types are present (regardless of how many assets of that type are present,
  // only one link to each form should be rendered)
  context('should render links to the correct forms:', () => {
    it('when assets with assetType "BUSINESS" and "FARM" are present', () => {
      const { getByText } = render(
        <SupplementaryFormsAlert
          formData={genAssets(['BUSINESS', 'FARM', 'BUSINESS', 'FARM'])}
        />,
      );

      // Link text
      getByText('Get VA Form 21P-4185 (opens in new tab)');
      getByText('Get VA Form 21P-4165 (opens in new tab)');
    });
  });
});
