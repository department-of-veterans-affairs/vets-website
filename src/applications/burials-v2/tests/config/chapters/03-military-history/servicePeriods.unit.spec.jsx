import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
import { dateRangeUI } from '../../../../config/chapters/03-military-history/servicePeriods';

const defaultStore = createCommonStore();

describe('Service Periods', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryHistory.pages.servicePeriods;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect($$('va-memorable-date', formDOM).length).to.equal(2);
    expect($$('va-text-input', formDOM).length).to.equal(5);
  });

  it('should render service periods', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            toursOfDuty: [
              {
                serviceBranch: 'Air Force',
                dateRange: {
                  from: '2005-07-19',
                  to: '2009-04-02',
                },
                placeOfEntry: 'Los Angeles, CA',
                placeOfSeparation: 'Dallas, TX',
                rank: 'Sergeant',
                unit: 'Unit test AF',
              },
              {
                serviceBranch: 'Coast Guard',
                dateRange: {
                  from: '2011-03-05',
                  to: '2016-04-15',
                },
                placeOfEntry: 'Dallas, TX',
                placeOfSeparation: 'San Francisco, CA',
                rank: 'Chief',
                unit: 'Unit test CG',
              },
            ],
          }}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect($$('va-memorable-date', formDOM).length).to.equal(2);
    expect($$('va-text-input', formDOM).length).to.equal(5);
  });

  it('should render dateRangeUI', () => {
    const result = dateRangeUI('Service start date', 'Service end date');
    expect(result.from['ui:title']).to.equal('Service start date');
    expect(result.to['ui:title']).to.equal('Service end date');
  });

  it('should render default dateRangeUI', () => {
    const result = dateRangeUI();
    expect(result.from['ui:title']).to.equal('From');
    expect(result.to['ui:title']).to.equal('To');
  });
});
