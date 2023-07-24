import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GetHelp from '../../components/GetHelp';

describe('hca <GetHelp>', () => {
  describe('when the component renders', () => {
    it('should render with the correct number of sections', () => {
      const { container } = render(<GetHelp />);
      const selector = container.querySelectorAll('.help-talk');
      expect(selector).to.have.lengthOf(2);
    });
  });
});
