import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import childHasDisability from '../../../components/picklist/childHasDisability';

import { createDoB } from '../../test-helpers';

describe('childHasDisability', () => {
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
    isEditing = false,
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <childHasDisability.Component
          itemData={data}
          fullName="PENNY FOSTER"
          firstName="PENNY"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          isEditing={isEditing}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();
    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Does PENNY FOSTER have a permanent disability?',
    );
  });

  it('should render edit mode title', () => {
    const { container } = renderComponent({ isEditing: true });
    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Edit does PENNY FOSTER have a permanent disability?',
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
        name: 'childHasPermanentDisability',
        tagName: 'VA-RADIO',
      },
      detail: { value: 'Y' },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('childHasDisability handlers', () => {
    it('should return "child-left-school" on goForward', () => {
      const itemData = {};
      expect(childHasDisability.handlers.goForward({ itemData })).to.equal(
        'child-left-school',
      );
    });

    it('should return "child-exit" on goForward', () => {
      const itemData = { childHasPermanentDisability: 'Y' };
      expect(childHasDisability.handlers.goForward({ itemData })).to.equal(
        'child-exit',
      );
    });

    it('should call goForward when childHasPermanentDisability value is set on submit', () => {
      const goForward = sinon.spy();
      childHasDisability.handlers.onSubmit({
        itemData: { childHasPermanentDisability: 'N' },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when childHasPermanentDisability value is set on submit', () => {
      const goForward = sinon.spy();
      childHasDisability.handlers.onSubmit({
        itemData: { childHasPermanentDisability: undefined },
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
