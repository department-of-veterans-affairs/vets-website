// import React from 'react';
// import { expect } from 'chai';
// import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
// import reducer from '../reducers';
// import InboxPage from '../containers/InboxPage';
//
// describe('Render MEB or TOE claim status', () => {
//   const initialState = {
//     MEBClaimStatus: {
//       claimStatus: 'ELIGIBLE',
//     },
//     TOEClaimStatus: {
//       claimStatus: 'DENIAL',
//     },
//     claimStatus: {},
//     getClaimStatus: '',
//     user: {},
//     MEBClaimStatusFetchInProgress: false,
//     MEBClaimStatusFetchComplete: true,
//     TOEClaimStatusFetchInProgress: false,
//     TOEClaimStatusFetchComplete: true,
//   };

// expect(initialState.MEBClaimStatus.claimStatus).to.be('ELIGIBLE')

// it('renders the letter depending on claim status', () => {
//   const screen = renderWithStoreAndRouter(<InboxPage />, {
//     initialState,
//     reducer,
//     path: '/education/download-letters/letters',
//   });
//
//   console.log(screen);
//
//   expect(
//     screen.findByText('Download Post-9/11 GI Bill decision letter', {
//       exact: true,
//     }),
//   );
// });
// });
