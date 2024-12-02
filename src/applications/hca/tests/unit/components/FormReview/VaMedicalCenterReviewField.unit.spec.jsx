import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VaMedicalCenterReviewField } from '../../../../components/FormReview/VaMedicalCenterReviewField';

describe('hca <VaMedicalCenterReviewField>', () => {
  context('when the component renders', () => {
    it('should render the correct state and facility name', async () => {
      const props = {
        stateLabel: 'New York',
        facilityName: 'Batavia VA Medical Center',
      };
      const { container } = render(<VaMedicalCenterReviewField {...props} />);

      const stateSelector = container.querySelector(
        '[data-testid="hca-facility-state"]',
      );
      expect(stateSelector.textContent).to.eq(props.stateLabel);

      const facilitySelector = container.querySelector(
        '[data-testid="hca-facility-name"]',
      );
      expect(facilitySelector.textContent).to.eq(props.facilityName);
    });
  });
});
