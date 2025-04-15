import { render } from '@testing-library/react';
import { expect } from 'chai';

import MedicareClaimNumberDescription from '../../../../components/FormDescriptions/MedicareClaimNumberDescription';

describe('ezr <MedicareClaimNumberDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(MedicareClaimNumberDescription);
      expect(container).to.not.be.empty;
    });
  });
});
