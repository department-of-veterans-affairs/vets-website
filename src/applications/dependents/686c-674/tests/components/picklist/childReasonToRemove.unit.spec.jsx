import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import childReasonToRemove from '../../../components/picklist/childReasonToRemove';
import { labels } from '../../../components/picklist/utils';

import { createDoB } from '../../test-helpers';

describe('childReasonToRemove', () => {
  const defaultData = {
    fullName: {
      first: 'PENNY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(11),
    relationshipToVeteran: 'Child',
    isStepchild: 'N',
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
        <childReasonToRemove.Component
          itemData={data}
          fullName="PENNY FOSTER"
          firstName="PENNY"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
        />
      </form>,
    );

  it('should render with proper heading and radio group', () => {
    const { container } = renderComponent();
    const radio = $('va-radio', container);
    const heading = $('h3', container);

    expect(heading).to.exist;
    expect(heading.textContent).to.include('PENNY FOSTER');
    expect(radio).to.exist;
    expect(radio.getAttribute('required')).to.equal('true');
    expect(radio.getAttribute('label')).to.equal(labels.Child.removalReason);
    expect(radio.getAttribute('hint')).to.equal(
      'If more than one applies, select what happened first.',
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
        labels.Child.removalReasonError,
      );
    });
  });

  it('should call onChange when a radio option is selected', async () => {
    const onChange = sinon.spy();
    const { container } = renderComponent({ onChange });

    $('va-radio', container).__events.vaValueChange({
      target: {
        name: 'removalReason',
        tagName: 'VA-RADIO',
      },
      detail: { value: 'childDied' },
    });

    expect(onChange.calledOnce).to.be.true;
    expect(
      onChange.calledWith({
        ...defaultData,
        removalReason: 'childDied',
      }),
    ).to.be.true;
  });

  it('should go forward when an option is selected and form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({
      data: { ...defaultData, removalReason: 'childDied' },
      onSubmit,
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  describe('age-based options', () => {
    it('should show school enrollment option for children 18 and older', () => {
      const { container } = renderComponent({
        data: { ...defaultData, dateOfBirth: createDoB(18) },
      });

      const radioOptions = container.querySelectorAll('va-radio-option');
      const schoolOption = Array.from(radioOptions).find(
        option => option.getAttribute('value') === 'childNotInSchool',
      );

      expect(schoolOption).to.exist;
    });

    it('should not show school enrollment option for children under 18', () => {
      const { container } = renderComponent({
        data: { ...defaultData, dateOfBirth: createDoB(16) },
      });

      const radioOptions = container.querySelectorAll('va-radio-option');
      const schoolOption = Array.from(radioOptions).find(
        option => option.getAttribute('value') === 'childNotInSchool',
      );

      expect(schoolOption).to.not.exist;
    });

    it('should show marriage option for children 15 and older', () => {
      const { container } = renderComponent({
        data: { ...defaultData, dateOfBirth: createDoB(15) },
      });

      const radioOptions = container.querySelectorAll('va-radio-option');
      const marriageOption = Array.from(radioOptions).find(
        option => option.getAttribute('value') === 'childMarried',
      );

      expect(marriageOption).to.exist;
    });

    it('should not show marriage option for children under 15', () => {
      const { container } = renderComponent({
        data: { ...defaultData, dateOfBirth: createDoB(14) },
      });

      const radioOptions = container.querySelectorAll('va-radio-option');
      const marriageOption = Array.from(radioOptions).find(
        option => option.getAttribute('value') === 'childMarried',
      );

      expect(marriageOption).to.not.exist;
    });
  });

  describe('stepchild-specific options', () => {
    it('should show stepchild living option for stepchildren', () => {
      const { container } = renderComponent({
        data: { ...defaultData, isStepchild: 'Y' },
      });

      const radioOptions = container.querySelectorAll('va-radio-option');
      const stepchildOption = Array.from(radioOptions).find(
        option => option.getAttribute('value') === 'stepchildNotMember',
      );

      expect(stepchildOption).to.exist;
    });

    it('should not show stepchild living option for non-stepchildren', () => {
      const { container } = renderComponent({
        data: { ...defaultData, isStepchild: 'N' },
      });

      const radioOptions = container.querySelectorAll('va-radio-option');
      const stepchildOption = Array.from(radioOptions).find(
        option => option.getAttribute('value') === 'stepchildNotMember',
      );

      expect(stepchildOption).to.not.exist;
    });

    it('should show additional info for stepchildren', () => {
      const { container } = renderComponent({
        data: { ...defaultData, isStepchild: 'Y' },
      });

      const additionalInfo = $('va-additional-info', container);
      expect(additionalInfo).to.exist;
      expect(additionalInfo.getAttribute('trigger')).to.include(
        'Stepchildren living apart temporarily',
      );
    });

    it('should not show additional info for non-stepchildren', () => {
      const { container } = renderComponent({
        data: { ...defaultData, isStepchild: 'N' },
      });

      const additionalInfo = $('va-additional-info', container);
      expect(additionalInfo).to.not.exist;
    });
  });

  describe('universal options', () => {
    it('should always show ~adoption and~ death options', () => {
      const { container } = renderComponent();

      const radioOptions = container.querySelectorAll('va-radio-option');
      // const adoptionOption = Array.from(radioOptions).find(
      //   option => option.getAttribute('value') === 'childAdopted',
      // );
      const deathOption = Array.from(radioOptions).find(
        option => option.getAttribute('value') === 'childDied',
      );

      // expect(adoptionOption).to.exist;
      expect(deathOption).to.exist;
    });
  });

  context('childReasonToRemove handlers', () => {
    it('should return "DONE" by default on goForward', () => {
      expect(childReasonToRemove.handlers.goForward({ itemData: {} })).to.equal(
        'DONE',
      );
    });

    it('should return "child-marriage" on goForward', () => {
      expect(
        childReasonToRemove.handlers.goForward({
          itemData: { removalReason: 'childMarried' },
        }),
      ).to.equal('child-marriage');
    });

    it('should return "child-death" on goForward', () => {
      expect(
        childReasonToRemove.handlers.goForward({
          itemData: { removalReason: 'childDied' },
        }),
      ).to.equal('child-death');
    });

    it('should return "stepchild-financial-support" on goForward', () => {
      expect(
        childReasonToRemove.handlers.goForward({
          itemData: { removalReason: 'stepchildNotMember' },
        }),
      ).to.equal('stepchild-financial-support');
    });

    it('should return "child-left-school" on goForward', () => {
      expect(
        childReasonToRemove.handlers.goForward({
          itemData: { removalReason: 'childNotInSchool' },
        }),
      ).to.equal('child-left-school');
    });

    it('should return "child-adopted" on goForward', () => {
      expect(
        childReasonToRemove.handlers.goForward({
          itemData: { removalReason: 'childAdopted' },
        }),
      ).to.equal('child-adopted-exit');
    });

    it('should call goForward when removal reason is set on submit', () => {
      const goForward = sinon.spy();
      childReasonToRemove.handlers.onSubmit({
        itemData: { removalReason: 'childDied' },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when removal reason is not set on submit', () => {
      const goForward = sinon.spy();
      childReasonToRemove.handlers.onSubmit({
        itemData: { removalReason: undefined },
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
