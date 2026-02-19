import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  treatmentPages,
  options,
} from '../../../../config/chapters/05-claim-information/treatmentPages';

const arrayPath = 'treatments';

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
        data={{ treatments: [formData] }}
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
        data={{ treatments: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByText(dicTreatmentDates.title)).to.exist;

    const vaStartDate = $('va-memorable-date[name*="root_startDate"]', formDOM);
    const vaEndDate = $('va-memorable-date[name*="root_endDate"]', formDOM);
    expect(vaStartDate.getAttribute('required')).to.equal('true');
    expect(vaEndDate.getAttribute('required')).to.equal('true');
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
        data={{ treatments: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByText(dicTreatmentDates.title)).to.exist;

    const vaStartDate = $('va-memorable-date[name*="root_startDate"]', formDOM);
    const vaEndDate = $('va-memorable-date[name*="root_endDate"]', formDOM);
    expect(vaStartDate.getAttribute('required')).to.equal('true');
    expect(vaEndDate.getAttribute('required')).to.equal('true');
  });
  it('should return the correct card description with itemName and cardDescription', () => {
    const item = {
      vaMedicalCenterName: 'Hospital ABC',
      startDate: '2004-04-04',
      endDate: '2005-05-05',
    };
    const { getByText: nameText } = render(options.text.getItemName(item));
    const { getByText: descriptionText } = render(
      options.text.cardDescription(item),
    );
    expect(nameText('Hospital ABC')).to.exist;
    expect(descriptionText('04/04/2004 - 05/05/2005')).to.exist;
  });
  it('should return the default card description with itemName and cardDescription', () => {
    const item = {};
    const { getByText: nameText } = render(options.text.getItemName(item));
    const { getByText: descriptionText } = render(
      options.text.cardDescription(item),
    );
    expect(nameText('VA medical center')).to.exist;
    expect(descriptionText('Treatment dates not provided')).to.exist;
  });
  it('should return correct depends function', () => {
    const {
      dicBenefitsIntro,
      dicBenefitsSummary,
      dicNameLocationPage,
      dicTreatmentDates,
    } = treatmentPages;

    // Test data with dic set to true
    const formDataTrue = {
      claims: {
        dic: true,
      },
    };

    // Test data with dic set to false
    const formDataFalse = {
      claims: {
        dic: false,
      },
    };

    expect(dicBenefitsIntro.depends(formDataTrue)).to.be.true;
    expect(dicBenefitsIntro.depends(formDataFalse)).to.be.false;
    expect(dicBenefitsSummary.depends(formDataTrue)).to.be.true;
    expect(dicBenefitsSummary.depends(formDataFalse)).to.be.false;
    expect(dicNameLocationPage.depends(formDataTrue)).to.be.true;
    expect(dicNameLocationPage.depends(formDataFalse)).to.be.false;
    expect(dicTreatmentDates.depends(formDataTrue)).to.be.true;
    expect(dicTreatmentDates.depends(formDataFalse)).to.be.false;
  });
});
