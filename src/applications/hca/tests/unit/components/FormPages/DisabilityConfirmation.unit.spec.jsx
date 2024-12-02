import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DisabilityConfirmation from '../../../../components/FormPages/DisabilityConfirmation';

describe('hca Disability Confirmation page', () => {
  const getData = () => ({
    props: { data: {}, goBack: () => {}, goForward: sinon.spy() },
  });

  context('when the component renders', () => {
    const { props } = getData();

    it('should render `va-alert` with correct status', () => {
      const { container } = render(<DisabilityConfirmation {...props} />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'info');
    });

    it('should render navigation buttons', () => {
      const { container } = render(<DisabilityConfirmation {...props} />);
      expect(
        container.querySelectorAll('.hca-button-progress'),
      ).to.have.lengthOf(2);
    });
  });

  context('when the `Continue` button is clicked', () => {
    const { props } = getData();

    it('should call the `goForward` spy', () => {
      const { container } = render(<DisabilityConfirmation {...props} />);
      const selector = container.querySelector('.usa-button-primary');

      fireEvent.click(selector);
      expect(props.goForward.called).to.be.true;
    });
  });
});
