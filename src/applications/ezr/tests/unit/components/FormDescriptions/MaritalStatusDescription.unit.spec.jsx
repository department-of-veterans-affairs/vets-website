import { render } from '@testing-library/react';
import { expect } from 'chai';

import MaritalStatusDescription from '../../../../components/FormDescriptions/MaritalStatusDescription';

describe('ezr <MaritalStatusDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(MaritalStatusDescription);
      expect(container).to.not.be.empty;
    });
  });
});
