import { expect } from 'chai';
import formConfig from '../../../config/form';
import mockData from '../../e2e/fixtures/data/test-data.json';

import transformForSubmit from '../../../config/submitTransformer';

describe('Submit transformer', () => {
  it('should add the file type to submitted files', () => {
    const result = JSON.parse(transformForSubmit(formConfig, mockData));
    const attachmentIds = result.supportingDocs.map(o => o.attachmentId);
    expect(attachmentIds.length).to.eq(3); // 'EOB', 'EOB', and 'MEDDOCS'
    expect(attachmentIds.includes('MEDDOCS')).to.be.true;
    expect(attachmentIds.includes('EOB')).to.be.true;
  });

  it('should set primaryContact name to false if none present', () => {
    const result = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicantAddress: { street: '' },
          certifierAddress: { street: '' },
        },
      }),
    );
    expect(result.primaryContactInfo.name).to.be.false;
  });

  it('should set primaryContact name to sponsor if certifierRole is `sponsor`', () => {
    const result = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRole: 'sponsor',
          sponsorName: { first: 'Jim' },
          applicantAddress: { street: '' },
          certifierAddress: { street: '' },
        },
      }),
    );
    expect(result.primaryContactInfo.name.first).to.equal('Jim');
  });
});
