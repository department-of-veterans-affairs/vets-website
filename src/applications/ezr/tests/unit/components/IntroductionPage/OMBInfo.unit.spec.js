import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import OMBInfo from '../../../../components/IntroductionPage/OMBInfo';

describe('ezr <OMBInfo>', () => {
  describe('when the component renders', () => {
    it('should render a `va-omb-info` component', () => {
      const { container } = render(<OMBInfo />);
      const selector = container.querySelector('va-omb-info');
      expect(selector).to.exist;
    });

    it('should contain the correct props to populate the web component', () => {
      const { container } = render(<OMBInfo />);
      const selector = container.querySelector('va-omb-info');
      expect(selector).to.have.attr('exp-date');
      expect(selector).to.have.attr('omb-number');
      expect(selector).to.have.attr('res-burden');
    });
  });
});
