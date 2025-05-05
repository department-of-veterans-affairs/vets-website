import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import useAfterRenderEffect from '../../../hooks/useAfterRenderEffect';

const TestComponent = () => {
  return <div />;
};

describe('ezr `useAfterRenderEffect` hook', () => {
  let callback;

  beforeEach(() => {
    callback = sinon.spy();
  });

  context('when the hook runs on initial render', () => {
    it('should not call the callback function', () => {
      const { container } = render(
        <TestComponent hook={() => useAfterRenderEffect(callback)} />,
      );
      expect(container).to.not.be.empty;
      expect(callback.called).to.be.false;
    });
  });
});
