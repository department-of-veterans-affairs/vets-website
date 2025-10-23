import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GetFormHelp from '../../../../components/GetFormHelp';

describe('hca <GetFormHelp>', () => {
  context('when the component renders', () => {
    it('should render with the correct number of sections', () => {
      const { container } = render(<GetFormHelp />);
      const selector = container.querySelectorAll('.help-talk');
      expect(selector).to.have.lengthOf(3);
    });
  });
});
