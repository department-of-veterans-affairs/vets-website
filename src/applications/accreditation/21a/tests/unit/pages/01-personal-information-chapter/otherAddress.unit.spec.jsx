import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import otherAddressPage from '../../../../pages/01-personal-information-chapter/otherAddress';

describe('Other address page', () => {
  it('renders the title, subtitle, and address fields', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="otherAddress"
        title={otherAddressPage.title}
        schema={otherAddressPage.schema}
        uiSchema={otherAddressPage.uiSchema}
        data={{
          otherAddress: {
            country: 'United States',
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            postalCode: '12345',
          },
        }}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(getByText('Other address')).to.exist;
    expect(
      getByText('We will send information about your form to this address.'),
    ).to.exist;

    const vaCheckbox = container.querySelector('va-checkbox');
    expect(vaCheckbox).to.exist;
    expect(vaCheckbox.getAttribute('label')).to.include('military base');
  });

  context('depends function', () => {
    it('should return true when primaryMailingAddress is "other"', () => {
      const formData = { primaryMailingAddress: 'other' };
      expect(otherAddressPage.depends(formData)).to.be.true;
    });

    it('should return false when primaryMailingAddress is "home"', () => {
      const formData = { primaryMailingAddress: 'home' };
      expect(otherAddressPage.depends(formData)).to.be.false;
    });

    it('should return false when primaryMailingAddress is "work"', () => {
      const formData = { primaryMailingAddress: 'work' };
      expect(otherAddressPage.depends(formData)).to.be.false;
    });

    it('should return false when primaryMailingAddress is null', () => {
      const formData = { primaryMailingAddress: null };
      expect(otherAddressPage.depends(formData)).to.be.false;
    });

    it('should return false when primaryMailingAddress is undefined', () => {
      const formData = { primaryMailingAddress: undefined };
      expect(otherAddressPage.depends(formData)).to.be.false;
    });

    it('should return false when primaryMailingAddress is empty string', () => {
      const formData = { primaryMailingAddress: '' };
      expect(otherAddressPage.depends(formData)).to.be.false;
    });

    it('should throw error when formData is null', () => {
      expect(() => otherAddressPage.depends(null)).to.throw();
    });

    it('should throw error when formData is undefined', () => {
      expect(() => otherAddressPage.depends(undefined)).to.throw();
    });

    it('should return false when formData is empty object', () => {
      const formData = {};
      expect(otherAddressPage.depends(formData)).to.be.false;
    });

    it('should return false when primaryMailingAddress is missing from formData', () => {
      const formData = { someOtherField: 'value' };
      expect(otherAddressPage.depends(formData)).to.be.false;
    });
  });

  context('page configuration', () => {
    it('should have the correct title', () => {
      expect(otherAddressPage.title).to.equal('Other address');
    });

    it('should have the correct path', () => {
      expect(otherAddressPage.path).to.equal('other-address');
    });

    it('should have a depends function', () => {
      expect(otherAddressPage.depends).to.be.a('function');
    });

    it('should have uiSchema with titleUI', () => {
      expect(otherAddressPage.uiSchema).to.have.property('ui:title');
      expect(otherAddressPage.uiSchema['ui:title']).to.be.an('object');
    });

    it('should have uiSchema with otherAddress field', () => {
      expect(otherAddressPage.uiSchema).to.have.property('otherAddress');
    });

    it('should have schema with otherAddress property', () => {
      expect(otherAddressPage.schema).to.have.property('properties');
      expect(otherAddressPage.schema.properties).to.have.property(
        'otherAddress',
      );
    });
  });
});
