import { expect } from 'chai';
import contactInfo from '../../pages/contactInformation';

describe('contactInformation config', () => {
  const pages = contactInfo;
  const page = Object.values(pages).find(
    p => p.path === 'contact-information-v0',
  );

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
