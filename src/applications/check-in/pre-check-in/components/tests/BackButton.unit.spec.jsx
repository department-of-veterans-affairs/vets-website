import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import BackButton from '../BackButton';

describe('check-in', () => {
  describe('BackButton', () => {
    it('Renders', () => {
      const goBack = sinon.spy();

      const screen = render(<BackButton action={goBack} path="/test/path" />);

      expect(screen.getByTestId('back-button')).to.exist;
      expect(screen.getByTestId('back-button')).to.have.text(
        'Back to last screen',
      );
    });
    it('click fires router goBack', () => {
      const goBack = sinon.spy();
      const screen = render(<BackButton action={goBack} path="/test/path" />);

      expect(screen.getByTestId('back-button')).to.exist;
      fireEvent.click(screen.getByTestId('back-button'));
      expect(goBack.calledOnce).to.be.true;
    });
  });
});
