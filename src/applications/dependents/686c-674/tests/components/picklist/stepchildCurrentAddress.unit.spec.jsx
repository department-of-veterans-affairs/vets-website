import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import stepchildCurrentAddress from '../../../components/picklist/stepchildCurrentAddress';

import { createDoB } from '../../test-helpers';

describe('stepchildCurrentAddress', () => {
  const defaultData = {
    fullName: {
      first: 'NAOMI',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(11),
    relationshipToVeteran: 'Child',
    isStepchild: 'Y',
    removalReason: 'stepchildNotMember',
    stepchildFinancialSupport: 'Y',
    selected: true,
    awardIndicator: 'Y',
    address: {
      isMilitary: false,
      street: '123 Main St',
      city: 'City',
      state: 'AK',
      postalCode: '12345',
      country: 'USA',
    },
  };

  const renderComponent = ({
    data = defaultData,
    formSubmitted = false,
    onChange = () => {},
    onSubmit = () => {},
    goForward = () => {},
    goBack = () => {},
    isEditing = false,
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <stepchildCurrentAddress.Component
          itemData={data}
          fullName="NAOMI FOSTER"
          firstName="NAOMI"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          isEditing={isEditing}
        />
      </form>,
    );

  it('should render with correct title', () => {
    const { container } = renderComponent();
    expect($('h3', container).textContent).to.equal('NAOMI’s current address');
  });
  it('should render with Editing in title', () => {
    const { container } = renderComponent({ isEditing: true });
    expect($('h3', container).textContent).to.equal(
      'Editing NAOMI’s current address',
    );
  });

  it('should display USA address fields', () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({ onSubmit });
    const selects = $$('va-select', container);
    const textInputs = $$('va-text-input', container);

    expect(selects.length).to.equal(2);
    expect(selects[0].getAttribute('label')).to.equal('Country');
    expect(selects[1].getAttribute('label')).to.equal('State');

    expect(textInputs.length).to.equal(5);
    expect(textInputs[0].getAttribute('label')).to.equal('Street address');
    expect(textInputs[1].getAttribute('label')).to.equal(
      'Street address line 2',
    );
    expect(textInputs[2].getAttribute('label')).to.equal(
      'Street address line 3',
    );
    expect(textInputs[3].getAttribute('label')).to.equal('City');
    expect(textInputs[4].getAttribute('label')).to.equal('Postal code');

    fireEvent.submit($('form', container));
    expect(onSubmit.called).to.be.true;
  });

  it('should display international address fields', () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      onSubmit,
      data: {
        ...defaultData,
        address: {
          street: '123 Main St',
          city: 'City',
          state: 'Province',
          postalCode: '12345',
          country: 'CAN',
        },
      },
    });
    const selects = $$('va-select', container);
    const textInputs = $$('va-text-input', container);

    expect(selects.length).to.equal(2);
    expect(selects[0].getAttribute('label')).to.equal('Country');
    expect(selects[1].getAttribute('label')).to.equal('Province or territory');

    expect(textInputs.length).to.equal(5);
    expect(textInputs[0].getAttribute('label')).to.equal('Street address');
    expect(textInputs[1].getAttribute('label')).to.equal(
      'Street address line 2',
    );
    expect(textInputs[2].getAttribute('label')).to.equal(
      'Street address line 3',
    );
    expect(textInputs[3].getAttribute('label')).to.equal('City');
    expect(textInputs[4].getAttribute('label')).to.equal('Postal code');

    fireEvent.submit($('form', container));
    expect(onSubmit.called).to.be.true;
  });

  it('should display military address fields & submit', () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      onSubmit,
      data: {
        ...defaultData,
        address: {
          isMilitary: true,
          street: '123 Main St',
          city: 'APO',
          state: 'AA',
          postalCode: '12345',
          country: 'USA',
        },
      },
    });
    const selects = $$('va-select', container);
    const radios = $$('va-radio', container);
    const textInputs = $$('va-text-input', container);

    expect(selects.length).to.equal(1);
    expect(selects[0].getAttribute('label')).to.equal('Country');

    expect(radios.length).to.equal(2);
    expect(radios[0].getAttribute('label')).to.equal('Military post office');
    expect(radios[1].getAttribute('label')).to.equal(
      'Overseas "state" abbreviation',
    );

    expect(textInputs.length).to.equal(4);
    expect(textInputs[0].getAttribute('label')).to.equal('Street address');
    expect(textInputs[1].getAttribute('label')).to.equal(
      'Apartment or unit number',
    );
    expect(textInputs[2].getAttribute('label')).to.equal(
      'Additional address information',
    );
    expect(textInputs[3].getAttribute('label')).to.equal('Postal code');

    fireEvent.submit($('form', container));
    expect(onSubmit.called).to.be.true;
  });

  it('should not go forward when form is submitted', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      goForward,
      formSubmitted: true,
      data: {
        ...defaultData,
        address: { country: 'USA' },
      },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(goForward.notCalled).to.be.true;
      const errors = $$('[error]', container);
      expect(errors.length).to.equal(4);
      expect(errors.map(el => el.getAttribute('error'))).to.deep.equal([
        'Enter a valid street address',
        'Enter a city',
        'Select a state',
        'Enter a valid 5-digit zip code',
      ]);
    });
  });

  context('stepchildCurrentAddress handlers', () => {
    const { handlers } = stepchildCurrentAddress;

    it('should return "stepchild-lives-with" on goForward', () => {
      expect(handlers.goForward()).to.equal('stepchild-lives-with');
    });

    it('should not call goForward when an incomplete US address is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
        itemData: { ...defaultData, address: { country: 'USA' } },
      });
      expect(goForward.called).to.be.false;
    });

    it('should call goForward when a US address is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
        itemData: defaultData,
      });
      expect(goForward.called).to.be.true;
    });

    it('should call goForward an international address is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
        itemData: {
          ...defaultData,
          address: {
            ...defaultData.address,
            country: 'CAN',
            state: 'Province',
            postalCode: 'A1A 1A1',
          },
        },
      });
      expect(goForward.called).to.be.true;
    });
  });
});
