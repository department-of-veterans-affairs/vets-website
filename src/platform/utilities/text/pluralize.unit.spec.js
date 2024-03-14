import { expect } from 'chai';
import pluralize from './pluralize';

describe('pluralize', () => {
  it('should pluralize a word', () => {
    const tests = {
      'health insurance': 'health insurances',
      adoption: 'adoptions',
      analysis: 'analyses',
      application: 'applications',
      box: 'boxes',
      child: 'children',
      city: 'cities',
      dependent: 'dependents',
      disability: 'disabilities',
      disagreement: 'disagreements',
      document: 'documents',
      employer: 'employers',
      history: 'histories',
      household: 'households',
      income: 'incomes',
      information: 'information',
      item: 'items',
      money: 'money',
      option: 'options',
      parent: 'parents',
      person: 'people',
      relationship: 'relationships',
      service: 'services',
      status: 'statuses',
      summary: 'summaries',
    };

    Object.entries(tests).forEach(([singular, plural]) => {
      expect(pluralize(singular)).to.equal(plural);
    });

    expect(pluralize(null)).to.equal(null);
  });
});
