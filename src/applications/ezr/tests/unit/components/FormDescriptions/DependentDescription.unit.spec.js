import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentDescription from '../../../../components/FormDescriptions/DependentDescription';

describe('ezr <DependentDescription>', () => {
  context('when the component renders', () => {
    it('should render `va-additional-info` component', () => {
      const { container } = render(<DependentDescription />);
      const selector = container.querySelector('va-additional-info');
      expect(selector).to.exist;
    });
  });
});
