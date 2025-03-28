import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('location of death details', () => {
  it('should render text inputs for Unpaid Nursing Home', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.nursingHomeUnpaid;
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'nursingHomeUnpaid' },
          }}
        />
      </Provider>,
    );
    expect(
      $('va-text-input[name="root_nursingHomeUnpaid_facilityName"]', container),
    ).to.exist;
    expect(
      $(
        'va-text-input[name="root_nursingHomeUnpaid_facilityLocation"]',
        container,
      ),
    ).to.exist;
  });

  it('should render text inputs for Paid Nursing Home', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.nursingHomePaid;
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'nursingHomePaid' },
          }}
        />
      </Provider>,
    );

    expect(
      $('va-text-input[name="root_nursingHomePaid_facilityName"]', container),
    ).to.exist;
    expect(
      $(
        'va-text-input[name="root_nursingHomePaid_facilityLocation"]',
        container,
      ),
    ).to.exist;
  });

  it('should render text inputs for VA Medical Center', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.vaMedicalCenter;
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'vaMedicalCenter' },
          }}
        />
      </Provider>,
    );

    expect(
      $('va-text-input[name="root_vaMedicalCenter_facilityName"]', container),
    ).to.exist;
    expect(
      $(
        'va-text-input[name="root_vaMedicalCenter_facilityLocation"]',
        container,
      ),
    ).to.exist;
  });

  it('should render text inputs for State Veterans Home', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranInformation.pages.stateVeteransHome;
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'stateVeteransHome' },
          }}
        />
      </Provider>,
    );

    expect(
      $('va-text-input[name="root_stateVeteransHome_facilityName"]', container),
    ).to.exist;
    expect(
      $(
        'va-text-input[name="root_stateVeteransHome_facilityLocation"]',
        container,
      ),
    ).to.exist;
  });
});
