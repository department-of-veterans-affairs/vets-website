import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import StickyBot from '../../components/StickyBot';
import * as Disclaimer from '../../components/Disclaimer/Disclaimer';
import * as Chatbox from '../../components/Chatbox';

describe('StickyBot', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('StickyBot', () => {
    it('should render the disclaimer and chatbox components', () => {
      sandbox
        .stub(Disclaimer, 'default')
        .callsFake(() => <div data-testid="disclaimer" />);
      sandbox
        .stub(Chatbox, 'default')
        .callsFake(() => <div data-testid="chatbox" />);

      const { getByTestId } = render(<StickyBot />);

      expect(getByTestId('disclaimer')).to.exist;
      expect(getByTestId('chatbox')).to.exist;
    });
  });
});
