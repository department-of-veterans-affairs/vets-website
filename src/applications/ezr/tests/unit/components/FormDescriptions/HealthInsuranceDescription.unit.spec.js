import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import HealthInsuranceDescription from '../../../../components/FormDescriptions/HealthInsuranceDescription';

describe('ezr <HealthInsuranceDescription>', () => {
  context('when the component renders', () => {
    it('should render `va-additional-info` component', () => {
      const { container } = render(<HealthInsuranceDescription />);
      const selector = container.querySelector('va-additional-info');
      expect(selector).to.exist;
    });
  });
});
