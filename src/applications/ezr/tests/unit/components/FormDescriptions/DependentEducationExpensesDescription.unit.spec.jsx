import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentExpensesDescription from '../../../../components/FormDescriptions/DependentExpensesDescription';

describe('ezr <DependentExpensesDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(DependentExpensesDescription);
      expect(container).to.not.be.empty;
    });
  });
});
