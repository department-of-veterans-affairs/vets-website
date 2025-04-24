import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../../components/FormDescriptions/IncomeDescriptions';

describe('ezr <GrossIncomeDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(GrossIncomeDescription);
      expect(container).to.not.be.empty;
    });
  });
});

describe('ezr <OtherIncomeDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(OtherIncomeDescription);
      expect(container).to.not.be.empty;
    });
  });
});
