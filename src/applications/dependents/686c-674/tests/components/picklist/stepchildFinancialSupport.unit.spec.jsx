import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import stepchildFinancialSupport from '../../../components/picklist/stepchildFinancialSupport';

import { createDoB } from '../../test-helpers';

describe('stepchildFinancialSupport', () => {
  const defaultData = {
    fullName: {
      first: 'PENNY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(11),
    relationshipToVeteran: 'Child',
    isStepchild: 'Y',
    removalReason: 'stepchildNotMember',
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
        <stepchildFinancialSupport.Component
          itemData={data}
          fullName="PENNY FOSTER"
          firstName="PENNY"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          returnToMainPage={returnToMainPage}
        />
      </form>,
    );

  it('should render with proper heading and radio group', () => {
    const { container } = renderComponent();
    const radio = $('va-radio', container);

    expect(radio).to.exist;
    expect(radio.getAttribute('required')).to.equal('true');
    expect(radio.getAttribute('label')).to.equal(
      'Do you provide at least half of PENNY’s financial support?',
    );
  });

  it('should show error message if submitted without selecting an option', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      formSubmitted: true,
      goForward,
    });

    await waitFor(() => {
      expect($('va-radio', container).getAttribute('error')).to.equal(
        'Select an option',
      );
    });
  });

  it('should call onChange when a radio option is selected', async () => {
    const onChange = sinon.spy();
    const { container } = renderComponent({ onChange });

    $('va-radio', container).__events.vaValueChange({
      target: {
        name: 'stepchildFinancialSupport',
        tagName: 'VA-RADIO',
      },
      detail: { value: 'Y' },
    });

    expect(onChange.calledOnce).to.be.true;
    expect(
      onChange.calledWith({
        ...defaultData,
        stepchildFinancialSupport: 'Y',
      }),
    ).to.be.true;
  });

  it('should go forward when an option is selected and form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      data: { ...defaultData, stepchildFinancialSupport: 'Y' },
      onSubmit,
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  it('should show yes option checked when value is Y', () => {
    const { container } = renderComponent({
      data: { ...defaultData, stepchildFinancialSupport: 'Y' },
    });

    const radioOptions = container.querySelectorAll('va-radio-option');
    const yesOption = Array.from(radioOptions).find(
      option => option.getAttribute('value') === 'Y',
    );

    expect(yesOption).to.exist;
    expect(yesOption.getAttribute('checked')).to.equal('true');
  });

  it('should show no option checked when value is N', () => {
    const { container } = renderComponent({
      data: { ...defaultData, stepchildFinancialSupport: 'N' },
    });

    const radioOptions = container.querySelectorAll('va-radio-option');
    const noOption = Array.from(radioOptions).find(
      option => option.getAttribute('value') === 'N',
    );

    expect(noOption).to.exist;
    expect(noOption.getAttribute('checked')).to.equal('true');
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

  context('stepchildFinancialSupport handlers', () => {
    it('should return "stepchild-financial-support-exit" when providing financial support', () => {
      expect(
        stepchildFinancialSupport.handlers.goForward({
          itemData: { stepchildFinancialSupport: 'Y' },
        }),
      ).to.equal('stepchild-current-address');
    });

    it('should return "stepchild-left-household" when not providing financial support', () => {
      expect(
        stepchildFinancialSupport.handlers.goForward({
          itemData: { stepchildFinancialSupport: 'N' },
        }),
      ).to.equal('stepchild-left-household');
    });

    it('should return "stepchild-left-household" when financial support value is not set', () => {
      expect(
        stepchildFinancialSupport.handlers.goForward({
          itemData: {},
        }),
      ).to.equal('stepchild-left-household');
    });

    it('should call goForward when financial support value is set on submit', () => {
      const goForward = sinon.spy();
      stepchildFinancialSupport.handlers.onSubmit({
        itemData: { stepchildFinancialSupport: 'Y' },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when financial support value is not set on submit', () => {
      const goForward = sinon.spy();
      stepchildFinancialSupport.handlers.onSubmit({
        itemData: { stepchildFinancialSupport: undefined },
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
