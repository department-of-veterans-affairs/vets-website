import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import childLeftSchool from '../../../components/picklist/childLeftSchool';

import { createDoB } from '../../test-helpers';

describe('childLeftSchool', () => {
  const defaultData = {
    fullName: {
      first: 'PENNY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(19),
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
        <childLeftSchool.Component
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
      'When did PENNY stop attending school?',
    );
    const date = $('va-memorable-date', container);
    expect(date).to.exist;
    expect(date.getAttribute('label')).to.equal(
      'Date child stopped attending school',
    );
  });

  it('should render edit title', () => {
    const { container } = renderComponent({ isEditing: true });

    expect($('h3', container).textContent).to.equal(
      'Edit when did PENNY stop attending school?',
    );
  });

  it('should show error messages if submitted without filling in date', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({ formSubmitted: true, goForward });

    $('va-memorable-date', container).__events.dateBlur({
      target: { name: 'endDate', tagName: 'VA-MEMORABLE-DATE', value: '' },
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      const errors = $$('[error]', container);
      expect(errors.length).to.equal(1);
      expect(errors[0].getAttribute('error')).to.equal(
        'Enter last date of school attendance',
      );
      expect(goForward.notCalled).to.be.true;
    });
  });

  it('should show error messages if a future date is entered', async () => {
    const goForward = sinon.spy();
    const futureDate = createDoB(0, -1); // 1 month in the future
    const { container } = renderComponent({
      formSubmitted: true,
      goForward,
      data: { ...defaultData, endDate: futureDate },
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

  it('should go forward when a date is entered and form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      onSubmit,
      data: {
        ...defaultData,
        endDate: '2025-01-01',
      },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('childLeftSchool handlers', () => {
    it('should return "DONE" on goForward', () => {
      expect(childLeftSchool.handlers.goForward()).to.equal('DONE');
    });

    it('should call goForward when all form values (US) are set on submit', () => {
      const goForward = sinon.spy();
      childLeftSchool.handlers.onSubmit({
        itemData: {
          endDate: '2025-01-01',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when a form value is missing on submit', () => {
      const goForward = sinon.spy();
      childLeftSchool.handlers.onSubmit({
        itemData: {},
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
