import { render } from '@testing-library/react';
import { expect } from 'chai';

import MedicarePartADescription from '../../../../components/FormDescriptions/MedicarePartADescription';

describe('ezr <MedicarePartADescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(MedicarePartADescription);
      expect(container).to.not.be.empty;
    });
  });
});
