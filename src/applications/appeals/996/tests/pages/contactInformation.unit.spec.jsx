import { expect } from 'chai';

import contactInfo from '../../pages/contactInformation';

describe('contactInformation config', () => {
  const page = contactInfo.confirmContactInfo;
  const { updateSchema } = page.uiSchema['ui:options'];
  const schema = { properties: { veteran: { required: [] } } };

  it('requires all contacts when no housing risk', () => {
    const result = updateSchema({}, schema);

    expect(result.properties.veteran.required).to.deep.equal([
      'address',
      'email',
      'phone',
    ]);
  });

  it('does not require address when housing risk is set', () => {
    const result = updateSchema({ homeless: true }, schema);

    expect(result.properties.veteran.required).to.deep.equal([
      'email',
      'phone',
    ]);
  });
});
