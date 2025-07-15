import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from '../../config/helpers';
import ProgressButton from '../../../src/js/components/ProgressButton';
import { $, $$ } from '../../../src/js/utilities/ui';

describe('<ProgressButton>', () => {
  context('React component', () => {
    it('should render with button text', () => {
      const { container } = render(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
        />,
      );
      expect($('button', container).textContent).to.equal('Button text');
      expect($$('button', container)).to.have.length.of(1);
    });

    it('calls handle() on click', () => {
      const clickSpy = sinon.spy();

      const { container } = render(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
          onButtonClick={clickSpy}
        />,
      );

      fireEvent.click($('button', container));
      expect(clickSpy.calledOnce).to.be.true;
    });

    it('calls handle() on click even if mouseDown happens', () => {
      const blurSpy = sinon.spy();
      const clickSpy = sinon.spy();

      const { container } = render(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
          onButtonClick={clickSpy}
          preventOnBlur={blurSpy}
        />,
      );

      const button = $('button', container);

      fireEvent.mouseDown(button);
      fireEvent.click(button);

      expect(blurSpy.calledOnce).to.be.true;
      expect(clickSpy.calledOnce).to.be.true;
    });

    it('calls preventDefault() on mouseDown event when providing prop', () => {
      const blurSpy = sinon.spy();

      const { container } = render(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
          preventOnBlur={blurSpy}
        />,
      );

      const button = $('button', container);
      fireEvent.mouseDown(button);
      expect(blurSpy.calledOnce).to.be.true;
    });

    it('calls preventDefault() on mouseDown event with defaultProperty', () => {
      const blurSpy = sinon.spy();

      ProgressButton.defaultProps = {
        preventOnBlur: blurSpy,
      };

      const { container } = render(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
        />,
      );

      const button = $('button', container);
      fireEvent.mouseDown(button);
      expect(blurSpy.calledOnce).to.be.true;

      ProgressButton.defaultProps = {
        preventOnBlur: e => {
          e.preventDefault();
        },
      };
    });

    it('should pass aXe check when enabled', () =>
      axeCheck(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
        />,
      ));

    it('should pass aXe check when disabled', () =>
      axeCheck(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled
        />,
      ));
  });

  context('Web component', () => {
    it('should render with button text', () => {
      const { container } = render(
        <ProgressButton
          ariaDescribedBy="Description for button text"
          ariaLabel="Specific label for button text"
          buttonText="Button text"
          buttonClass="usa-button-secondary"
          disabled={false}
          useWebComponents
        />,
      );
      const button = $('va-button', container);

      expect(button.getAttribute('text')).to.eq('Button text');
      expect(button.getAttribute('full-width')).to.eq('true');
      expect(button.getAttribute('class')).to.eq('');
      expect(button.getAttribute('disabled')).to.eq(null);
      expect(button.getAttribute('secondary')).to.eq('true');
      expect(button.getAttribute('back')).to.eq(null);
      expect(button.getAttribute('continue')).to.eq(null);
      expect(button.getAttribute('label')).to.eq(
        'Specific label for button text',
      );
      expect(button.getAttribute('message-aria-describedby')).to.eq(
        'Description for button text',
      );
      expect($$('va-button, button', container)).to.have.length.of(1);
    });

    it('renders back button', () => {
      const { container } = render(
        <div>
          <ProgressButton
            beforeText="«"
            buttonText="Back"
            buttonClass="usa-button-secondary vads-u-width--full"
            useWebComponents
          />
        </div>,
      );

      const button = $('va-button', container);

      expect(button.getAttribute('class')).to.eq('');
      expect(button.getAttribute('back')).to.eq('true');
      expect(button.getAttribute('continue')).to.eq(null);
      expect(button.getAttribute('secondary')).to.eq('true');
      expect(button.getAttribute('full-width')).to.eq('true');
    });

    it('renders continue button', () => {
      const { container } = render(
        <div>
          <ProgressButton
            afterText="»"
            buttonText="Continue"
            buttonClass="usa-button-primary"
            useWebComponents
          />
        </div>,
      );

      const button = $('va-button', container);

      expect(button.getAttribute('class')).to.eq('');
      expect(button.getAttribute('back')).to.eq(null);
      expect(button.getAttribute('continue')).to.eq('true');
    });

    it('calls handle() on click', () => {
      const clickSpy = sinon.spy();

      const { container } = render(
        <div>
          <ProgressButton
            buttonText="Button text"
            buttonClass="usa-button-primary"
            disabled={false}
            onButtonClick={clickSpy}
            useWebComponents
          />
        </div>,
      );

      const button = $('va-button', container);

      fireEvent.click(button);
      expect(button.getAttribute('secondary')).to.eq(null);
      expect(clickSpy.calledOnce).to.be.true;
    });

    it('should pass aXe check when enabled', () =>
      axeCheck(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled={false}
          useWebComponents
        />,
      ));

    it('should pass aXe check when disabled', () =>
      axeCheck(
        <ProgressButton
          buttonText="Button text"
          buttonClass="usa-button-primary"
          disabled
          useWebComponents
        />,
      ));
  });
});
