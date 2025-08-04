import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';
import { pageSubmitTest } from '../unit.helpers.spec';

describe('Recent Education Training', () => {
  const formConfig8940 = require('../../config/8940').default();
  const page = formConfig8940.recentEducationTraining;
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
  });

  it('should submit with valid education data', () => {
    const formData = {
      unemployability: {
        receivedOtherEducationTrainingPostUnemployability: true,
        otherEducationTrainingPostUnemployability: [
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
        receivedOtherEducationTrainingPostUnemployability: false,
      },
    };

    pageSubmitTest({ schema, uiSchema }, formData, true);
  });

  describe('otherEducationTrainingPostUnemployability.dates field validation', () => {
    it('should accept valid date range', () => {
      const formData = {
        unemployability: {
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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

    it('should reject date after 2069', () => {
      const formData = {
        unemployability: {
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
            {
              name: 'Vocational Training Program',
              dates: {
                from: '2010-01-01',
                to: '2070-01-01',
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
          education: 'High School',
          receivedOtherEducationTrainingPostUnemployability: true,
          otherEducationTrainingPostUnemployability: [
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
