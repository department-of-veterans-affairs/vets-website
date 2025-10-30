import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

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
        />
      </form>,
    );

  it('should render', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.equal('Changes to PETER');

    const info = $('va-additional-info', container);
    expect(info).to.exist;
    expect(info.getAttribute('trigger')).to.equal(
      'Why can I only remove a parent dependent if they have died?',
    );

    const exitLink = $('va-link-action', container);
    expect(exitLink).to.exist;
    expect(exitLink.getAttribute('text')).to.equal('Exit application');
    expect(exitLink.getAttribute('href')).to.equal('/manage-dependents/view');
  });

  it('should render edit text in header', () => {
    const { container } = renderComponent({ isEditing: true });

    expect($('h3', container).textContent).to.equal('Edit changes to PETER');
  });

  it('should not go forward when form is submitted', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({ goForward });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(goForward.called).to.be.false;
    });
  });

  context('parentOtherExit handlers', () => {
    const { handlers } = parentOtherExit;
    it('should return "DONE" on goForward', () => {
      expect(handlers.goForward()).to.equal('DONE');
    });

    it('should not call goForward when page is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
      });
      expect(goForward.called).to.be.false;
    });
  });
});
