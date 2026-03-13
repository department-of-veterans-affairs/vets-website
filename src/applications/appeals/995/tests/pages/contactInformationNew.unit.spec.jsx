import { expect } from 'chai';
import contactInfoNew from '../../pages/contactInformationNew';

describe('contactInformationNew config', () => {
  const pages = contactInfoNew;
  const page = Object.values(pages).find(p => p.path === 'contact-information');

  it('requires address when no housing risk', () => {
    const { updateSchema } = page.uiSchema['ui:options'];
    const result = updateSchema(
      {},
      { properties: { veteran: { required: [] } } },
    );

    expect(result.properties.veteran.required).to.include('address');
  });

  it('does not require address when housing risk is set', () => {
    const { updateSchema } = page.uiSchema['ui:options'];
    const result = updateSchema(
      { housingRisk: true },
      { properties: { veteran: { required: [] } } },
    );

    expect(result.properties.veteran.required).to.not.include('address');
  });
});
