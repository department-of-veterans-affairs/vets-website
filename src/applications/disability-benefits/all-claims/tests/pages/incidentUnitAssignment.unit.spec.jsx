import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';
import { pageSubmitTest } from '../unit.helpers.spec';

describe('781 Unit Assignment Details', () => {
  const page = formConfig.chapters.disabilities.pages.incidentUnitAssignment0;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(container.querySelectorAll('input')).to.have.length(3);
    expect(container.querySelectorAll('select')).to.have.length(4);
  });

  it('should submit with valid unit assignment details', () => {
    const formData = {
      incident0: {
        unitAssigned: '21st Airborne',
        unitAssignedDates: {
          from: '2016-07-10',
          to: '2017-06-12',
        },
      },
    };

    pageSubmitTest({ schema, uiSchema }, formData, true);
  });

  it('should submit with no assigned unit details', () => {
    const formData = {};

    pageSubmitTest({ schema, uiSchema }, formData, true);
  });

  describe('unitAssignedDates field validation', () => {
    it('should accept valid date range', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '2016-07-10',
            to: '2017-06-12',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });

    it('should reject invalid date range (to before from)', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '2017-06-12',
            to: '2016-07-10',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject equal from/to dates', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '2016-07-10',
            to: '2016-07-10',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should accept only from date filled', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '2016-07-10',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });

    it('should accept only to date filled', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            to: '2017-06-12',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });

    it('should reject date before 1900', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '1899-12-31',
            to: '2017-06-12',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject date greater than maxYear', () => {
      // Use the same maxYear calculation as the system and exceed it by 1 year
      const { maxYear } = require('platform/forms-system/src/js/helpers');
      const futureYear = maxYear + 1;

      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '2016-07-10',
            to: `${futureYear}-01-01`, // Dynamic date to exceed current maxYear
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject invalid date format', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: 'invalid-date',
            to: '2017-06-12',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should reject non-leap year February 29', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '2021-02-29',
            to: '2021-12-01',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, false);
    });

    it('should accept leap year February 29', () => {
      const formData = {
        incident0: {
          unitAssignedDates: {
            from: '2020-02-29',
            to: '2020-12-01',
          },
        },
      };

      pageSubmitTest({ schema, uiSchema }, formData, true);
    });
  });
});
