// import { expect } from 'chai';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
// import {
//   MCP_STATEMENTS_FETCH_INIT,
//   MCP_STATEMENTS_FETCH_SUCCESS,
//   MCP_STATEMENTS_FETCH_FAILURE,
//   getStatements,
// } from '../../actions/copays';

// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);

// describe('Copay Actions', () => {
//   let store;

//   beforeEach(() => {
//     store = mockStore({});
//   });

//   it('dispatches MCP_STATEMENTS_FETCH_SUCCESS on successful fetch', async () => {
//     const mockResponse = {
//       data: [
//         {
//           station: {
//             facilitYNum: '123',
//             city: 'NEW YORK',
//           },
//         },
//       ],
//     };
//     mockApiRequest(mockResponse);

//     await store.dispatch(getStatements());

//     const actions = store.getActions();
//     expect(actions[0]).to.deep.equal({ type: MCP_STATEMENTS_FETCH_INIT });

//     const successAction = actions[1];
//     expect(successAction.type).to.equal(MCP_STATEMENTS_FETCH_SUCCESS);
//     expect(successAction.response).to.be.an('array').with.lengthOf(1);

//     const transformedStatement = successAction.response[0];
//     expect(transformedStatement.station.facilitYNum).to.equal('123');
//     expect(transformedStatement.station.city).to.equal('New York');
//     expect(transformedStatement.station).to.have.property('facilityName');
//   });

//   it('dispatches MCP_STATEMENTS_FETCH_FAILURE on failed fetch', async () => {
//     const error = { errors: [{ detail: 'API Error' }] };
//     mockApiRequest(error, false);

//     await store.dispatch(getStatements());

//     const actions = store.getActions();
//     expect(actions[0]).to.deep.equal({ type: MCP_STATEMENTS_FETCH_INIT });
//     expect(actions[1].type).to.equal(MCP_STATEMENTS_FETCH_FAILURE);
//     expect(actions[1].error).to.deep.equal(error.errors[0]);
//   });
// });
