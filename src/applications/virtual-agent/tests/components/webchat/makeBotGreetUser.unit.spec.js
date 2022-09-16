// import {
//   processActionSendMessage,
//   processActionConnectFulfilled,
//   processActionIncomingActivity,
// } from '../../../components/webchat/makeBotGreetUser';
import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import GreetUser from '../../../components/webchat/makeBotGreetUser';

describe.only('makeBotGreetUser actions', () => {
  // mock store
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  let fakeNext;
  beforeEach(() => {
    fakeNext = sinon.stub();
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
    // fake next
    // authActivityHandlerSpy.reset();
    // messageActivityHandlerSpy.reset();
    // sessionStorage.removeItem(IN_AUTH_EXP);
    // sessionStorage.removeItem(LOGGED_IN_FLOW);
  });

  it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED"', () => {
    // 1. test correct dispatches - done
    // 2. TODO test invocation of next
    // 3. TODO test return of the reducer

    // TODO discover result of the "next" function
    // invoke greetUser with proper curried values
    const action = { type: 'DIRECT_LINE/CONNECT_FULFILLED' };
    GreetUser.makeBotGreetUser(
      'csrfToken',
      'apiSession',
      'apiURL',
      'baseURL',
      'userFirstName',
      'userUuid',
      'requireAuth',
    )(store)(fakeNext)(action);
    // fake the session storage using stubs

    const actions = store.getActions();
    expect(actions.length).to.equal(2);
    expect(fakeNext.callCount).to.equal(1);

    // expect(actions[0].payload.activity).to.own.include({
    //   name: 'startConversation',
    //   type: 'event',
    // });
  });

  // it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED" and is not "LOGGED_IN_FLOW"', () => {});

  it('should correctly handle "DIRECT_LINE/POST_ACTIVITY"', () => {});

  it('should correctly handle "DIRECT_LINE/SEND_MESSAGE"', () => {});
});
