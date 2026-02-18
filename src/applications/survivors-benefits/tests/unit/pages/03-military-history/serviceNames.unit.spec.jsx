import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  otherServiceNamesPages,
  options,
} from '../../../../config/chapters/03-military-history/serviceNames';

const arrayPath = 'veteranPreviousNames';

describe('Survivors Benefits Service Names Pages', () => {
  it('renders the service names intro', async () => {
    const { otherServiceNamesIntro } = otherServiceNamesPages;

    const form = render(
      <DefinitionTester
        schema={otherServiceNamesIntro.schema}
        uiSchema={otherServiceNamesIntro.uiSchema}
        data={{}}
      />,
    );
    expect(form.getByRole('heading')).to.have.text('Service names');
  });

  it('renders the service names summary', async () => {
    const { otherServiceNamesSummary } = otherServiceNamesPages;

    const form = render(
      <DefinitionTester
        schema={otherServiceNamesSummary.schema}
        uiSchema={otherServiceNamesSummary.uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);

    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Did the Veteran serve under any other names?',
    );
    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
  });

  it('renders the service names item page', async () => {
    const { otherServiceNamePage } = otherServiceNamesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={otherServiceNamePage.schema}
        uiSchema={otherServiceNamePage.uiSchema}
        pagePerItemIndex={0}
        data={{ [arrayPath]: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text('Other service name');
    const vaTextInput = $$('va-text-input', formDOM);
    const vaSelects = $$('va-select', formDOM);
    expect(vaTextInput.length).to.equal(3);
    expect(vaSelects.length).to.equal(1);
    const vaFirstNameInput = $(
      'va-text-input[label="First or given name"]',
      formDOM,
    );
    const vaMiddleNameInput = $('va-text-input[label="Middle name"]', formDOM);
    const vaLastNameInput = $(
      'va-text-input[label="Last or family name"]',
      formDOM,
    );
    const vaSuffixSelect = $('va-select[label="Suffix"]', formDOM);
    expect(vaFirstNameInput.getAttribute('required')).to.equal('true');
    expect(vaMiddleNameInput.getAttribute('required')).to.equal('false');
    expect(vaLastNameInput.getAttribute('required')).to.equal('true');
    expect(vaSuffixSelect.getAttribute('required')).to.equal('false');
  });
  it('should return correct depends function', () => {
    const {
      otherServiceNamesIntro,
      otherServiceNamesSummary,
      otherServiceNamePage,
    } = otherServiceNamesPages;

    const formDataTrue = { receivedBenefits: true };
    const formDataFalse = { receivedBenefits: false };

    expect(otherServiceNamesIntro.depends(formDataTrue)).to.be.false;
    expect(otherServiceNamesIntro.depends(formDataFalse)).to.be.true;
    expect(otherServiceNamesSummary.depends(formDataTrue)).to.be.false;
    expect(otherServiceNamesSummary.depends(formDataFalse)).to.be.true;
    expect(otherServiceNamePage.depends(formDataTrue)).to.be.false;
    expect(otherServiceNamePage.depends(formDataFalse)).to.be.true;
  });

  it('should check if the item is incomplete', () => {
    const completeItem = {
      otherServiceName: { first: 'John', last: 'Doe' },
    };
    const incompleteItem1 = {
      otherServiceName: { first: '', last: 'Doe' },
    };
    const incompleteItem2 = {
      otherServiceName: { first: 'John', last: '' },
    };
    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.isItemIncomplete(incompleteItem1)).to.be.true;
    expect(options.isItemIncomplete(incompleteItem2)).to.be.true;
  });
  it('should return correct getItemName function', () => {
    const completeName = {
      otherServiceName: {
        first: 'Jane',
        middle: 'A.',
        last: 'Smith',
        suffix: 'Jr.',
      },
    };
    const missingName = {
      otherServiceName: {
        first: '',
        middle: 'A.',
        last: '',
        suffix: 'Jr.',
      },
    };
    const emptyName = {
      otherServiceName: {
        first: '',
        middle: '',
        last: '',
        suffix: '',
      },
    };

    const missingItemName = options.text.getItemName(missingName);
    expect(missingItemName).to.equal('');

    const emptyItemName = options.text.getItemName(emptyName);
    expect(emptyItemName).to.equal('');

    const itemName = options.text.getItemName(completeName);
    expect(itemName).to.equal('Jane A. Smith Jr.');
  });
});
