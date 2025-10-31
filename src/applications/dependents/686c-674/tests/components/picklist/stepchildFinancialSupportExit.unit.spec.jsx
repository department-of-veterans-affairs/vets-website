import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import stepchildFinancialSupportExit from '../../../components/picklist/stepchildFinancialSupportExit';

import { createDoB } from '../../test-helpers';

describe('stepchildFinancialSupportExit', () => {
  const defaultData = {
    fullName: {
      first: 'NAOMI',
      last: 'FOSTER',
    },
    dateOfBirth: createDoB(11),
    relationshipToVeteran: 'Child',
    isStepchild: 'Y',
    removalReason: 'stepchildNotMember',
    stepchildFinancialSupport: 'Y',
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
        <stepchildFinancialSupportExit.Component
          itemData={data}
          fullName="NAOMI FOSTER"
          firstName="NAOMI"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
        />
      </form>,
    );

  it('should render with correct title and message', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.equal(
      'NAOMI still qualifies as your dependent',
    );

    const exitLink = $('va-link-action', container);
    expect(exitLink).to.exist;
    expect(exitLink.getAttribute('text')).to.equal('Exit application');
    expect(exitLink.getAttribute('href')).to.equal('/manage-dependents/view');
  });

  it('should display message about financial support', () => {
    const { container } = renderComponent();
    const paragraphs = container.querySelectorAll('p');

    expect(paragraphs.length).to.be.at.least(3);
    expect(paragraphs[0].textContent).to.include(
      'Because you provide at least half of NAOMI',
    );
    expect(paragraphs[0].textContent).to.include('is an eligible dependent');
    expect(paragraphs[1].textContent).to.include(
      'NAOMI will remain on your benefits',
    );
  });

  it('should not go forward when form is submitted', async () => {
    const goForward = sinon.spy();
    const { container } = renderComponent({ goForward });

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(goForward.called).to.be.false;
    });
  });

  context('stepchildFinancialSupportExit handlers', () => {
    const { handlers } = stepchildFinancialSupportExit;

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
