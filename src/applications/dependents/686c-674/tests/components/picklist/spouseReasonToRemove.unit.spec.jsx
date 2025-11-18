import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import spouseReasonToRemove from '../../../components/picklist/spouseReasonToRemove';
import { labels } from '../../../components/picklist/utils';

import { createDoB } from '../../test-helpers';

describe('spouseReasonToRemove', () => {
  const defaultData = {
    fullName: {
      first: 'SPOUSY',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(45),
    relationshipToVeteran: 'Spouse',
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
        <spouseReasonToRemove.Component
          itemData={data}
          fullName="SPOUSY FOSTER"
          firstName="SPOUSY"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          returnToMainPage={returnToMainPage}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.contain('SPOUSY FOSTER');

    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(labels.Spouse.removalReason);
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
        labels.Spouse.removalReasonError,
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
      detail: { value: 'marriageEnded' },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  it('should return to main picklist page if spouse is invalid', () => {
    const returnToMainPage = sinon.spy();
    renderComponent({ data: {}, returnToMainPage });
    expect(returnToMainPage.calledOnce).to.be.true;
  });

  context('spouseReasonToRemove handlers', () => {
    it('should return "spouse-marriage-ended" on goForward', () => {
      expect(
        spouseReasonToRemove.handlers.goForward({
          itemData: { removalReason: 'marriageEnded' },
        }),
      ).to.equal('spouse-marriage-ended');
    });
    it('should return "spouse-death" on goForward', () => {
      expect(
        spouseReasonToRemove.handlers.goForward({
          itemData: { removalReason: 'marriageDeath' },
        }),
      ).to.equal('spouse-death');
    });

    it('should call goForward when reason to remove value is set on submit', () => {
      const goForward = sinon.spy();
      spouseReasonToRemove.handlers.onSubmit({
        itemData: { removalReason: 'spouseDied' },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when reason to remove value is set on submit', () => {
      const goForward = sinon.spy();
      spouseReasonToRemove.handlers.onSubmit({
        itemData: { removalReason: undefined },
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
