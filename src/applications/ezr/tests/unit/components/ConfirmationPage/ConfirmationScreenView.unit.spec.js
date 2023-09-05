import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import { normalizeFullName } from '../../../../utils/helpers/general';
import content from '../../../../locales/en/content.json';

describe('ezr <ConfirmationScreenView>', () => {
  const defaultProps = {
    name: normalizeFullName(
      { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      true,
    ),
    form: {
      submission: {
        response: undefined,
        timestamp: undefined,
      },
      data: { veteranFullName: {} },
    },
    timestamp: undefined,
  };

  describe('when the component renders', () => {
    describe('default behavior', () => {
      it('should render section titles and applicant name', () => {
        const { container } = render(
          <ConfirmationScreenView {...defaultProps} />,
        );
        const selectors = {
          subtitles: container.querySelectorAll('h2'),
          veteranName: container.querySelector('.ezr-veteran-fullname'),
        };
        expect(selectors.subtitles).to.have.lengthOf(2);
        expect(selectors.subtitles[0]).to.contain.text(
          content['confirm-page-title'],
        );
        expect(selectors.subtitles[1]).to.contain.text(
          content['confirm-app-title'],
        );
        expect(selectors.veteranName).to.contain.text(
          'John Marjorie Smith Sr.',
        );
      });

      it('should render application print button', () => {
        const { container } = render(
          <ConfirmationScreenView {...defaultProps} />,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-print-button"]',
        );
        expect(selector).to.exist;
        expect(selector).to.have.attribute('text', content['button-print']);
      });
    });

    describe('when timestamp is not provided', () => {
      it('should not render application date', () => {
        const { container } = render(
          <ConfirmationScreenView {...defaultProps} />,
        );
        const selector = container.querySelector('.ezr-application-date');
        expect(selector).to.not.exist;
      });
    });

    describe('when timestamp is provided', () => {
      it('should render application date with the correct date format', () => {
        const props = { ...defaultProps, timestamp: 1666887649663 };
        const { container } = render(<ConfirmationScreenView {...props} />);
        const selector = container.querySelector('.ezr-application-date');
        expect(selector).to.exist;
        expect(selector).to.contain.text('Oct. 27, 2022');
      });
    });
  });

  describe('when the print button is clicked', () => {
    it('should fire `window.print` function', () => {
      const printSpy = sinon.spy(window, 'print');
      const { container } = render(
        <ConfirmationScreenView {...defaultProps} />,
      );
      const selector = container.querySelector(
        '[data-testid="ezr-print-button"]',
      );
      fireEvent.click(selector);
      expect(printSpy.called).to.be.true;
    });
  });
});
