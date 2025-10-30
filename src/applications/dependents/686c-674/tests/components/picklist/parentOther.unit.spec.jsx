import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import parentOther from '../../../components/picklist/parentOther';

describe('parentOther', () => {
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
        <parentOther.Component
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
  });

  it('should render edit text in header', () => {
    const { container } = renderComponent({ isEditing: true });

    expect($('h3', container).textContent).to.equal('Edit changes to PETER');
  });

  it('should go forward when form is submitted', async () => {
    const onSubmit = sinon.spy();
    const { container } = renderComponent({ onSubmit });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  context('parentOther handlers', () => {
    const { handlers } = parentOther;
    it('should return "DONE" on goForward', () => {
      expect(handlers.goForward()).to.equal('DONE');
    });

    it('should call goForward when page is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
      });
      expect(goForward.calledOnce).to.be.true;
    });
  });
});
