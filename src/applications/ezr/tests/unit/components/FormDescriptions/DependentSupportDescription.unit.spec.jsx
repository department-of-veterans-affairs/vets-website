import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentSupportDescription from '../../../../components/FormDescriptions/DependentSupportDescription';

describe('ezr <DependentSupportDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(DependentSupportDescription);
      expect(container).to.not.be.empty;
    });
  });
});
