import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import DisabilityConfirmation from '../../../../components/FormPages/DisabilityConfirmation';

describe('hca Disability Confirmation page', () => {
  const subject = ({ goForward = () => {} }) => {
    const props = { data: {}, goBack: () => {}, goForward };
    const { container } = render(<DisabilityConfirmation {...props} />);
    const selectors = () => ({
      vaAlert: container.querySelector('va-alert'),
      navBtns: container.querySelectorAll('.hca-button-progress'),
      continueBtn: container.querySelector('.usa-button-primary'),
    });
    return { container, selectors };
  };

  it('should render the page with content and navigation buttons', () => {
    const { selectors } = subject({});
    const { vaAlert, navBtns } = selectors();
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attr('status', 'info');
    expect(navBtns).to.have.lengthOf(2);
  });

  it('should call the `goForward` spy when the `Continue` button is clicked', () => {
    const goForwardSpy = sinon.spy();
    const { selectors } = subject({ goForward: goForwardSpy });
    const { continueBtn } = selectors();
    fireEvent.click(continueBtn);
    expect(goForwardSpy.called).to.be.true;
  });
});
