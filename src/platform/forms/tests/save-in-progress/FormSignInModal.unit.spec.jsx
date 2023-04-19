import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import FormSignInModal from '../../save-in-progress/FormSignInModal';

describe('<FormSignInModal>', () => {
  const props = {
    onClose: sinon.spy(),
    onSignIn: sinon.spy(),
    visible: false,
  };

  let oldWindow = null;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, { dataLayer: [] });
  });

  afterEach(() => {
    props.onClose.reset();
    props.onSignIn.reset();
    global.window = oldWindow;
  });

  it('should render', () => {
    const tree = render(<FormSignInModal {...props} />);
    expect(tree.baseElement).to.exist;
    tree.unmount();
  });

  it('should close as a primary action', () => {
    const tree = render(<FormSignInModal {...props} />);
    const modal = tree.baseElement.querySelector('va-modal');
    modal.__events.primaryButtonClick();

    expect(props.onClose.calledOnce).to.be.true;
    expect(
      global.window.dataLayer.some(
        ({ event }) => event === 'no-login-finish-form',
      ),
    ).to.be.true;
    tree.unmount();
  });

  it('should start the sign-in process as a secondary action', () => {
    const tree = render(<FormSignInModal {...props} />);
    const modal = tree.baseElement.querySelector('va-modal');
    modal.__events.secondaryButtonClick();

    expect(props.onClose.calledOnce).to.be.true;
    expect(props.onSignIn.calledOnce).to.be.true;
    expect(
      global.window.dataLayer.some(
        ({ event }) => event === 'login-link-restart-form',
      ),
    ).to.be.true;
    tree.unmount();
  });
});
