// TODO: Update this test file to work.
// Importing from @department-of-veterans-affairs/platform-startup/exports
// in this test is causing issues. The problem exists trying to import
// directly (to stub), but also exists trying to import startFormEngineFormApp
// because that file imports from @department-of-veterans-affairs/platform-startup/exports.
// So it's effectively not possible to test anything without figuring this out.

// import * as startup from '@department-of-veterans-affairs/platform-startup/exports';
// import sinon from 'sinon';
// import { startFormEngineFormApp } from '../../../utils/startApp';

// describe('startFormEngineFormApp', () => {
//   it('calls startAppFromIndex', () => {
//     const startAppFromIndexStub = sinon.stub(startup, 'startAppFromIndex');
//     startFormEngineFormApp({
//       formId: 'some-form-id',
//       rootUrl: '/root-url',
//       trackingPrefix: 'tracking-prefix-',
//     });
//     sinon.assert.calledOnce(startAppFromIndexStub);
//   });
// });
