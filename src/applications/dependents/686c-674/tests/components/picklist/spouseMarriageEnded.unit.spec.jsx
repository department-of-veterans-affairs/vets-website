import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import spouseMarriageEnded from '../../../components/picklist/spouseMarriageEnded';

import { createDoB } from '../../test-helpers';

describe('spouseMarriageEnded', () => {
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
        <spouseMarriageEnded.Component
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
      'Information about the end of your marriage to SPOUSY',
    );

    expect($$('h4', container).map(el => el.textContent)).to.deep.equal([
      'When did the marriage end?',
      'Where did the marriage end?',
    ]);

    const VaRadio = $('va-radio', container);
    expect(VaRadio).to.exist;
    expect(VaRadio.getAttribute('label')).to.equal('How did the marriage end?');
    expect(VaRadio.getAttribute('label-header-level')).to.equal('4');
    expect(VaRadio.getAttribute('required')).to.equal('true');

    expect($$('va-radio-option', container).length).to.eq(2);
    expect(
      $$('va-radio-option', container).map(el => el.getAttribute('label')),
    ).to.deep.equal(['Divorce', 'Annulment or declared void']);

    expect($('va-memorable-date', container)).to.exist;

    const checkbox = $('va-checkbox', container);
    expect(checkbox).to.exist;
    expect(checkbox.getAttribute('label')).to.equal(
      'The marriage ended outside the United States',
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
      const errors = $$('[error]', container).map(el =>
        el.getAttribute('error'),
      );
      expect(errors).to.deep.equal([
        'Select an option',
        'Provide a date marriage ended',
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
      const errors = $$('[error]', container).map(el =>
        el.getAttribute('error'),
      );
      // Province is not required
      expect(errors).to.deep.equal([
        'Select an option',
        'Provide a date marriage ended',
        'Enter a city or county',
        'Select a country',
      ]);
      expect(goForward.notCalled).to.be.true;
    });
  });

  it('should show error messages if submitted if annulment is selected and without filling in the remaining fields (non-US)', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      data: {
        ...defaultData,
        marriageEndType: 'annulmentOrVoid',
        marriageEndOutsideUS: true,
      },
      formSubmitted: true,
      goForward,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const errors = $$('[error]', container).map(el =>
        el.getAttribute('error'),
      );
      // province is not required
      expect(errors).to.deep.equal([
        'Enter a response', // annulment description
        'Provide a date marriage ended',
        'Enter a city or county',
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
        marriageEndType: 'divorce',
        marriageEndDate: '2000-01-01',
        marriageEndCity: 'Test',
        marriageEndState: 'TT',
      },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('spouseMarriageEnded handlers', () => {
    it('should return "marriage-ended" on goForward', () => {
      expect(spouseMarriageEnded.handlers.goForward()).to.equal('DONE');
    });

    it('should return reason to remove page path on goBack', () => {
      expect(spouseMarriageEnded.handlers.goBack()).to.equal(
        'marriage-reason-to-remove',
      );
    });

    it('should call goForward when divorce form values are set on submit', () => {
      const goForward = sinon.spy();
      spouseMarriageEnded.handlers.onSubmit({
        itemData: {
          marriageEndType: 'divorce',
          marriageEndDate: '2000-01-01',
          marriageEndCity: 'Test',
          marriageEndState: 'TT',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should call goForward when annulment form values are set on submit', () => {
      const goForward = sinon.spy();
      spouseMarriageEnded.handlers.onSubmit({
        itemData: {
          marriageEndOutsideUS: true,
          marriageEndType: 'annulmentOrVoid',
          marriageEndDate: '2000-01-01',
          marriageEndCity: 'Test',
          marriageEndCountry: 'TTT',
          marriageEndAnnulmentOrVoidDescription: 'Test description',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when a form value is. missing on submit', () => {
      const goForward = sinon.spy();
      spouseMarriageEnded.handlers.onSubmit({
        itemData: {},
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
