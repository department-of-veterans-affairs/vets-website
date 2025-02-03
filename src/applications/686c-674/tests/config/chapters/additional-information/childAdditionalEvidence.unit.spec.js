// import React from 'react';
// import omit from 'lodash/omit';
// import { render } from '@testing-library/react';
// import { expect } from 'chai';
// import {
//   childAdditionalEvidence,
//   shouldRenderIsEncrypted,
//   renderBytes,
// } from '../../../../config/chapters/additional-information/childAdditionalEvidence';
// import { ChildAdditionalEvidence } from '../../../../components/ChildAdditionalEvidence';

// describe.only('childAdditionalEvidence', () => {
//   it('should have correct schema structure', () => {
//     const { schema } = childAdditionalEvidence;
//     expect(schema).to.be.an('object');
//     expect(schema.properties).to.have.property('childAdditionalEvidence');
//     expect(
//       schema.properties.childAdditionalEvidence.properties,
//     ).to.have.property('childSupportingDocuments');
//   });

//   it('should have correct UI schema structure', () => {
//     const { uiSchema } = childAdditionalEvidence;
//     expect(uiSchema).to.be.an('object');
//     expect(uiSchema.childAdditionalEvidence).to.have.property(
//       'childSupportingDocuments',
//     );
//   });

//   it('should render bytes correctly', () => {
//     expect(renderBytes(1024)).to.equal('1.00 KB');
//     expect(renderBytes(1048576)).to.equal('1.00 MB');
//     expect(renderBytes(1073741824)).to.equal('1.00 GB');
//   });

//   it('should correctly render encryption status', () => {
//     expect(shouldRenderIsEncrypted('isEncrypted', true)).to.equal('Yes');
//     expect(shouldRenderIsEncrypted('isEncrypted', false)).to.equal('No');
//     expect(shouldRenderIsEncrypted('size', 2048)).to.equal('2.00 KB');
//   });

//   // it('should render ChildAdditionalEvidence description', () => {
//   //   const { getByText } = render(<ChildAdditionalEvidence />);
//   //   expect(getByText(/Upload your supporting evidence/i)).to.exist;
//   // });

//   it('should configure file input correctly', () => {
//     const fileInput =
//       childAdditionalEvidence.uiSchema.childAdditionalEvidence
//         .childSupportingDocuments;
//     expect(fileInput).to.have.property('fileUploadUrl');
//     expect(fileInput.fileUploadUrl).to.include('/v0/claim_attachments');
//   });
// });
