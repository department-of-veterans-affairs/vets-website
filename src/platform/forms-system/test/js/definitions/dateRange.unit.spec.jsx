import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import uiSchema from '../../../src/js/definitions/dateRange';

const { dateRange: schema, date } = definitions;

function fillDate(form, toFrom, day, month, year) {
  const _day = form.container.querySelector(`#root_${toFrom}Day`);
  fireEvent.change(_day, { target: { value: day } });

  const _month = form.container.querySelector(`#root_${toFrom}Month`);
  fireEvent.change(_month, { target: { value: month } });

  const _year = form.container.querySelector(`#root_${toFrom}Year`);
  fireEvent.change(_year, { target: { value: year } });
}

describe('Schemaform definition dateRange', () => {
  it('should render dateRange', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        definitions={{ date }}
        uiSchema={uiSchema()}
      />,
    );

    expect(form.container.querySelectorAll('label,legend').length).to.equal(8);
    expect(form.container.querySelectorAll('input').length).to.equal(2);
    expect(form.container.querySelectorAll('select').length).to.equal(4);
  });
  it('should render invalid dateRange error', async () => {
    const dateRangeUISchema = uiSchema();
    const form = render(
      <DefinitionTester
        schema={schema}
        definitions={{ date }}
        uiSchema={dateRangeUISchema}
      />,
    );

    fillDate(form, 'to', 4, 4, 2000);

    fillDate(form, 'from', 4, 4, 2001);

    await waitFor(() => {
      const submitButton = form.getByRole('button', { name: 'Submit' });
      const mouseClick = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      fireEvent(submitButton, mouseClick);

      const errorMessage = `Error ${dateRangeUISchema['ui:errorMessages'].pattern}`;
      const errorElement = form.container.querySelector(
        '.usa-input-error-message',
      );
      expect(errorElement.textContent).to.equal(errorMessage);
    });
  });
  it('should render dateRange title and messages', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        definitions={{ date }}
        uiSchema={uiSchema('My from date', 'My to date', 'My error')}
      />,
    );

    expect(form.container.querySelectorAll('legend')[0].textContent).to.equal(
      'My from date',
    );
    expect(form.container.querySelectorAll('legend')[1].textContent).to.equal(
      'My to date',
    );
  });
});
