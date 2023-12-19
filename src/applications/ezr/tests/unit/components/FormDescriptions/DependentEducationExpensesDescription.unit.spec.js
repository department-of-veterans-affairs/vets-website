import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentEducationExpensesDescription from '../../../../components/FormDescriptions/DependentEducationExpensesDescription';

describe('ezr <DependentEducationExpensesDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(DependentEducationExpensesDescription);
      expect(container).to.not.be.empty;
    });
  });
});
