import { expect } from 'chai';

import claimantIdentification from '../../pages/claimantIdentification';
import claimantContact from '../../pages/claimantContact';

describe('21P-601 claimant page configurations', () => {
  describe('claimantIdentification', () => {
    it('exports uiSchema and schema', () => {
      expect(claimantIdentification).to.have.property('uiSchema');
      expect(claimantIdentification).to.have.property('schema');
    });

    it('has claimantFullName field', () => {
      expect(claimantIdentification.uiSchema).to.have.property(
        'claimantFullName',
      );
      expect(claimantIdentification.schema.properties).to.have.property(
        'claimantFullName',
      );
    });

    it('has claimantIdentification field', () => {
      expect(claimantIdentification.uiSchema).to.have.property(
        'claimantIdentification',
      );
    });

    it('requires claimantFullName', () => {
      expect(claimantIdentification.schema.required).to.include(
        'claimantFullName',
      );
    });
  });

  describe('claimantContact', () => {
    it('exports uiSchema and schema', () => {
      expect(claimantContact).to.have.property('uiSchema');
      expect(claimantContact).to.have.property('schema');
    });

    it('has claimantAddress field', () => {
      expect(claimantContact.uiSchema).to.have.property('claimantAddress');
      expect(claimantContact.schema.properties).to.have.property(
        'claimantAddress',
      );
    });

    it('has claimantPhone field', () => {
      expect(claimantContact.uiSchema).to.have.property('claimantPhone');
      expect(claimantContact.schema.properties).to.have.property(
        'claimantPhone',
      );
    });

    it('has claimantEmail field', () => {
      expect(claimantContact.uiSchema).to.have.property('claimantEmail');
      expect(claimantContact.schema.properties).to.have.property(
        'claimantEmail',
      );
    });

    it('requires address', () => {
      expect(claimantContact.schema.required).to.include('claimantAddress');
    });
  });
});
