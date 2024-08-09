import React from 'react';
import { expect } from 'chai';
import { add, format } from 'date-fns';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';

const formatDate = date => format(date, 'yyyy-MM-dd');
const daysFromToday = days => formatDate(add(new Date(), { days }));
const fillDate = (container, target, date) => {
  const [year, month, day] = date
    .split('-')
    .map(field => field.replace(/^0+/, ''));
  const monthSelector = `select[name="${target}Month"]`;
  const daySelector = `select[name="${target}Day"]`;
  const yearSelector = `input[name="${target}Year"]`;

  fireEvent.change($(yearSelector, container), {
    target: { value: year },
  });
  fireEvent.change($(monthSelector, container), {
    target: { value: month },
  });
  fireEvent.change($(daySelector, container), {
    target: { value: day },
  });
};

describe('Federal orders info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.federalOrders;

  it('should render', () => {
    render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('va-radio-option').length).to.equal(2);
  });

  it('should render activation fields', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('va-radio', container)).to.have.attribute(
      'label',
      'Are you currently activated on federal orders in the Reserve or the National Guard?',
    );

    expect($$('va-radio-option[label="Yes"', container)).to.exist;
    expect($$('va-radio-option[label="No"', container)).to.exist;
    expect($$('input').length).to.equal(0);
    expect($$('select').length).to.equal(0);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });

    expect($$('input').length).to.equal(2);
    expect($$('select').length).to.equal(4);
  });

  it('should fail to submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.false;
    expect($('va-radio').error).to.include('Please provide a response');
  });

  it('should submit when data filled in', async () => {
    const onSubmit = sinon.spy();
    const { getByText, container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });
    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDate',
      '2010-05-05',
    );

    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      daysFromToday(160), // < 180 days
    );

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    expect($('va-radio').error).to.be.null;
  });

  it('should fail to submit when activation date is in the future', () => {
    const onSubmit = sinon.spy();
    const { getByText, container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });
    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDate',
      daysFromToday(10),
    );
    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      daysFromToday(20),
    );

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.false;
    expect(
      within(getByRole('alert')).getByText(
        'Enter an activation date in the past',
      ),
    ).to.exist;
  });

  it('should fail to submit when separation date is before activation', () => {
    const onSubmit = sinon.spy();
    const { getByText, container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );
    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });
    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDate',
      daysFromToday(-10),
    );
    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      daysFromToday(-20),
    );

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.false;
    expect(
      within(getByRole('alert')).getByText('Enter a future separation date'),
    ).to.exist;
  });
  it('should fail to submit when separation date is > 180 days in the future', () => {
    const onSubmit = sinon.spy();
    const { getByText, container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });
    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDate',
      daysFromToday(-10),
    );
    fillDate(
      container,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      daysFromToday(190),
    );

    const submitButton = getByText(/submit/i);
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.false;
    expect(
      within(getByRole('alert')).getByText(
        'Enter a separation date less than 180 days in the future',
      ),
    ).to.exist;
  });
});
