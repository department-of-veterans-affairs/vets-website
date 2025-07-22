import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';
import * as pilotUtils from '../../../utils/pilot';

import TestComponent from './TestComponent';

describe('Community Care Referrals', () => {
  describe('useIsInPilotUserStations hook', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
    });

    it('Returns true when getIsInPilotUserStations is true', () => {
      sandbox.stub(pilotUtils, 'getIsInPilotUserStations').returns(true);
      const screen = renderWithStoreAndRouter(<TestComponent />, {});
      expect(screen.getByTestId('pilot-value')).to.have.text('true');
    });
    it('Returns false when getIsInPilotUserStations is false', () => {
      sandbox.stub(pilotUtils, 'getIsInPilotUserStations').returns(false);
      const screen = renderWithStoreAndRouter(<TestComponent />, {});
      expect(screen.getByTestId('pilot-value')).to.have.text('false');
    });
  });
});
