import { render } from '@testing-library/react';
import { expect } from 'chai';

import MedicaidDescription from '../../../../components/FormDescriptions/MedicaidDescription';

describe('ezr <MedicaidDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(MedicaidDescription);
      expect(container).to.not.be.empty;
    });
  });
});
