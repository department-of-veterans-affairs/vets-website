import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import stepchildLivesWith from '../../../components/picklist/stepchildLivesWith';

import { createDoB } from '../../test-helpers';

describe('stepchildLivesWith', () => {
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
    addres: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '90210',
      country: 'USA',
    },
    whoDoesTheStepchildLiveWith: {
      first: '',
      last: '',
    },
    selected: true,
    awardIndicator: 'Y',
  };

  const renderComponent = ({
    data = defaultData,
    formSubmitted = false,
    isEditing = false,
    onChange = () => {},
    onSubmit = () => {},
    goForward = () => {},
    goBack = () => {},
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <stepchildLivesWith.Component
          itemData={data}
          fullName="NAOMI FOSTER"
          firstName="NAOMI"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          isEditing={isEditing}
        />
      </form>,
    );

  it('should render with title with child name', () => {
    const { container } = renderComponent();
    expect($('h3', container).textContent).to.equal(
      'Who does NAOMI live with?',
    );
  });
  it('should render with editing title', () => {
    const { container } = renderComponent({ isEditing: true });
    expect($('h3', container).textContent).to.equal(
      'Editing who does NAOMI live with?',
    );
  });

  it('should include inputs for guardian name', () => {
    const { container } = renderComponent();
    const inputs = container.querySelectorAll('va-text-input');

    expect(inputs.length).to.equal(3);
    expect(inputs[0].getAttribute('name')).to.equal('first');
    expect(inputs[1].getAttribute('name')).to.equal('middle');
    expect(inputs[2].getAttribute('name')).to.equal('last');

    expect($$('.dd-privacy-mask', container).length).to.equal(1);
  });

  it('should not go forward when form is submitted', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({ goForward, formSubmitted: true });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(goForward.notCalled).to.be.true;
      const errors = $$('[error]', container);
      expect(errors.length).to.equal(2);
      expect(errors[0].getAttribute('error')).to.equal('Enter a first name');
      expect(errors[1].getAttribute('error')).to.equal('Enter a last name');
    });
  });

  it('should call go onSubmit when required field are filled & form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      onSubmit,
      itemData: {
        ...defaultData,
        whoDoesTheStepchildLiveWith: {
          first: 'Jane',
          last: 'Doe',
        },
      },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });

  context('stepchildLivesWith handlers', () => {
    const { handlers } = stepchildLivesWith;

    it('should return "stepchild-left-household" on goForward', () => {
      expect(handlers.goForward()).to.equal('stepchild-left-household');
    });

    it('should not call goForward when data is missing & page is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
        itemData: {
          whoDoesTheStepchildLiveWith: {},
        },
      });
      expect(goForward.called).to.be.false;
    });

    it('should call goForward when page is submitted', async () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
        itemData: {
          whoDoesTheStepchildLiveWith: { first: 'Jane', last: 'Doe' },
        },
      });

      await waitFor(() => {
        expect(goForward.called).to.be.true;
      });
    });
  });
});
