import { expect } from 'chai';

import { normalizeFormsForTable } from '../../helpers';

describe('Find VA Forms helpers', () => {
  describe('normalizeFormsForTable', () => {
    it('maps raw response data into table data', () => {
      const form = {
        id: 1,
        attributes: {
          url: 'www.va.gov/form-a.pdf',
          title: 'Form A',
          description: 'This is Form A',
          availableOnline: true,
          applyOnlineURL: 'www.va.gov/form-a/apply',
        },
      };

      const response = [form];

      const result = normalizeFormsForTable(response);

      expect(result).to.be.instanceOf(Array);
      expect(result).to.be.not.be.empty;
      expect(result[0]).to.have.keys([
        'applyOnlineURL',
        'availableOnline',
        'description',
        'id',
        'idLabel',
        'lastRevisionOn',
        'lastRevisionOnLabel',
        'title',
        'titleLabel',
        'type',
        'url',
      ]);
    });
  });
});
