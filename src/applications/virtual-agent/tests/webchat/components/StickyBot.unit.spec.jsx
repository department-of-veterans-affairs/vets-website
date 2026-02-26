import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import * as Disclaimer from '../../../chatbot/features/shell/components/LeftColumnContent';
import * as Chatbox from '../../../webchat/components/Chatbox';
import StickyBot from '../../../webchat/components/StickyBot';

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
