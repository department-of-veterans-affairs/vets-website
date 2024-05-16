// import sinon from 'sinon';
// import { expect } from 'chai';
// import * as actions from 'platform/forms-system/src/js/actions';
// import { submitToSimpleForms, createPayload } from '../../actions';

// describe('Actions', () => {
//   describe('submitToSimpleForms', () => {
//     it('calls uploadFile', () => {
//       const fileToUpload = {
//         name: 'test-file',
//       };
//       const uploadFileStub = sinon
//         .stub(actions, 'uploadFile')
//         .returns(() => {});
//       const submitRequest = submitToSimpleForms('21-0779', fileToUpload);

//       expect(uploadFileStub.calledWith(fileToUpload)).to.be.true;
//       uploadFileStub.restore();
//     });

//     describe('createPayload', () => {
//       it('creates a payload', () => {
//         const formId = '21-0779';
//         const file = 'test-file';

//         const payload = createPayload(file, formId);

//         expect(payload.get('form_id')).to.equal(formId);
//         expect(payload.get('file')).to.equal(file);
//       });
//     });
//   });
// });
