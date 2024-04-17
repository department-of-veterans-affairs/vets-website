import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$, $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Location Of Death', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.locationOfDeath;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(6);
  });

  it('should render text inputs for Unpaid Nursing Home', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'nursingHomeUnpaid' },
            facilityName: 'Welcome Wings Nursing Home',
          }}
        />
      </Provider>,
    );

    expect($$('va-radio-option[checked="true"]', container).length).to.eql(1);
    expect($('va-radio-option[value="nursingHomeUnpaid"]', container)).to.exist;
    expect(
      $(
        'va-text-input[name="root_locationOfDeath_nursingHomeUnpaid_facilityName"]',
        container,
      ),
    ).to.exist;
  });

  it('should render text inputs for Paid Nursing Home', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'nursingHomePaid' },
            facilityName: 'Welcome Wings Nursing Home',
          }}
        />
      </Provider>,
    );

    expect($$('va-radio-option[checked="true"]', container).length).to.eql(1);
    expect($('va-radio-option[value="nursingHomePaid"]', container)).to.exist;
    expect(
      $(
        'va-text-input[name="root_locationOfDeath_nursingHomePaid_facilityName"]',
        container,
      ),
    ).to.exist;
  });

  it('should render text inputs for VA Medical Center', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'vaMedicalCenter' },
            facilityName: 'DC VAMC Hospital',
          }}
        />
      </Provider>,
    );

    expect($$('va-radio-option[checked="true"]', container).length).to.eql(1);
    expect($('va-radio-option[value="vaMedicalCenter"]', container)).to.exist;
    expect(
      $(
        'va-text-input[name="root_locationOfDeath_vaMedicalCenter_facilityName"]',
        container,
      ),
    ).to.exist;
  });

  it('should render text inputs for VA Medical Center', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            locationOfDeath: { location: 'stateVeteransHome' },
            facilityName: 'Maryland Veterans Home',
          }}
        />
      </Provider>,
    );

    expect($$('va-radio-option[checked="true"]', container).length).to.eql(1);
    expect($('va-radio-option[value="stateVeteransHome"]', container)).to.exist;
    expect(
      $(
        'va-text-input[name="root_locationOfDeath_stateVeteransHome_facilityName"]',
        container,
      ),
    ).to.exist;
  });
});
