import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { SupplementaryFormsAlert } from '../../../components/FormAlerts/SupplementaryFormsAlert';

describe('pension <SupplementaryFormsAlert>', () => {
  context('should not render', () => {
    it('when no assets are present', () => {
      const { container } = render(<SupplementaryFormsAlert formData={{}} />);

      const selector = container.querySelector('va-alert');

      expect(selector).to.not.exist;
    });

    it('when no whitelisted asset types are present', () => {
      const { container } = render(
        <SupplementaryFormsAlert
          formData={{ ownedAssets: [{ assetType: 'RENTAL_PROPERTY' }] }}
        />,
      );

      const selector = container.querySelector('va-alert');

      expect(selector).to.not.exist;
    });
  });
});
