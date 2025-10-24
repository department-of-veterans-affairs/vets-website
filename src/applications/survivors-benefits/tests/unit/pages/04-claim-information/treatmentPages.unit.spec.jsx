import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { treatmentPages } from '../../../../config/chapters/04-claim-information/treatmentPages';

const arrayPath = 'vaMedicalCenters';

describe('Treatment Pages', () => {
  it('renders the treatment page intro', async () => {
    const { dicBenefitsIntro } = treatmentPages;

    const form = render(
      <DefinitionTester
        schema={dicBenefitsIntro.schema}
        uiSchema={dicBenefitsIntro.uiSchema}
        data={{}}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(dicBenefitsIntro.title);
  });
  it('renders the treatment page summary', async () => {
    const { dicBenefitsSummary } = treatmentPages;
    const form = render(
      <DefinitionTester
        schema={dicBenefitsSummary.schema}
        uiSchema={dicBenefitsSummary.uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);

    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Did the Veteran receive treatment at a VA medical center?',
    );
    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
  });
  it('renders the treatment page summary', async () => {
    const { dicNameLocationPage } = treatmentPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={dicNameLocationPage.schema}
        uiSchema={dicNameLocationPage.uiSchema}
        pagePerItemIndex={0}
        data={{ vaMedicalCenters: [formData] }}
      />,
    );
    expect(form.getByText(dicNameLocationPage.title)).to.exist;
  });
  it('renders the treatment page dates', async () => {
    const { dicTreatmentDates } = treatmentPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={dicTreatmentDates.schema}
        uiSchema={dicTreatmentDates.uiSchema}
        pagePerItemIndex={0}
        data={{ vaMedicalCenters: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByText(dicTreatmentDates.title)).to.exist;

    const vaStartDate = $('va-memorable-date[name*="root_startDate"]', formDOM);
    const vaEndDate = $('va-memorable-date[name*="root_endDate"]', formDOM);
    expect(vaStartDate.getAttribute('required')).to.equal('false');
    expect(vaEndDate.getAttribute('required')).to.equal('false');
  });
  it('renders the treatment page dates again', async () => {
    const { dicTreatmentDates } = treatmentPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={dicTreatmentDates.schema}
        uiSchema={dicTreatmentDates.uiSchema}
        pagePerItemIndex={0}
        data={{ firstTimeReporting: false, vaMedicalCenters: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByText(dicTreatmentDates.title)).to.exist;

    const vaStartDate = $('va-memorable-date[name*="root_startDate"]', formDOM);
    const vaEndDate = $('va-memorable-date[name*="root_endDate"]', formDOM);
    expect(vaStartDate.getAttribute('required')).to.equal('true');
    expect(vaEndDate.getAttribute('required')).to.equal('true');
  });
});
