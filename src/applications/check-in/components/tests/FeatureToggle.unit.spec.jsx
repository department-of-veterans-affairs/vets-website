import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FeatureToggle, { FeatureOn, FeatureOff } from '../FeatureToggle';

describe('check-in', () => {
  describe('FeatureToggle', () => {
    it('Renders FeatureToggle ON', () => {
      const screen = render(
        <FeatureToggle on>
          <FeatureOn>Feature On</FeatureOn>
          <FeatureOff>Feature Off</FeatureOff>
          <div>Always On</div>
        </FeatureToggle>,
      );
      expect(screen.queryByText(/Feature On/i)).to.exist;
      expect(screen.queryByText(/Feature Off/i)).not.to.exist;
      expect(screen.queryByText(/Always On/i)).to.exist;
    });
    it('Renders FeatureToggle OFF', () => {
      const screen = render(
        <FeatureToggle on={false}>
          <FeatureOn>Feature On</FeatureOn>
          <FeatureOff>Feature Off</FeatureOff>
          <div>Always On</div>
        </FeatureToggle>,
      );
      expect(screen.queryByText(/Feature On/i)).not.to.exist;
      expect(screen.queryByText(/Feature Off/i)).to.exist;
      expect(screen.queryByText(/Always On/i)).to.exist;
    });
  });
});
