import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import childDeath from '../../../components/picklist/childDeath';
import { createDoB } from '../../test-helpers';

describe('childDeath', () => {
  const defaultData = {
    fullName: {
      first: 'PENNY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(82),
    relationshipToVeteran: 'Parent',
    selected: true,
    awardIndicator: 'Y',
  };
  const renderComponent = ({
    data = defaultData,
    formSubmitted = false,
    onChange = () => {},
    onSubmit = () => {},
    goForward = () => {},
    goBack = () => {},
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <childDeath.Component
          itemData={data}
          fullName="PENNY FOSTER"
          firstName="PENNY"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.equal(
      'Information about the death of PENNY',
    );
    expect($$('h4', container).map(el => el.textContent)).to.deep.equal([
      'When was the death?',
      'Where was the death?',
    ]);

    expect($('va-memorable-date', container)).to.exist;

    const checkbox = $('va-checkbox', container);
    expect(checkbox).to.exist;
    expect(checkbox.getAttribute('label')).to.equal(
      'The death happened outside the United States',
    );

    const inUSInputs = $$('va-text-input', container);
    expect(inUSInputs.length).to.eq(1);
    expect(inUSInputs[0].getAttribute('label')).to.eq('City or county');

    const inUSSelects = $$('va-select', container);
    expect(inUSSelects.length).to.eq(1);
    expect(inUSSelects[0].getAttribute('label')).to.eq('State');
  });

  it('should render country & province fields when outside US checkbox is checked', () => {
    const { container } = renderComponent({
      data: { ...defaultData, endOutsideUS: true },
    });

    expect($('va-checkbox', container).checked).to.be.true;

    const inUSInputs = $$('va-text-input', container);
    expect(inUSInputs.length).to.eq(2);
    expect(inUSInputs[0].getAttribute('label')).to.eq('City');
    expect(inUSInputs[1].getAttribute('label')).to.eq(
      'Province, region or territory',
    );

    const inUSSelects = $$('va-select', container);
    expect(inUSSelects.length).to.eq(1);
    expect(inUSSelects[0].getAttribute('label')).to.eq('Country');
  });

  it('should show error messages if submitted without filling in fields (US)', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      formSubmitted: true,
      goForward,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const errors = $$('[error]', container);
      expect(errors.length).to.equal(3);
      expect(errors.map(el => el.getAttribute('error'))).to.deep.equal([
        'Provide a date of death',
        'Enter a city or county',
        'Select a state',
      ]);
      expect(goForward.notCalled).to.be.true;
    });
  });

  it('should show error messages if submitted without filling in fields (non-US)', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      data: { ...defaultData, endOutsideUS: true },
      formSubmitted: true,
      goForward,
    });

    $('va-checkbox', container).__events.vaChange({
      target: { name: 'endOutsideUS', tagName: 'VA-CHECKBOX' },
      detail: { checked: true },
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const errors = $$('[error]', container);
      // Still 3 errors because province is not required
      expect(errors.length).to.equal(3);
      expect(errors.map(el => el.getAttribute('error'))).to.deep.equal([
        'Provide a date of death',
        'Enter a city',
        'Select a country',
      ]);
      expect(goForward.notCalled).to.be.true;
    });
  });

  it('should go forward when an option is selected and form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      onSubmit,
      data: {
        ...defaultData,
        endDate: '2000-01-01',
        endCity: 'Test',
        endState: 'AK',
      },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('childDeath handlers', () => {
    it('should return "DONE" on goForward', () => {
      expect(childDeath.handlers.goForward()).to.equal('DONE');
    });

    it('should call goForward when all form values (US) are set on submit', () => {
      const goForward = sinon.spy();
      childDeath.handlers.onSubmit({
        itemData: {
          endDate: '2000-01-01',
          endCity: 'Test',
          endState: 'AK',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should call goForward when all form values (non-US) are set on submit', () => {
      const goForward = sinon.spy();
      childDeath.handlers.onSubmit({
        itemData: {
          endOutsideUS: true,
          endDate: '2000-01-01',
          endCity: 'Test',
          endCountry: 'TTT',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when a form value is. missing on submit', () => {
      const goForward = sinon.spy();
      childDeath.handlers.onSubmit({
        itemData: {},
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
