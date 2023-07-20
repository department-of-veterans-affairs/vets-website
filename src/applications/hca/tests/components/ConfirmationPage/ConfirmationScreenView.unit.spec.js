import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationScreenView from '../../../components/ConfirmationPage/ConfirmationScreenView';
import { normalizeFullName } from '../../../utils/helpers';

describe('hca <ConfirmationScreenView>', () => {
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
    it('should render subtitles and applicant name', () => {
      const { container } = render(
        <ConfirmationScreenView {...defaultProps} />,
      );
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
      const { container } = render(
        <ConfirmationScreenView {...defaultProps} />,
      );
      const selector = container.querySelector('va-button');
      expect(selector).to.exist;
      expect(selector).to.have.attribute('text', 'Print this page');
    });
  });

  describe('when timestamp is not provided', () => {
    it('should not render timestamp in `application information` section', () => {
      const { container } = render(
        <ConfirmationScreenView {...defaultProps} />,
      );
      const selector = container.querySelector('.hca-application-date');
      expect(selector).to.not.exist;
    });
  });

  describe('when timestamp is provided', () => {
    it('should render timestamp with the correct date format', () => {
      const props = { ...defaultProps, timestamp: 1666887649663 };
      const { container } = render(<ConfirmationScreenView {...props} />);
      const selector = container.querySelector('.hca-application-date');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Oct. 27, 2022');
    });
  });
});
