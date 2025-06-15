import { expect } from 'chai';

import profileContactInfo from '../../pages/contactInformation';

describe('profileContactInfo updateSchema', () => {
  const schema = (required = []) => ({
    properties: { veteran: { required } },
  });

  const { uiSchema } = profileContactInfo.confirmContactInfo;
  const { updateSchema } = uiSchema['ui:options'];
  const required = uiSchema['ui:required'];

  it('should be required', () => {
    expect(required()).to.be.true;
  });
  it('should use set (increase coverage)', () => {
    // check undefined formData resulting in homeless value being false and all
    // fields are required
    expect(updateSchema(undefined, schema())).to.deep.equal({
      properties: {
        veteran: {
          required: ['address', 'email', 'phone'],
        },
      },
    });
  });
  it('should set veteran to not require address field based on being homeless', () => {
    const formData = { homeless: true };
    updateSchema(formData, schema());
    expect(updateSchema(formData, schema())).to.deep.equal({
      properties: {
        veteran: {
          required: ['email', 'phone'],
        },
      },
    });
  });
});
