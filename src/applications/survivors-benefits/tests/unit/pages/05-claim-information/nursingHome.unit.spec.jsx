import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

describe('Nursing Home Page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    title,
  } = formConfig.chapters.claimInformation.pages.nursingHome;
  it('renders the nursing home options', async () => {
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    const formDOM = getFormDOM(form);
    const vaRadios = $$('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);
    const vaAlerts = $$('va-alert-expandable', formDOM);

    expect(form.getByRole('heading')).to.have.text(title);

    expect(vaRadios.length).to.equal(2);
    expect(vaRadios[0].getAttribute('label')).to.equal(
      'Are you claiming special monthly pension or special monthly DIC because you need the regular assistance of another person, have severe visual problems, or are generally confined to your immediate premises?',
    );
    expect(vaRadios[0].getAttribute('required')).to.equal('true');

    expect(vaRadios[1].getAttribute('label')).to.equal(
      'Are you in a nursing home?',
    );
    expect(vaRadios[1].getAttribute('required')).to.equal('true');
    expect(vaRadioOptions.length).to.equal(4);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
    expect(vaRadioOptions[2].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[3].getAttribute('label')).to.equal('No');

    const assistanceRadio = $(
      'va-radio[name="root_claimingMonthlySpecialPension"]',
      formDOM,
    );
    const nursingHomeRadio = $(
      'va-radio[name="root_claimantLivesInANursingHome"]',
      formDOM,
    );

    expect(vaAlerts.length).to.equal(0);
    assistanceRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(1);
    nursingHomeRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(1);
    assistanceRadio.__events.vaValueChange({
      detail: { value: 'N' },
    });
    nursingHomeRadio.__events.vaValueChange({
      detail: { value: 'N' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(0);
  });
});
