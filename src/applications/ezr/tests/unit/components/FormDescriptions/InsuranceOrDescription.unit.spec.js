import { render } from '@testing-library/react';
import { expect } from 'chai';

import InsurancePolicyOrDescription from '../../../../components/FormDescriptions/InsurancePolicyOrDescription';

describe('ezr <InsurancePolicyOrDescription>', () => {
  describe('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(InsurancePolicyOrDescription);
      expect(container).to.not.be.empty;
    });
  });
});
