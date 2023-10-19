import { render } from '@testing-library/react';
import { expect } from 'chai';

import InsurancePolicyOrGroupDescription from '../../../../components/FormDescriptions/InsurancePolicyOrGroupDescription';

describe('ezr <InsurancePolicyOrGroupDescription>', () => {
  describe('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(InsurancePolicyOrGroupDescription);
      expect(container).to.not.be.empty;
    });
  });
});
