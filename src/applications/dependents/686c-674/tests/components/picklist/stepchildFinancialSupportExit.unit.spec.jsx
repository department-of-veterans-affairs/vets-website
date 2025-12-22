import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

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
    isShowingExitLink = false,
  } = {}) =>
    render(
      <form onSubmit={onSubmit}>
        <stepchildFinancialSupportExit.Component
          itemData={data}
          fullName="NAOMI FOSTER"
          firstName="NAOMI"
          formSubmitted={formSubmitted}
          handlers={{ goForward, goBack, onChange, onSubmit }}
          isShowingExitLink={isShowingExitLink}
        />
      </form>,
    );

  it('should have "hasExitLink" set to true', () => {
    const { container } = renderComponent({ isShowingExitLink: true });

    expect(stepchildFinancialSupportExit.hasExitLink).to.be.true;
    const paragraphs = $$('p', container);
    expect(paragraphs.length).to.equal(3);
    expect(paragraphs[2].textContent).to.equal(
      'If you exit now, we’ll cancel the application you started.',
    );
  });

  it('should render with correct title', () => {
    const { container } = renderComponent();

    expect($('h3', container).textContent).to.equal(
      'NAOMI still qualifies as your dependent',
    );
  });

  it('should display message about financial support', () => {
    const { container } = renderComponent();
    const paragraphs = container.querySelectorAll('p');

    expect(paragraphs.length).to.be.at.least(2);
    expect(paragraphs[0].textContent).to.include(
      'Because you provide at least half of NAOMI',
    );
    expect(paragraphs[0].textContent).to.include('is an eligible dependent');
    expect(paragraphs[1].textContent).to.include(
      'NAOMI will remain on your benefits',
    );
    expect($$('.dd-privacy-mask', container).length).to.equal(3);
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

    it('should call goForward when page is submitted', () => {
      const goForward = sinon.spy();
      handlers.onSubmit({
        goForward,
      });
      expect(goForward.called).to.be.true;
    });
  });
});
