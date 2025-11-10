import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import parentReasonToRemove from '../../../components/picklist/parentReasonToRemove';
import { labels } from '../../../components/picklist/utils';

import { createDoB } from '../../test-helpers';

describe('parentReasonToRemove', () => {
  const defaultData = {
    fullName: {
      first: 'PETER',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(82),
    relationshipToVeteran: 'Parent',
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
        <parentReasonToRemove.Component
          itemData={data}
          fullName="PETER FOSTER"
          firstName="PETER"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          returnToMainPage={returnToMainPage}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.contain('PETER FOSTER');

    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(labels.Parent.removalReason);
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
        labels.Parent.removalReasonError,
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
      detail: { value: 'parentOther' },
    });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  it('should return to main picklist page if parent is invalid', () => {
    const returnToMainPage = sinon.spy();
    renderComponent({ data: {}, returnToMainPage });
    expect(returnToMainPage.calledOnce).to.be.true;
  });

  context('parentReasonToRemove handlers', () => {
    const { handlers } = parentReasonToRemove;
    it('should return "parent-death" on goForward', () => {
      const itemData = {
        relationshipToVeteran: 'Parent',
        removalReason: 'parentDied',
      };
      expect(handlers.goForward({ itemData })).to.equal('parent-death');
    });

    it('should call goForward when reason to remove value is set on submit', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        itemData: {
          relationshipToVeteran: 'Parent',
          removalReason: 'parentOther',
        },
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });

    it('should not call goForward when reason to remove value is set on submit', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        itemData: { removalReason: undefined },
        goForward,
      });
      expect(goForward.calledOnce).to.be.false;
    });
  });
});
