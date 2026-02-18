import { expect } from 'chai';

import hasAlreadyFiled from '../../pages/hasAlreadyFiled';
import hasUnpaidCreditors from '../../pages/hasUnpaidCreditors';
import eligibilitySummary from '../../pages/eligibilitySummary';

describe('21P-601 eligibility page configurations', () => {
  describe('hasAlreadyFiled', () => {
    it('exports uiSchema and schema', () => {
      expect(hasAlreadyFiled).to.have.property('uiSchema');
      expect(hasAlreadyFiled).to.have.property('schema');
    });

    it('has hasAlreadyFiled field', () => {
      expect(hasAlreadyFiled.uiSchema).to.have.property('hasAlreadyFiled');
      expect(hasAlreadyFiled.schema.properties).to.have.property(
        'hasAlreadyFiled',
      );
    });

    it('requires hasAlreadyFiled', () => {
      expect(hasAlreadyFiled.schema.required).to.include('hasAlreadyFiled');
    });
  });

  describe('hasUnpaidCreditors', () => {
    it('exports uiSchema and schema', () => {
      expect(hasUnpaidCreditors).to.have.property('uiSchema');
      expect(hasUnpaidCreditors).to.have.property('schema');
    });

    it('has hasUnpaidCreditors field', () => {
      expect(hasUnpaidCreditors.schema.properties).to.have.property(
        'hasUnpaidCreditors',
      );
    });

    it('requires hasUnpaidCreditors', () => {
      expect(hasUnpaidCreditors.schema.required).to.include(
        'hasUnpaidCreditors',
      );
    });
  });

  describe('eligibilitySummary', () => {
    it('exports uiSchema and schema', () => {
      expect(eligibilitySummary).to.have.property('uiSchema');
      expect(eligibilitySummary).to.have.property('schema');
    });

    it('has custom field', () => {
      expect(eligibilitySummary.uiSchema['ui:field']).to.be.a('function');
    });

    it('renders for already filed case', () => {
      const Component = eligibilitySummary.uiSchema['ui:field'];
      const result = Component({
        formData: { hasAlreadyFiled: true, hasUnpaidCreditors: false },
      });
      expect(result).to.exist;
    });

    it('renders for unpaid creditors case', () => {
      const Component = eligibilitySummary.uiSchema['ui:field'];
      const result = Component({
        formData: { hasAlreadyFiled: false, hasUnpaidCreditors: true },
      });
      expect(result).to.exist;
    });

    it('renders error for eligible case', () => {
      const Component = eligibilitySummary.uiSchema['ui:field'];
      const result = Component({
        formData: { hasAlreadyFiled: false, hasUnpaidCreditors: false },
      });
      expect(result).to.exist;
    });
  });
});
