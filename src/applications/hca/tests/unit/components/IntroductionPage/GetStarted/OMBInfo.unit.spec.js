import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import OMBInfo from '../../../../../components/IntroductionPage/GetStarted/OMBInfo';

describe('hca <OMBInfo>', () => {
  context('when the component renders', () => {
    it('should render a `va-omb-info` component', () => {
      const { container } = render(<OMBInfo />);
      const selector = container.querySelectorAll('va-omb-info');
      expect(selector).to.exist;
    });
  });
});
