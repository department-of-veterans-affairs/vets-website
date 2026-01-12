import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import parentOtherExit from '../../../components/picklist/parentOtherExit';

describe('parentOtherExit', () => {
  const defaultData = {
    fullName: {
      first: 'PETER',
      last: 'FOSTER',
    },
    dateOfBirth: '',
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
    isEditing = false,
    isShowingExitLink = false,
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <parentOtherExit.Component
          itemData={data}
          fullName="PETER FOSTER"
          firstName="PETER"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          isEditing={isEditing}
          isShowingExitLink={isShowingExitLink}
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.equal(
      'You can’t use this form to remove PETER',
    );

    expect($$('p', container).length).to.equal(2);

    const info = $('va-additional-info', container);
    expect(info).to.exist;
    expect(info.getAttribute('trigger')).to.equal(
      'How can I remove a dependent parent for reasons other than death?',
    );

    expect(parentOtherExit.hasExitLink).to.be.true;
  });

  it('should render exit message paragraph', () => {
    const { container } = renderComponent({ isShowingExitLink: true });

    expect($$('p', container).length).to.equal(3);
  });

  it('should go forward when form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({ onSubmit });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('parentOtherExit handlers', () => {
    const { handlers } = parentOtherExit;
    it('should return "DONE" on goForward', () => {
      expect(handlers.goForward()).to.equal('DONE');
    });

    it('should call goForward when page is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
      });
      expect(goForward.called).to.be.true;
    });
  });
});
