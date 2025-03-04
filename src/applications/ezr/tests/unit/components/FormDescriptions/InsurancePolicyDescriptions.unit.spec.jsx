import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  InsurancePolicyOrDescription,
  PolicyOrGroupDescription,
  TricarePolicyDescription,
} from '../../../../components/FormDescriptions/InsurancePolicyDescriptions';

describe('ezr <InsurancePolicyOrDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(InsurancePolicyOrDescription);
      expect(container).to.not.be.empty;
    });
  });
});

describe('ezr <PolicyOrGroupDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(PolicyOrGroupDescription);
      expect(container).to.not.be.empty;
    });
  });
});

describe('ezr <TricarePolicyDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(TricarePolicyDescription);
      expect(container).to.not.be.empty;
    });
  });
});
