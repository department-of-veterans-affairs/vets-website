import { render } from '@testing-library/react';
import { expect } from 'chai';

import SigiDescription from '../../../../components/FormDescriptions/SigiDescription';

describe('ezr <SigiDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(SigiDescription);
      expect(container).to.not.be.empty;
    });
  });
});
