import { render } from '@testing-library/react';
import { expect } from 'chai';

import TricarePolicyDescription from '../../../../components/FormDescriptions/TricarePolicyDescription';

describe('ezr <TricarePolicyDescription>', () => {
  describe('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(TricarePolicyDescription);
      expect(container).to.not.be.empty;
    });
  });
});
