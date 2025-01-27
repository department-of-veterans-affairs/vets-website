import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { policeReportLocationPageTitle } from '../../../content/policeReportLocation';
import * as policeReport from '../../../pages/form0781/policeReportLocation';

describe('Police report location', () => {
  const index = 1;
  const { schema, uiSchema } = {
    schema: policeReport.schema(index),
    uiSchema: policeReport.uiSchema(index),
  };

  it('should define a uiSchema function', () => {
    expect(policeReport.uiSchema).to.be.a('function');
  });

  it('should define a schema function', () => {
    expect(policeReport.schema).to.be.a('function');
  });

  it('displays agency, city, state, and township fields', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{
          [`event${index}`]: {},
        }}
        onSubmit={onSubmit}
      />,
    );

    expect(getByText(policeReportLocationPageTitle)).to.exist;

    const textInputs = container.querySelectorAll('va-text-input');
    expect(textInputs.length).to.eq(4);

    const agencyTextInput = Array.from(textInputs).find(
      input =>
        input.getAttribute('label') ===
        'Name of the agency that issued the report',
    );
    expect(agencyTextInput).to.not.be.null;
    expect(agencyTextInput.getAttribute('required')).to.eq('false');

    const cityTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === 'City',
    );
    expect(cityTextInput).to.not.be.null;
    expect(cityTextInput.getAttribute('required')).to.eq('false');

    const stateTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === 'State/Province/Region',
    );
    expect(stateTextInput).to.not.be.null;
    expect(stateTextInput.getAttribute('required')).to.eq('false');

    const townshipTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === 'Township',
    );
    expect(townshipTextInput).to.not.be.null;
    expect(townshipTextInput.getAttribute('required')).to.eq('false');

    const countrySelect = container.querySelector(
      `va-select[name="root_event${index}_country"]`,
    );
    expect(countrySelect).to.not.be.null;
    expect(countrySelect.getAttribute('required')).to.eq(null);
  });

  it('should submit without entering any text', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        formData={{
          [`event${index}`]: {},
        }}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit if text entered', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        formData={{
          [`event${index}`]: {},
        }}
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Entered text', 'va-text-input');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});
