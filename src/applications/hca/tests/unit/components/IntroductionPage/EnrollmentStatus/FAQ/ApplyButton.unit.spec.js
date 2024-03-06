import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ApplyButton from '../../../../../../components/IntroductionPage/EnrollmentStatus/FAQ/ApplyButton';

describe('hca <ApplyButton>', () => {
  const getData = ({
    label = 'Apply for VA health care',
    event = 'custom-event',
  }) => ({
    props: { label, event, clickEvent: sinon.spy() },
  });

  context('when the component renders', () => {
    it('should render with the correct label', () => {
      const { props } = getData({});
      const { container } = render(<ApplyButton {...props} />);
      const selector = container.querySelector('button');
      expect(selector).to.contain.text(props.label);
    });
  });

  context('when the button is clicked', () => {
    it('should fire the `clickEvent` spy', () => {
      const { props } = getData({});
      const { container } = render(<ApplyButton {...props} />);
      const selector = container.querySelector('button');

      fireEvent.click(selector);
      expect(props.clickEvent.called).to.be.true;
    });
  });
});
