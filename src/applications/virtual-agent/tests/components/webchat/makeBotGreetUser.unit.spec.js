// import {
//   processActionSendMessage,
//   processActionConnectFulfilled,
//   processActionIncomingActivity,
// } from '../../../components/webchat/makeBotGreetUser';
import { expect } from 'chai';
// import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import GreetUser from '../../../components/webchat/makeBotGreetUser';

describe.only('makeBotGreetUser actions', () => {
  // mock store
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;

  beforeEach(() => {
    store = mockStore(
      {},
      GreetUser.makeBotGreetUser(
        'fakeCsrfToken',
        'fakeApiSession',
        'http://apiURL',
        'http://baseURL',
        'noFirstNameFound',
        'fakeUserUuid',
        true,
      ),
    );
    // authActivityHandlerSpy.reset();
    // messageActivityHandlerSpy.reset();
    // sessionStorage.removeItem(IN_AUTH_EXP);
    // sessionStorage.removeItem(LOGGED_IN_FLOW);
  });

  it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED"', () => {
    // fire dispatch against mock store
    store.dispatch({ type: 'DIRECT_LINE/CONNECT_FULFILLED' });

    // check that the right action in the mock store has been invoked
    const actions = store.getActions();
    expect(actions.length).to.equal(1);
    console.log(actions[0]);
    expect(actions[0].payload.activity).to.own.include({
      name: 'startConversation',
      type: 'event',
    });
  });

  // it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED" and is not "LOGGED_IN_FLOW"', () => {});

  it('should correctly handle "DIRECT_LINE/POST_ACTIVITY"', () => {});

  it('should correctly handle "DIRECT_LINE/SEND_MESSAGE"', () => {});
});
