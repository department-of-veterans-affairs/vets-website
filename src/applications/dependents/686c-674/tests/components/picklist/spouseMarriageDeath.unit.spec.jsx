import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import spouseDeath from '../../../components/picklist/spouseDeath';

import { createDoB } from '../../test-helpers';

describe('spouseDeath', () => {
  const defaultData = {
    fullName: {
      first: 'SPOUSY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(45),
    relationshipToVeteran: 'Spouse',
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
        <spouseDeath.Component
          itemData={data}
          fullName="SPOUSY FOSTER"
          firstName="SPOUSY"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.equal(
      'Information about the death of SPOUSY',
    );
    expect($$('h4', container).map(el => el.textContent)).to.deep.equal([
      'When was the death?',
      'Where did the death happen?',
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
      data: { ...defaultData, marriageEndOutsideUS: true },
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
      data: { ...defaultData, marriageEndOutsideUS: true },
      formSubmitted: true,
      goForward,
    });

    $('va-checkbox', container).__events.vaChange({
      target: { name: 'marriageEndOutsideUS', tagName: 'VA-CHECKBOX' },
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
        marriageEndDeathDate: '2000-01-01',
        marriageEndCity: 'Test',
        marriageEndState: 'AK',
      },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('spouseDeath handlers', () => {
    it('should return "marriage-ended" on goForward', () => {
      expect(spouseDeath.handlers.goForward()).to.equal('DONE');
    });

    it('should call goForward when all form values (US) are set on submit', () => {
      const goForward = sinon.spy();
      spouseDeath.handlers.onSubmit({
        itemData: {
          marriageEndDeathDate: '2000-01-01',
          marriageEndCity: 'Test',
          marriageEndState: 'AK',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should call goForward when all form values (non-US) are set on submit', () => {
      const goForward = sinon.spy();
      spouseDeath.handlers.onSubmit({
        itemData: {
          marriageEndOutsideUS: true,
          marriageEndDeathDate: '2000-01-01',
          marriageEndCity: 'Test',
          marriageEndCountry: 'TTT',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when a form value is. missing on submit', () => {
      const goForward = sinon.spy();
      spouseDeath.handlers.onSubmit({
        itemData: {},
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
