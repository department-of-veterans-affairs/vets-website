import { expect } from 'chai';

import veteranFullName from '../../pages/veteranFullName';
import veteranIdentifiers from '../../pages/veteranIdentifiers';
import beneficiaryIsVeteran from '../../pages/beneficiaryIsVeteran';
import beneficiaryFullName from '../../pages/beneficiaryFullName';
import beneficiaryDateOfDeath from '../../pages/beneficiaryDateOfDeath';

describe('21P-601 veteran and beneficiary page configurations', () => {
  describe('veteranFullName', () => {
    it('exports uiSchema and schema', () => {
      expect(veteranFullName).to.have.property('uiSchema');
      expect(veteranFullName).to.have.property('schema');
    });

    it('has veteranFullName field', () => {
      expect(veteranFullName.uiSchema).to.have.property('veteranFullName');
      expect(veteranFullName.schema.properties).to.have.property(
        'veteranFullName',
      );
    });

    it('requires veteranFullName', () => {
      expect(veteranFullName.schema.required).to.include('veteranFullName');
    });
  });

  describe('veteranIdentifiers', () => {
    it('exports uiSchema and schema', () => {
      expect(veteranIdentifiers).to.have.property('uiSchema');
      expect(veteranIdentifiers).to.have.property('schema');
    });

    it('has veteranIdentification field', () => {
      expect(veteranIdentifiers.uiSchema).to.have.property(
        'veteranIdentification',
      );
      expect(veteranIdentifiers.schema.properties).to.have.property(
        'veteranIdentification',
      );
    });

    it('requires veteranIdentification', () => {
      expect(veteranIdentifiers.schema.required).to.include(
        'veteranIdentification',
      );
    });
  });

  describe('beneficiaryIsVeteran', () => {
    it('exports uiSchema and schema', () => {
      expect(beneficiaryIsVeteran).to.have.property('uiSchema');
      expect(beneficiaryIsVeteran).to.have.property('schema');
    });

    it('has beneficiaryIsVeteran field', () => {
      expect(beneficiaryIsVeteran.schema.properties).to.have.property(
        'beneficiaryIsVeteran',
      );
    });

    it('requires beneficiaryIsVeteran', () => {
      expect(beneficiaryIsVeteran.schema.required).to.include(
        'beneficiaryIsVeteran',
      );
    });
  });

  describe('beneficiaryFullName', () => {
    it('exports uiSchema and schema', () => {
      expect(beneficiaryFullName).to.have.property('uiSchema');
      expect(beneficiaryFullName).to.have.property('schema');
    });

    it('has beneficiaryFullName field', () => {
      expect(beneficiaryFullName.uiSchema).to.have.property(
        'beneficiaryFullName',
      );
      expect(beneficiaryFullName.schema.properties).to.have.property(
        'beneficiaryFullName',
      );
    });

    it('requires beneficiaryFullName', () => {
      expect(beneficiaryFullName.schema.required).to.include(
        'beneficiaryFullName',
      );
    });
  });

  describe('beneficiaryDateOfDeath', () => {
    it('exports uiSchema and schema', () => {
      expect(beneficiaryDateOfDeath).to.have.property('uiSchema');
      expect(beneficiaryDateOfDeath).to.have.property('schema');
    });

    it('has beneficiaryDateOfDeath field', () => {
      expect(beneficiaryDateOfDeath.uiSchema).to.have.property(
        'beneficiaryDateOfDeath',
      );
      expect(beneficiaryDateOfDeath.schema.properties).to.have.property(
        'beneficiaryDateOfDeath',
      );
    });

    it('requires beneficiaryDateOfDeath', () => {
      expect(beneficiaryDateOfDeath.schema.required).to.include(
        'beneficiaryDateOfDeath',
      );
    });
  });
});
