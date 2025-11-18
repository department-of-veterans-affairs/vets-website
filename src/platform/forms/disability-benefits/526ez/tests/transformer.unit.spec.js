import { expect } from 'chai';
import {
  buildRepresentativeForm526,
  transformRepresentativeForm,
} from 'platform/forms/disability-benefits/526ez/transformer';

describe('platform/forms/disability-benefits/526ez/transformer', () => {
  const baseFormData = {
    veteranInformationSection: {
      veteranFullName: {
        first: ' Jane ',
        middle: ' Q ',
        last: ' Doe ',
      },
      veteranSocialSecurityNumber: ' 123-45-6789 ',
      veteranDateOfBirth: ' 1980-01-01 ',
    },
    contactInformationSection: {
      phoneAndEmail: {
        primaryPhone: '(800) 555-1212',
        emailAddress: '  test@example.com ',
      },
      mailingAddress: {
        country: 'USA',
        addressLine1: ' 123 Main St ',
        city: '  Portland ',
        state: ' OR ',
        zipCode: ' 97204 ',
      },
    },
    disabilitiesSection: {
      newDisabilities: [
        {
          condition: ' Tinnitus ',
        },
      ],
    },
  };

  it('builds a minimal payload with sanitized contact data', () => {
    const payload = buildRepresentativeForm526(baseFormData);

    expect(payload).to.deep.equal({
      veteran: {
        ssn: '123456789',
        dateOfBirth: '1980-01-01',
        postalCode: '97204',
        fullName: {
          first: 'Jane',
          middle: 'Q',
          last: 'Doe',
        },
      },
      form526: {
        form526: {
          isVaEmployee: false,
          standardClaim: false,
          phoneAndEmail: {
            primaryPhone: '8005551212',
            emailAddress: 'test@example.com',
          },
          mailingAddress: {
            country: 'USA',
            addressLine1: '123 Main St',
            city: 'Portland',
            state: 'OR',
            zipCode: '97204',
          },
          disabilities: [
            {
              name: 'Tinnitus',
              disabilityActionType: 'NEW',
            },
          ],
        },
      },
    });
  });

  it('stringifies the payload for submission', () => {
    const json = transformRepresentativeForm(baseFormData);
    expect(() => JSON.parse(json)).not.to.throw();
    expect(JSON.parse(json)).to.deep.equal(
      buildRepresentativeForm526(baseFormData),
    );
  });

  it('omits empty optional fields and normalizes causes', () => {
    const payload = buildRepresentativeForm526({
      contactInformationSection: {
        phoneAndEmail: {
          primaryPhone: '',
          emailAddress: '   ',
        },
        mailingAddress: {
          country: ' ',
          addressLine1: ' ',
        },
      },
      disabilitiesSection: {
        newDisabilities: [
          {
            condition: 'Knee pain',
            cause: 'secondary',
            primaryDescription: '  Includes occasional swelling ',
          },
          {
            condition: '  ',
          },
        ],
      },
    });

    expect(payload.form526.form526).to.deep.equal({
      isVaEmployee: false,
      standardClaim: false,
      disabilities: [
        {
          name: 'Knee pain',
          disabilityActionType: 'SECONDARY',
          primaryDescription: 'Includes occasional swelling',
        },
      ],
    });
    expect(payload).to.not.have.property('veteran');
  });
});
