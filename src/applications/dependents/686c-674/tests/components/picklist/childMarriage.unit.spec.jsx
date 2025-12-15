import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import childMarriage from '../../../components/picklist/childMarriage';

import { createDoB } from '../../test-helpers';

describe('childMarriage', () => {
  const defaultData = {
    fullName: {
      first: 'PENNY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(17),
    relationshipToVeteran: 'Child',
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
    firstName = 'PENNY',
    isEditing = false,
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <childMarriage.Component
          itemData={data}
          fullName="PENNY FOSTER"
          firstName={firstName}
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          isEditing={isEditing}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.equal(
      'When did PENNY get married?',
    );
    const date = $('va-memorable-date', container);
    expect(date).to.exist;
    expect(date.getAttribute('label')).to.equal('Date of marriage');
  });

  it('should render edit title', () => {
    const { container } = renderComponent({ isEditing: true });

    expect($('h3', container).textContent).to.equal(
      'Edit when did PENNY get married?',
    );
  });

  it('should show error messages if submitted without filling in fields', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      formSubmitted: true,
      goForward,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const errors = $$('[error]', container);
      expect(errors.length).to.equal(1);
      expect(errors[0].getAttribute('error')).to.equal('Enter a date');
      expect(goForward.notCalled).to.be.true;
    });
  });

  it('should show error messages if submitted without filling in fields (non-US)', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({ formSubmitted: true, goForward });

    $('va-memorable-date', container).__events.dateBlur({
      target: { name: 'endDate', tagName: 'VA-MEMORABLE-DATE', value: '' },
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const errors = $$('[error]', container);
      expect(errors.length).to.equal(1);
      expect(errors[0].getAttribute('error')).to.equal('Enter a date');
      expect(goForward.notCalled).to.be.true;
    });
  });

  it('should show error messages if a future date is entered', async () => {
    const goForward = sinon.spy();
    const futureDate = createDoB(0, -1); // 1 month in the future
    const { container } = renderComponent({
      formSubmitted: true,
      goForward,
      data: {
        ...defaultData,
        endDate: futureDate,
      },
    });

    $('va-memorable-date', container).__events.dateBlur({
      target: {
        name: 'endDate',
        tagName: 'VA-MEMORABLE-DATE',
        value: futureDate,
      },
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const errors = $$('[error]', container);
      expect(errors.length).to.equal(1);
      expect(errors[0].getAttribute('error')).to.equal('Enter a past date');
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
      },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('childMarriage handlers', () => {
    it('should return "DONE" on goForward', () => {
      expect(childMarriage.handlers.goForward()).to.equal('DONE');
    });

    it('should call goForward when all form values (US) are set on submit', () => {
      const goForward = sinon.spy();
      childMarriage.handlers.onSubmit({
        itemData: {
          endDate: '2000-01-01',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when a form value is missing on submit', () => {
      const goForward = sinon.spy();
      childMarriage.handlers.onSubmit({
        itemData: {},
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
