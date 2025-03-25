import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
<<<<<<< HEAD
=======
import { Provider } from 'react-redux';
import { createStore } from 'redux';
>>>>>>> main
import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import { normalizeFullName } from '../../../../utils/helpers';

describe('hca <ConfirmationScreenView>', () => {
<<<<<<< HEAD
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
        subtitles: container.querySelectorAll('h2, h3'),
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
=======
  const getProps = ({ timestamp = undefined }) => ({
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
  });

  const subject = (props = getProps({}), featureToggles = {}) => {
    const getStore = () =>
      createStore(() => ({
        featureToggles,
        form: {
          data: {
            'view:veteranInformation': {
              veteranFullName: { first: 'John', last: 'Smith' },
            },
          },
        },
      }));
    const { container } = render(
      <Provider store={getStore()}>
        <ConfirmationScreenView {...props} />
      </Provider>,
    );
    const selectors = () => ({
      subtitles: container.querySelectorAll('h2, h3'),
      veteranName: container.querySelector('.hca-veteran-fullname'),
      timestamp: container.querySelector('.hca-application-date'),
      printBtn: container.querySelector('va-button'),
      downloadLink: container.querySelector('.hca-application--download'),
    });
    return { selectors };
  };

  context('when the component renders without a timestamp', () => {
    it('should render subtitles and applicant name', () => {
      const { selectors } = subject();
      const { subtitles, veteranName } = selectors();
      expect(subtitles).to.have.lengthOf(2);
      expect(subtitles[0]).to.contain.text(
        'Thank you for completing your application for health care',
      );
      expect(subtitles[1]).to.contain.text('Your application information');
      expect(veteranName).to.contain.text('John Marjorie Smith Sr.');
    });

    it('should render application print button', () => {
      const { selectors } = subject();
      const { printBtn } = selectors();
      expect(printBtn).to.exist;
      expect(printBtn).to.have.attribute('text', 'Print this page');
    });

    it('should not render timestamp in `application information` section', () => {
      const { selectors } = subject();
      const { timestamp } = selectors();
      expect(timestamp).to.not.exist;
>>>>>>> main
    });
  });

  context('when the component renders with a timestamp', () => {
    it('should render timestamp with the correct date format', () => {
<<<<<<< HEAD
      const { props } = getData({ timestamp: 1666887649663 });
      const { container } = render(<ConfirmationScreenView {...props} />);
      const selector = container.querySelector('.hca-application-date');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Oct. 27, 2022');
=======
      const { selectors } = subject(getProps({ timestamp: 1666887649663 }));
      const { timestamp } = selectors();

      expect(timestamp).to.exist;
      expect(timestamp).to.contain.text('Oct. 27, 2022');
>>>>>>> main
    });
  });

  context('when `print` button is clicked', () => {
    it('should render timestamp with the correct date format', () => {
<<<<<<< HEAD
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
=======
      const { selectors } = subject(getProps({ timestamp: 1666887649663 }));
      const { printBtn } = selectors();
      const printSpy = sinon.spy(window, 'print');

      fireEvent.click(printBtn);
      expect(printSpy.called).to.be.true;
    });
  });

  context('download pdf button', () => {
    it('should render when `hca_download_completed_pdf` is true', () => {
      const { selectors } = subject(undefined, {
        // eslint-disable-next-line camelcase
        hca_download_completed_pdf: true,
      });
      const { downloadLink } = selectors();
      expect(downloadLink).to.exist;
    });

    it('should not render when `hca_download_completed_pdf` is false', () => {
      const { selectors } = subject(undefined, {
        // eslint-disable-next-line camelcase
        hca_download_completed_pdf: false,
      });
      const { downloadLink } = selectors();
      expect(downloadLink).not.exist;
    });
  });
>>>>>>> main
});
