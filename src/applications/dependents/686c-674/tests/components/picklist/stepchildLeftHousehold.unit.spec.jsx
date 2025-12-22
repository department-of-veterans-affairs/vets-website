import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import stepchildLeftHousehold from '../../../components/picklist/stepchildLeftHousehold';

import { createDoB } from '../../test-helpers';

describe('stepchildLeftHousehold', () => {
  const defaultData = {
    fullName: {
      first: 'NAOMI',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(11),
    relationshipToVeteran: 'Child',
    isStepchild: 'Y',
    removalReason: 'stepchildNotMember',
    stepchildFinancialSupport: 'N',
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
    returnToMainPage = () => {},
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <stepchildLeftHousehold.Component
          itemData={data}
          fullName="NAOMI FOSTER"
          firstName="NAOMI"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          returnToMainPage={returnToMainPage}
        />
      </form>,
    );

  it('should render with proper heading and date field', () => {
    const { container } = renderComponent();
    const heading = $('h3', container);
    const dateField = $('va-memorable-date', container);

    expect(heading).to.exist;
    expect(heading.textContent).to.equal(
      'When did NAOMI stop living with you?',
    );
    expect(dateField).to.exist;
    expect(dateField.getAttribute('label')).to.equal(
      'Date stepchild left your household',
    );
    expect(dateField.getAttribute('required')).to.equal('true');
  });

  it('should show error message if submitted without date', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      formSubmitted: true,
      goForward,
    });

    await waitFor(() => {
      expect($('va-memorable-date', container).getAttribute('error')).to.equal(
        'Provide a date',
      );
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
        endCity: 'Test',
        endState: 'AK',
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

  it('should call onChange when a date is entered', async () => {
    const onChange = sinon.spy();
    const { container } = renderComponent({ onChange });

    $('va-memorable-date', container).__events.dateBlur({
      target: {
        name: 'endDate',
        tagName: 'VA-MEMORABLE-DATE',
        value: '2023-05-15',
      },
    });

    expect(onChange.calledOnce).to.be.true;
    expect(
      onChange.calledWith({
        ...defaultData,
        endDate: '2023-05-15',
      }),
    ).to.be.true;
  });

  it('should go forward when date is entered and form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      data: { ...defaultData, endDate: '2023-05-15' },
      onSubmit,
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  it('should show date value when already filled', () => {
    const { container } = renderComponent({
      data: { ...defaultData, endDate: '2023-05-15' },
    });

    const dateField = $('va-memorable-date', container);
    expect(dateField.getAttribute('value')).to.equal('2023-05-15');
  });

  it('should redirect to main page if not a stepchild', () => {
    const returnToMainPage = sinon.spy();
    renderComponent({
      data: { ...defaultData, isStepchild: 'N' },
      returnToMainPage,
    });

    expect(returnToMainPage.calledOnce).to.be.true;
  });

  it('should redirect to main page if removal reason is not stepchildNotMember', () => {
    const returnToMainPage = sinon.spy();
    renderComponent({
      data: { ...defaultData, removalReason: 'childMarried' },
      returnToMainPage,
    });

    expect(returnToMainPage.calledOnce).to.be.true;
  });

  it('should redirect to main page if relationship is not Child', () => {
    const returnToMainPage = sinon.spy();
    renderComponent({
      data: { ...defaultData, relationshipToVeteran: 'Spouse' },
      returnToMainPage,
    });

    expect(returnToMainPage.calledOnce).to.be.true;
  });

  context('stepchildLeftHousehold handlers', () => {
    const { handlers } = stepchildLeftHousehold;

    it('should return "DONE" on goForward', () => {
      expect(handlers.goForward()).to.equal('DONE');
    });

    it('should call goForward when date is set on submit', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        itemData: { endDate: '2023-05-15' },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when date is not set on submit', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        itemData: { endDate: undefined },
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
