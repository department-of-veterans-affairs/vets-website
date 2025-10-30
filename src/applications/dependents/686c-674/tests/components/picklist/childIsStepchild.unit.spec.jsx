import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import childIsStepchild from '../../../components/picklist/childIsStepchild';

import { createDoB } from '../../test-helpers';

describe('childIsStepchild', () => {
  const defaultData = {
    fullName: {
      first: 'PENNY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(11),
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
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <childIsStepchild.Component
          itemData={data}
          fullName="PENNY FOSTER"
          firstName="PENNY"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();
    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Is PENNY FOSTER (age 11) your stepchild?',
    );
    expect(radio.getAttribute('required')).to.equal('true');
  });

  it('should render age in months', () => {
    const data = { ...defaultData, dateOfBirth: createDoB(0, 5) };
    const { container } = renderComponent({ data });
    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Is PENNY FOSTER (age 5 months) your stepchild?',
    );
    expect(radio.getAttribute('required')).to.equal('true');
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
        name: 'isStepchild',
        tagName: 'VA-RADIO',
      },
      detail: { value: 'Y' },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('childIsStepchild handlers', () => {
    it('should return "child-reason-to-remove" on goForward', () => {
      // This will change once more child pages are added
      expect(childIsStepchild.handlers.goForward()).to.equal(
        'child-reason-to-remove',
      );
    });

    it('should call goForward when stepchild value is set on submit', () => {
      const goForward = sinon.spy();
      childIsStepchild.handlers.onSubmit({
        itemData: { isStepchild: 'Y' },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when stepchild value is set on submit', () => {
      const goForward = sinon.spy();
      childIsStepchild.handlers.onSubmit({
        itemData: { isStepchild: undefined },
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
