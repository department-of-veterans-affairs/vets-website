import { expect } from 'chai';
import thirdPartyOrganizationRepresentativesIntro from '../../pages/thirdPartyOrganizationRepresentativesIntro';

const { schema, uiSchema } = thirdPartyOrganizationRepresentativesIntro;

describe('10278 thirdPartyOrganizationRepresentativesIntro page', () => {
  it('exports uiSchema and schema objects', () => {
    expect(thirdPartyOrganizationRepresentativesIntro).to.be.an('object');
    expect(uiSchema).to.be.an('object');
    expect(schema).to.be.an('object');
  });

  it('exports a bare schema with no required fields', () => {
    expect(schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
  });

  it('exports a uiSchema with title + description from web-component patterns', () => {
    expect(uiSchema).to.be.an('object');

    expect(uiSchema).to.have.property('ui:title');
    expect(uiSchema['ui:title']).to.exist;

    expect(uiSchema).to.have.property('ui:description');
    expect(uiSchema['ui:description']).to.exist;

    const description = uiSchema['ui:description'];

    if (typeof description === 'string') {
      expect(description).to.equal(
        "Next, we'll ask you for the name of a representative at the organization you entered. The organization may have multiple representatives. You must provide at least 1 representative.",
      );
    } else {
      expect(description).to.be.ok;
    }
  });
});
