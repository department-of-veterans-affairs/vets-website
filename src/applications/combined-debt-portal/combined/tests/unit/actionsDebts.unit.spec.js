import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  DEBT_LETTERS_FETCH_INITIATED,
  DEBT_LETTERS_FETCH_SUCCESS,
  DEBT_LETTERS_FETCH_FAILURE,
  fetchDebtLettersVBMS,
} from '../../actions/debts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Debt Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  it('dispatches DEBT_LETTERS_FETCH_SUCCESS on successful fetch', async () => {
    const mockResponse = [
      { typeDescription: 'DMC - Letter 1', receivedAt: '2024-01-01' },
      { typeDescription: 'Letter 2', receivedAt: '2024-01-02' },
    ];
    mockApiRequest(mockResponse);

    await store.dispatch(fetchDebtLettersVBMS());

    const actions = store.getActions();
    expect(actions[0]).to.deep.equal({ type: DEBT_LETTERS_FETCH_INITIATED });

    const successAction = actions[1];
    expect(successAction.type).to.equal(DEBT_LETTERS_FETCH_SUCCESS);
    expect(successAction.debtLinks)
      .to.be.an('array')
      .with.lengthOf(2);

    successAction.debtLinks.forEach((link, index) => {
      expect(link).to.have.property('typeDescription');
      expect(link).to.have.property('receivedAt');
      if (link.date) {
        expect(link.date).to.be.instanceOf(Date);
      }
      if (index === 0) {
        expect(link.typeDescription).to.not.include('DMC - ');
      }
    });
  });

  it('dispatches DEBT_LETTERS_FETCH_FAILURE on failed fetch', async () => {
    mockApiRequest({}, false);

    await store.dispatch(fetchDebtLettersVBMS());

    const actions = store.getActions();
    expect(actions[0]).to.deep.equal({ type: DEBT_LETTERS_FETCH_INITIATED });
    expect(actions[1]).to.deep.equal({ type: DEBT_LETTERS_FETCH_FAILURE });
  });
});
