import { render } from '@testing-library/react';
import { expect } from 'chai';

import SigiDescription from '../../../../components/FormDescriptions/SigiDescription';

describe('ezr <SigiDescription>', () => {
  describe('when the component renders', () => {
    it('should render `va-additional-info` component', () => {
      const { container } = render(SigiDescription);
      const selector = container.querySelector('va-additional-info');
      expect(selector).to.exist;
    });
  });
});
