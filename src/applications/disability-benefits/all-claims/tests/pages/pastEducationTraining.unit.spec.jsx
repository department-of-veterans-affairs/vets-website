import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';
import { pageSubmitTest } from '../unit.helpers.spec';

describe('Past Education Training', () => {
  const formConfig8940 = require('../../config/8940').default();
  const page = formConfig8940.pastEducationTraining;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(container.querySelectorAll('input')).to.have.length(2);
    expect(container.querySelectorAll('select')).to.have.length(1);
  });

  it('should submit with valid education data', () => {
    const formData = {
      unemployability: {
        education: 'Other',
        otherEducation: 'Vocational Training',
        receivedOtherEducationTrainingPreUnemployability: true,
        otherEducationTrainingPreUnemployability: [
          {
            name: 'Vocational Training Program',
            dates: {
              from: '2010-01-01',
              to: '2010-12-01',
            },
          },
        ],
      },
    };

    pageSubmitTest({ schema, uiSchema }, formData, true);
  });

  it('should submit with no education data', () => {
    const formData = {
      unemployability: {
        receivedOtherEducationTrainingPreUnemployability: false,
      },
    };

    pageSubmitTest({ schema, uiSchema }, formData, true);
  });

  describe('otherEducationTrainingPreUnemployability.dates field validation', () => {
    it('should accept valid date range', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2010-01-01',
                to: '2010-12-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });

    it('should reject invalid date range (to before from)', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2010-12-01',
                to: '2010-01-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject equal from/to dates', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2010-01-01',
                to: '2010-01-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should accept only from date filled', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2010-01-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });

    it('should accept only to date filled', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                to: '2010-12-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });

    it('should reject date before 1900', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '1899-12-31',
                to: '2010-12-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject date greater than maxYear', () => {
      // Use the same maxYear calculation as the system and exceed it by 1 year
      const { maxYear } = require('platform/forms-system/src/js/helpers');
      const futureYear = maxYear + 1;

      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2010-01-01',
                to: `${futureYear}-01-01`, // Dynamic date to exceed current maxYear
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject invalid date format', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: 'invalid-date',
                to: '2010-12-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject non-leap year February 29', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2021-02-29',
                to: '2021-12-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should accept leap year February 29', () => {
      const formData = {
        unemployability: {
          receivedOtherEducationTrainingPreUnemployability: true,
          otherEducationTrainingPreUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2020-02-29',
                to: '2020-12-01',
              },
            },
          ],
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });
  });
});
