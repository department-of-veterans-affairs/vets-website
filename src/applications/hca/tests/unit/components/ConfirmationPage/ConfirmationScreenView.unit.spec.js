import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import { normalizeFullName } from '../../../../utils/helpers';

describe('hca <ConfirmationScreenView>', () => {
  const getData = ({ timestamp = undefined }) => ({
    props: {
      name: normalizeFullName(
        { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
        true,
      ),
      form: {
        submission: {
          response: undefined,
          timestamp,
        },
        data: { veteranFullName: {} },
      },
      timestamp,
    },
  });

  context('when the component renders without a timestamp', () => {
    const { props } = getData({});

    it('should render subtitles and applicant name', () => {
      const { container } = render(<ConfirmationScreenView {...props} />);
      const selectors = {
        subtitles: container.querySelectorAll('h2'),
        veteranName: container.querySelector('.hca-veteran-fullname'),
      };
      expect(selectors.subtitles).to.have.lengthOf(2);
      expect(selectors.subtitles[0]).to.contain.text(
        'Thank you for completing your application for health care',
      );
      expect(selectors.subtitles[1]).to.contain.text(
        'Your application information',
      );
      expect(selectors.veteranName).to.contain.text('John Marjorie Smith Sr.');
    });

    it('should render application print button', () => {
      const { container } = render(<ConfirmationScreenView {...props} />);
      const selector = container.querySelector('va-button');
      expect(selector).to.exist;
      expect(selector).to.have.attribute('text', 'Print this page');
    });

    it('should not render timestamp in `application information` section', () => {
      const { container } = render(<ConfirmationScreenView {...props} />);
      const selector = container.querySelector('.hca-application-date');
      expect(selector).to.not.exist;
    });
  });

  context('when the component renders with a timestamp', () => {
    it('should render timestamp with the correct date format', () => {
      const { props } = getData({ timestamp: 1666887649663 });
      const { container } = render(<ConfirmationScreenView {...props} />);
      const selector = container.querySelector('.hca-application-date');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Oct. 27, 2022');
    });
  });

  context('when `print` button is clicked', () => {
    it('should render timestamp with the correct date format', () => {
      const { props } = getData({ timestamp: 1666887649663 });
      const { container } = render(<ConfirmationScreenView {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-print-button"]',
      );
      const printSpy = sinon.spy(window, 'print');

      fireEvent.click(selector);
      expect(printSpy.called).to.be.true;
    });
  });
});
