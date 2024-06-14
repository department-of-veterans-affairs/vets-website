import { render } from '@testing-library/react';
import { expect } from 'chai';

import SpouseFinancialSupportDescription from '../../../../components/FormDescriptions/SpouseFinancialSupportDescription';

describe('ezr <SpouseFinancialSupportDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(SpouseFinancialSupportDescription);
      expect(container).to.not.be.empty;
    });
  });
});
