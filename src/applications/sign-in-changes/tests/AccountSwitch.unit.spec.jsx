import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import AccountSwitch from '../components/AccountSwitch';
import { maskEmail } from '../helpers';

const generateStore = dispatch => ({
  getState: () => ({}),
  subscribe: sinon.stub(),
  dispatch,
});
const oldLocation = global.window.location;
describe('AccountSwitch', () => {
  let store;
  let dispatchStub;
  let maskEmailStub;
  beforeEach(() => {
    dispatchStub = sinon.stub();
    store = generateStore(dispatchStub);
    maskEmailStub = sinon.stub(maskEmail);
    maskEmailStub.returns('tes***@example.com');
  });
  afterEach(() => {
    dispatchStub = undefined;
    store = {};
    maskEmailStub.restore();
  });
  after(() => {
    global.window.location = oldLocation;
  });
  it('renders the component and calls maskEmail with the correct email', () => {
    const mockEmail = 'test@example.com';
    render(
      <Provider store={store}>
        <AccountSwitch hasLogingov userEmail={mockEmail} />
      </Provider>,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).to.include(
      'Switch to your Login.gov account now',
    );
    expect(screen.getByText('tes***@example.com')).to.be.in.the.document;
    expect(maskEmailStub.calledWith(mockEmail)).to.be.true;
  });
  it('renders Login.gov when hasLogingov is true', () => {
    const mockEmail = 'test@example.com';
    render(
      <Provider store={store}>
        <AccountSwitch hasLogingov userEmail={mockEmail} />
      </Provider>,
    );
    const loginGovButton = screen.getByRole('button', {
      name: /Create an account with Login.gov/i,
    });
    expect(loginGovButton).to.not.be.null;
  });
  it('renders ID.me when hasLogingov is false', () => {
    const mockEmail = 'test@example.com';
    render(
      <Provider store={store}>
        <AccountSwitch hasLogingov={false} userEmail={mockEmail} />
      </Provider>,
    );
    const idmeButton = screen.getByRole('button', {
      name: /Create an account with ID.me/i,
    });
    expect(idmeButton).to.not.be.null;
  });
});
