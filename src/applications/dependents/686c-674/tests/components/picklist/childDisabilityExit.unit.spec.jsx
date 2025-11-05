import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import childDisabilityExit from '../../../components/picklist/childDisabilityExit';

describe('childDisabilityExit', () => {
  const defaultData = {
    fullName: {
      first: 'PENNY',
      last: 'FOSTER',
    },
    dateOfBirth: '',
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
    isShowingExitLink = false,
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <childDisabilityExit.Component
          itemData={data}
          fullName="PENNY FOSTER"
          firstName="PENNY"
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
      'PENNY still qualifies as your dependent',
    );
    expect($$('p', container).length).to.equal(2);
    expect(childDisabilityExit.hasExitLink).to.be.true;
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

  context('childDisabilityExit handlers', () => {
    const { handlers } = childDisabilityExit;
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
