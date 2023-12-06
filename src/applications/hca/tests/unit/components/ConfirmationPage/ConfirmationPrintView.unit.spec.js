import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationPrintView from '../../../../components/ConfirmationPage/ConfirmationPrintView';
import { normalizeFullName } from '../../../../utils/helpers';

describe('hca <ConfirmationPrintView>', () => {
  const getData = ({ timestamp = undefined }) => ({
    props: {
      name: normalizeFullName(
        { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
        true,
      ),
      timestamp,
    },
  });

  context('when the component renders without a timestamp', () => {
    const { props } = getData({});

    it('should render logo, title and applicant name', () => {
      const { container } = render(<ConfirmationPrintView {...props} />);
      const selectors = {
        image: container.querySelector('.vagov-logo'),
        title: container.querySelector('h1'),
        subtitles: container.querySelectorAll('h2'),
        veteranName: container.querySelector('.hca-veteran-fullname'),
      };
      expect(selectors.image).to.exist;
      expect(selectors.title).to.contain.text('Apply for health care');
      expect(selectors.subtitles).to.have.lengthOf(2);
      expect(selectors.veteranName).to.contain.text('John Marjorie Smith Sr.');
    });

    it('should not render timestamp in `application information` section', () => {
      const { container } = render(<ConfirmationPrintView {...props} />);
      const selector = container.querySelector('.hca-application-date');
      expect(selector).to.not.exist;
    });
  });

  context('when the component renders with a timestamp', () => {
    it('should render timestamp in `application information` section with the correct date format', () => {
      const { props } = getData({ timestamp: 1666887649663 });
      const { container } = render(<ConfirmationPrintView {...props} />);
      const selector = container.querySelector('.hca-application-date');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Oct. 27, 2022');
    });
  });
});
