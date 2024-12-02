import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationPrintView from '../../../../components/ConfirmationPage/ConfirmationPrintView';
import { normalizeFullName } from '../../../../utils/helpers/general';
import content from '../../../../locales/en/content.json';

describe('ezr <ConfirmationPrintView>', () => {
  const defaultProps = {
    name: normalizeFullName(
      { first: 'John', middle: 'David', last: 'Smith' },
      true,
    ),
    timestamp: undefined,
  };

  describe('when the component renders', () => {
    context('default behavior', () => {
      it('should render logo, title and applicant name', () => {
        const { container } = render(
          <ConfirmationPrintView {...defaultProps} />,
        );
        const selectors = {
          image: container.querySelector('.vagov-logo'),
          title: container.querySelector('h1'),
          subtitles: container.querySelectorAll('h2'),
          veteranName: container.querySelector('.ezr-veteran-fullname'),
        };
        expect(selectors.image).to.exist;
        expect(selectors.title).to.contain.text(content['form-title']);
        expect(selectors.subtitles).to.have.lengthOf(2);
        expect(selectors.veteranName).to.contain.text('John David Smith');
      });
    });

    context('when timestamp is not provided', () => {
      it('should not render timestamp in `application information` section', () => {
        const { container } = render(
          <ConfirmationPrintView {...defaultProps} />,
        );
        const selector = container.querySelector('.ezr-application-date');
        expect(selector).to.not.exist;
      });
    });

    context('when timestamp is provided', () => {
      it('should render timestamp with the correct date format', () => {
        const props = { ...defaultProps, timestamp: 1666887649663 };
        const { container } = render(<ConfirmationPrintView {...props} />);
        const selector = container.querySelector('.ezr-application-date');
        expect(selector).to.exist;
        expect(selector).to.contain.text('Oct. 27, 2022');
      });
    });
  });
});
