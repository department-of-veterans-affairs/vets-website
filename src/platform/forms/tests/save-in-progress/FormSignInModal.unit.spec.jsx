import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
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
    const wrapper = shallow(<FormSignInModal {...props} />);
    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('should close as a primary action', () => {
    const wrapper = shallow(<FormSignInModal {...props} />);
    wrapper.prop('primaryButton').action();
    expect(props.onClose.calledOnce).to.be.true;
    expect(
      global.window.dataLayer.some(
        ({ event }) => event === 'no-login-finish-form',
      ),
    ).to.be.true;
    wrapper.unmount();
  });

  it('should start the sign-in process as a secondary action', () => {
    const wrapper = shallow(<FormSignInModal {...props} />);
    wrapper.prop('secondaryButton').action();
    expect(props.onClose.calledOnce).to.be.true;
    expect(props.onSignIn.calledOnce).to.be.true;
    expect(
      global.window.dataLayer.some(
        ({ event }) => event === 'login-link-restart-form',
      ),
    ).to.be.true;
    wrapper.unmount();
  });
});
