import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import Basic526Link, {
  RETURN_PATH_KEY_PREFIX,
  pushReturnPath,
  popReturnPath,
  onNavForwardToReturnPath,
  withReturnPath,
} from '../../components/Basic526Link';

describe('Basic526Link', () => {
  afterEach(() => {
    sessionStorage.removeItem(RETURN_PATH_KEY_PREFIX);
    sessionStorage.removeItem(`${RETURN_PATH_KEY_PREFIX}-sha`);
    sessionStorage.removeItem(`${RETURN_PATH_KEY_PREFIX}-te`);
  });

  describe('component', () => {
    it('renders a va-link with the correct href and text', () => {
      const { container } = render(
        <Basic526Link
          path="supporting-evidence/some-page"
          text="Go to some page"
        />,
      );
      const link = container.querySelector('va-link');

      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal(
        '/supporting-evidence/some-page',
      );
      expect(link.getAttribute('text')).to.equal('Go to some page');
    });

    it('prepends / to href when path does not start with /', () => {
      const { container } = render(
        <Basic526Link path="some-page" text="Link" />,
      );
      const link = container.querySelector('va-link');

      expect(link.getAttribute('href')).to.equal('/some-page');
    });

    it('does not double-prepend / when path starts with /', () => {
      const { container } = render(
        <Basic526Link path="/some-page" text="Link" />,
      );
      const link = container.querySelector('va-link');

      expect(link.getAttribute('href')).to.equal('/some-page');
    });
  });

  describe('pushReturnPath / popReturnPath (default stack)', () => {
    it('pushes and pops a single path', () => {
      pushReturnPath('/page-a');
      expect(popReturnPath()).to.equal('/page-a');
      expect(popReturnPath()).to.be.null;
    });

    it('pops paths in LIFO order (stack)', () => {
      pushReturnPath('/page-a');
      pushReturnPath('/page-b');
      pushReturnPath('/page-c');

      expect(popReturnPath()).to.equal('/page-c');
      expect(popReturnPath()).to.equal('/page-b');
      expect(popReturnPath()).to.equal('/page-a');
      expect(popReturnPath()).to.be.null;
    });

    it('clears sessionStorage when the last path is popped', () => {
      pushReturnPath('/page-a');
      popReturnPath();

      expect(sessionStorage.getItem(RETURN_PATH_KEY_PREFIX)).to.be.null;
    });

    it('returns null when stack is empty', () => {
      expect(popReturnPath()).to.be.null;
    });

    it('returns null when sessionStorage has invalid JSON', () => {
      sessionStorage.setItem(RETURN_PATH_KEY_PREFIX, 'not-json');
      expect(popReturnPath()).to.be.null;
    });
  });

  describe('pushReturnPath / popReturnPath (grouped stacks)', () => {
    it('isolates stacks by group name', () => {
      pushReturnPath('/sha-page', 'sha');
      pushReturnPath('/te-page', 'te');

      expect(popReturnPath('sha')).to.equal('/sha-page');
      expect(popReturnPath('te')).to.equal('/te-page');
    });

    it('grouped stacks do not interfere with the default stack', () => {
      pushReturnPath('/default-page');
      pushReturnPath('/sha-page', 'sha');

      expect(popReturnPath()).to.equal('/default-page');
      expect(popReturnPath('sha')).to.equal('/sha-page');
    });

    it('grouped stacks maintain LIFO order independently', () => {
      pushReturnPath('/sha-1', 'sha');
      pushReturnPath('/te-1', 'te');
      pushReturnPath('/sha-2', 'sha');

      expect(popReturnPath('sha')).to.equal('/sha-2');
      expect(popReturnPath('te')).to.equal('/te-1');
      expect(popReturnPath('sha')).to.equal('/sha-1');
    });
  });

  describe('onNavForwardToReturnPath', () => {
    it('navigates to the most recent return path (default stack)', () => {
      pushReturnPath('/page-a');
      pushReturnPath('/page-b');

      const goPath = sinon.spy();
      const goNextPath = sinon.spy();

      onNavForwardToReturnPath()({ goPath, goNextPath });

      expect(goPath.calledOnce).to.be.true;
      expect(goPath.calledWith('/page-b')).to.be.true;
      expect(goNextPath.called).to.be.false;
      // /page-a should still be on the stack
      expect(popReturnPath()).to.equal('/page-a');
    });

    it('navigates to the most recent return path (grouped stack)', () => {
      pushReturnPath('/sha-page', 'sha');

      const goPath = sinon.spy();
      const goNextPath = sinon.spy();

      onNavForwardToReturnPath('sha')({ goPath, goNextPath });

      expect(goPath.calledOnce).to.be.true;
      expect(goPath.calledWith('/sha-page')).to.be.true;
      expect(goNextPath.called).to.be.false;
    });

    it('proceeds to the next page when no return path is stored', () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();

      onNavForwardToReturnPath()({ goPath, goNextPath });

      expect(goPath.called).to.be.false;
      expect(goNextPath.calledOnce).to.be.true;
    });
  });

  describe('withReturnPath', () => {
    it('navigates to the most recent return path and skips wrapped handler', () => {
      pushReturnPath('/page-a');

      const goPath = sinon.spy();
      const goNextPath = sinon.spy();
      const wrappedHandler = sinon.spy();
      const handler = withReturnPath(wrappedHandler);

      handler({ goPath, goNextPath });

      expect(goPath.calledOnce).to.be.true;
      expect(goPath.calledWith('/page-a')).to.be.true;
      expect(wrappedHandler.called).to.be.false;
    });

    it('navigates using the grouped stack when group is provided', () => {
      pushReturnPath('/sha-page', 'sha');

      const goPath = sinon.spy();
      const wrappedHandler = sinon.spy();
      const handler = withReturnPath(wrappedHandler, 'sha');

      handler({ goPath });

      expect(goPath.calledOnce).to.be.true;
      expect(goPath.calledWith('/sha-page')).to.be.true;
      expect(wrappedHandler.called).to.be.false;
    });

    it('delegates to the wrapped handler when no return path is stored', () => {
      const goPath = sinon.spy();
      const goNextPath = sinon.spy();
      const wrappedHandler = sinon.spy();
      const handler = withReturnPath(wrappedHandler);

      const props = {
        goPath,
        goNextPath,
        formData: { someField: 'value' },
      };

      handler(props);

      expect(goPath.called).to.be.false;
      expect(wrappedHandler.calledOnce).to.be.true;
      expect(wrappedHandler.calledWith(props)).to.be.true;
    });
  });
});
