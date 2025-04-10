import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
} from '../../../../components/FormDescriptions/ExpensesDescriptions';

describe('ezr <EducationalExpensesDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(EducationalExpensesDescription);
      expect(container).to.not.be.empty;
    });
  });
});

describe('ezr <MedicalExpensesDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(MedicalExpensesDescription);
      expect(container).to.not.be.empty;
    });
  });
});
