import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import GreetUser from '../../../components/webchat/makeBotGreetUser';

describe.only('makeBotGreetUser actions', () => {
  // mock store
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let fakeNext;
  let store;
  const connectFulfilledAction = { type: 'DIRECT_LINE/CONNECT_FULFILLED' };
  const connectSendMessage = {
    type: 'WEB_CHAT/SEND_MESSAGE',
    payload: { text: 'some@email.com' },
  };

  beforeEach(() => {
    fakeNext = sinon.stub();
    store = mockStore({});

    // authActivityHandlerSpy.reset();
    // messageActivityHandlerSpy.reset();
    // sessionStorage.removeItem(IN_AUTH_EXP);
    // sessionStorage.removeItem(LOGGED_IN_FLOW);
  });

  it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED" with auth true', async () => {
    // 1. test correct dispatches - done
    // 2. test values of the new actions
    // 2. TODO test invocation of next
    // 3. TODO test return of the reducer

    // TODO discover result of the "next" function
    // invoke greetUser with proper curried values
    await GreetUser.makeBotGreetUser(
      'csrfToken',
      'apiSession',
      'apiURL',
      'baseURL',
      'userFirstName',
      'userUuid',
      true,
    )(store)(fakeNext)(connectFulfilledAction);
    // fake the session storage using stubs

    const actions = store.getActions();
    expect(actions.length).to.equal(2);
    expect(fakeNext.callCount).to.equal(1);

    expect(actions[0].payload.activity).to.own.include({
      name: 'startConversation',
    });
    expect(actions[0]).to.own.include({ type: 'DIRECT_LINE/POST_ACTIVITY' });
  });

  // it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED" and is not "LOGGED_IN_FLOW"', () => {});
  it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED" with auth false', async () => {
    await GreetUser.makeBotGreetUser(
      'csrfToken',
      'apiSession',
      'apiURL',
      'baseURL',
      'userFirstName',
      'userUuid',
      false,
    )(store)(fakeNext)(connectFulfilledAction);

    const actions = store.getActions();
    expect(actions.length).to.equal(1);
    expect(fakeNext.callCount).to.equal(1);

    expect(actions[0]).to.own.include({ type: 'WEB_CHAT/SEND_EVENT' });
    expect(actions[0].payload).to.own.include({ name: 'webchat/join' });
  });
  it('should correctly handle "DIRECT_LINE/POST_ACTIVITY"', () => {});

  it('should correctly handle "WEB_CHAT/SEND_MESSAGE"', async () => {
    await GreetUser.makeBotGreetUser('csrfToken', 'apiSession', 'apiURL', 'baseURL', 'userFirstName', 'userUuid', false)(store)(fakeNext)(connectSendMessage);

    const actions = store.getActions();
    expect(actions.length).to.equal(0);
    expect(fakeNext.callCount).to.equal(1);

    expect(fakeNext.firstCall.args[0].payload).to.own.include({
      text: '****',
    });
  });
});
