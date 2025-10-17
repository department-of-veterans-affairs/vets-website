import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import childReasonToRemove from '../../../components/picklist/childReasonToRemove';

import { createDoB } from '../../test-helpers';

describe('childReasonToRemove', () => {
  const defaultChildData = {
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

  const defaultStepchildData = {
    ...defaultChildData,
    isStepchild: 'Y',
  };

  const renderComponent = ({
    data = defaultChildData,
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

  it('should render for regular child', () => {
    const { container } = renderComponent();
    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Do any of these apply to PENNY FOSTER (age 11)?',
    );
    expect(radio.getAttribute('required')).to.equal('true');

    const h3 = $('h3', container);
    expect(h3.textContent).to.equal('Reason for removing PENNY FOSTER');
  });

  it('should show error message if submitted without selecting an option', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({
      formSubmitted: true,
      goForward,
    });

    await fireEvent.submit($('form', container));

    await waitFor(() => {
      expect($('va-radio', container).getAttribute('error')).to.equal(
        'Select an option',
      );
      expect(goForward.notCalled).to.be.true;
    });
  });

  it('should go forward when an option is selected and form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({ onSubmit });

    $('va-radio', container).__events.vaValueChange({
      target: {
        name: 'removalReason',
        tagName: 'VA-RADIO',
      },
      detail: { value: 'childDied' },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  describe('regular child options (age 11)', () => {
    it('should show basic child options for regular child under 15', () => {
      const { container } = renderComponent();
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Should show: died, adopted (no marriage or school options under 15)
      expect(radioOptions.length).to.equal(2);

      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('PENNY died');
      expect(labels).to.include('PENNY got adopted out of the family');
      expect(labels).to.not.include('PENNY got married');
      expect(labels).to.not.include('PENNY is no longer in school');
    });
  });

  describe('regular child options (age 16)', () => {
    it('should show marriage option for regular child age 15+', () => {
      const childAge16 = {
        ...defaultChildData,
        dateOfBirth: createDoB(16),
      };

      const { container } = renderComponent({ data: childAge16 });
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Should show: died, adopted, married (no school option under 18)
      expect(radioOptions.length).to.equal(3);

      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('PENNY died');
      expect(labels).to.include('PENNY got adopted out of the family');
      expect(labels).to.include('PENNY got married');
      expect(labels).to.not.include('PENNY is no longer in school');
    });
  });

  describe('regular child options (age 19)', () => {
    it('should show all regular child options for age 18+', () => {
      const childAge19 = {
        ...defaultChildData,
        dateOfBirth: createDoB(19),
      };

      const { container } = renderComponent({ data: childAge19 });
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Should show: died, adopted, married, school
      expect(radioOptions.length).to.equal(4);

      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('PENNY died');
      expect(labels).to.include('PENNY got adopted out of the family');
      expect(labels).to.include('PENNY got married');
      expect(labels).to.include('PENNY is no longer in school');
    });
  });

  describe('stepchild options (age 11)', () => {
    it('should show stepchild and basic options for young stepchild', () => {
      const { container } = renderComponent({ data: defaultStepchildData });
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Should show: 4 stepchild options + died + adopted (no marriage or school under 15)
      expect(radioOptions.length).to.equal(6);

      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('PENNY left due to divorce');
      expect(labels).to.include('PENNY left household due to divorce');
      expect(labels).to.include('PENNY is no longer a member of the household');
      expect(labels).to.include("PENNY's parent died");
      expect(labels).to.include('PENNY died');
      expect(labels).to.include('PENNY got adopted out of the family');
      expect(labels).to.not.include('PENNY got married');
      expect(labels).to.not.include('PENNY is no longer in school');
    });
  });

  describe('stepchild options (age 16)', () => {
    it('should show marriage option for stepchild age 15+', () => {
      const stepchildAge16 = {
        ...defaultStepchildData,
        dateOfBirth: createDoB(16),
      };

      const { container } = renderComponent({ data: stepchildAge16 });
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Should show: 4 stepchild options + died + adopted + married (no school under 18)
      expect(radioOptions.length).to.equal(7);

      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('PENNY got married');
      expect(labels).to.not.include('PENNY is no longer in school');
    });
  });

  describe('stepchild options (age 19)', () => {
    it('should show all options for stepchild age 18+', () => {
      const stepchildAge19 = {
        ...defaultStepchildData,
        dateOfBirth: createDoB(19),
      };

      const { container } = renderComponent({ data: stepchildAge19 });
      const radioOptions = container.querySelectorAll('va-radio-option');

      // Should show: 4 stepchild options + died + adopted + married + school
      expect(radioOptions.length).to.equal(8);

      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('PENNY left due to divorce');
      expect(labels).to.include('PENNY left household due to divorce');
      expect(labels).to.include('PENNY is no longer a member of the household');
      expect(labels).to.include("PENNY's parent died");
      expect(labels).to.include('PENNY died');
      expect(labels).to.include('PENNY got adopted out of the family');
      expect(labels).to.include('PENNY got married');
      expect(labels).to.include('PENNY is no longer in school');
    });
  });

  describe('option selection', () => {
    it('should handle stepchild option selection', async () => {
      const onChange = sinon.spy();
      const { container } = renderComponent({
        data: defaultStepchildData,
        onChange,
      });

      $('va-radio', container).__events.vaValueChange({
        target: {
          name: 'removalReason',
          tagName: 'VA-RADIO',
        },
        detail: { value: 'stepchildDivorce' },
      });

      await waitFor(() => {
        expect(onChange.calledOnce).to.be.true;
        expect(
          onChange.calledWith({
            ...defaultStepchildData,
            removalReason: 'stepchildDivorce',
          }),
        ).to.be.true;
      });
    });

    it('should handle regular child option selection', async () => {
      const onChange = sinon.spy();
      const { container } = renderComponent({ onChange });

      $('va-radio', container).__events.vaValueChange({
        target: {
          name: 'removalReason',
          tagName: 'VA-RADIO',
        },
        detail: { value: 'childDied' },
      });

      await waitFor(() => {
        expect(onChange.calledOnce).to.be.true;
        expect(
          onChange.calledWith({
            ...defaultChildData,
            removalReason: 'childDied',
          }),
        ).to.be.true;
      });
    });
  });

  context('childReasonToRemove handlers', () => {
    it('should return "DONE" on goForward', () => {
      expect(childReasonToRemove.handlers.goForward()).to.equal('DONE');
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
