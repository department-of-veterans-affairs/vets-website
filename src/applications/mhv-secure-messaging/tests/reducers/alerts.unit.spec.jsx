import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { alertsReducer } from '../../reducers/alerts';
import { focusOutAlert, closeAlert, addAlert } from '../../actions/alerts';
import { Actions } from '../../util/actionTypes';

describe('alerts reducers', () => {
  it('should return initial state', () => {
    const state = alertsReducer(undefined, {});
    
    expect(state).to.have.property('alertVisible', false);
    expect(state).to.have.property('alertFocusOut', false);
    expect(state).to.have.property('alertList');
    expect(state.alertList).to.be.an('array').that.is.empty;
  });

  const mockStore = (initialState) => {
    return createStore(alertsReducer, initialState, applyMiddleware(thunk));
  };

  it('should dispatch action on alert focus out', async () => {
    const store = mockStore();
    await store.dispatch(focusOutAlert());
    expect(store.getState().alertFocusOut).to.equal(true);
  });

  it('should add an alert to the list', async () => {
    const store = mockStore();
    
    // addAlert signature: alertType, header, content, className, link, title, response
    await store.dispatch(addAlert('success', 'Success Header', 'Test alert message'));
    const state = store.getState();
    
    expect(state.alertVisible).to.equal(true);
    expect(state.alertList).to.have.lengthOf(1);
    expect(state.alertList[0].alertType).to.equal('success');
    expect(state.alertList[0].content).to.equal('Test alert message');
    expect(state.alertList[0].header).to.equal('Success Header');
    expect(state.alertList[0].isActive).to.equal(true);
  });

  it('should add alert with custom header', async () => {
    const store = mockStore();
    
    await store.dispatch(
      addAlert('error', 'Custom Header', 'Error message'),
    );
    const state = store.getState();
    
    expect(state.alertList[0].header).to.equal('Custom Header');
    expect(state.alertList[0].content).to.equal('Error message');
  });

  it('should add alert with default header from alertType when header is null', async () => {
    const store = mockStore();
    
    await store.dispatch(addAlert('warning', null, 'Warning message'));
    const state = store.getState();
    
    expect(state.alertList[0].header).to.equal('Warning');
    expect(state.alertList[0].content).to.equal('Warning message');
  });

  it('should add multiple alerts to the list', async () => {
    const store = mockStore();
    
    await store.dispatch(addAlert('success', 'Header 1', 'First alert'));
    await store.dispatch(addAlert('error', 'Header 2', 'Second alert'));
    const state = store.getState();
    
    expect(state.alertList).to.have.lengthOf(2);
    expect(state.alertList[0].content).to.equal('First alert');
    expect(state.alertList[1].content).to.equal('Second alert');
  });

  it('should close alerts and set visibility to false', async () => {
    const store = mockStore({
      alertVisible: true,
      alertFocusOut: true,
      alertList: [
        {
          alertType: 'success',
          content: 'Test',
          isActive: true,
          datestamp: new Date(),
        },
      ],
    });
    
    await store.dispatch(closeAlert());
    const state = store.getState();
    
    expect(state.alertVisible).to.equal(false);
    expect(state.alertFocusOut).to.equal(false);
  });

  it('should handle ADD_ALERT action directly', () => {
    const state = alertsReducer(undefined, {
      type: Actions.Alerts.ADD_ALERT,
      payload: {
        alertType: 'info',
        content: 'Information message',
        className: 'info-class',
        link: '/test-link',
        title: 'Test Title',
      },
    });
    
    expect(state.alertVisible).to.equal(true);
    expect(state.alertList).to.have.lengthOf(1);
    expect(state.alertList[0].className).to.equal('info-class');
    expect(state.alertList[0].link).to.equal('/test-link');
    expect(state.alertList[0].title).to.equal('Test Title');
  });

  it('should handle CLOSE_ALERT action directly', () => {
    const initialState = {
      alertVisible: true,
      alertFocusOut: true,
      alertList: [
        {
          alertType: 'success',
          content: 'Test',
          isActive: true,
          datestamp: new Date(Date.now() - 5000), // 5 seconds ago
        },
      ],
    };
    
    const state = alertsReducer(initialState, {
      type: Actions.Alerts.CLOSE_ALERT,
    });
    
    expect(state.alertVisible).to.equal(false);
    expect(state.alertFocusOut).to.equal(false);
    expect(state.alertList[0].isActive).to.equal(false);
  });

  it('should handle unknown action type', () => {
    const initialState = {
      alertVisible: false,
      alertFocusOut: false,
      alertList: [],
    };
    
    const state = alertsReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    });
    
    expect(state).to.deep.equal(initialState);
  });
});
