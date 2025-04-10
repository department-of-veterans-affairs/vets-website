import { render } from '@testing-library/react';
import { expect } from 'chai';

import SpouseInfoDescription from '../../../../components/FormDescriptions/SpouseInfoDescription';

describe('ezr <SpouseInfoDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(SpouseInfoDescription);
      expect(container).to.not.be.empty;
    });
  });
});
