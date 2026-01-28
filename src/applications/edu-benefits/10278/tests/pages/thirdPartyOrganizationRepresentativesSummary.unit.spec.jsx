import { expect } from 'chai';
import thirdPartyOrganizationRepresentativesSummary from '../../pages/thirdPartyOrganizationRepresentativesSummary ';

const { schema, uiSchema } = thirdPartyOrganizationRepresentativesSummary;

describe('10278 thirdPartyOrganizationRepresentativesSummary page', () => {
  it('should export uiSchema with view:hasRepresentatives', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.property('view:hasRepresentatives');
  });

  it('should export the correct schema shape', () => {
    expect(schema).to.deep.equal({
      type: 'object',
      properties: {
        'view:hasRepresentatives': {
          type: 'boolean',
        },
      },
      required: ['view:hasRepresentatives'],
    });
  });

  it('should require view:hasRepresentatives', () => {
    expect(schema.required).to.deep.equal(['view:hasRepresentatives']);
  });
});
