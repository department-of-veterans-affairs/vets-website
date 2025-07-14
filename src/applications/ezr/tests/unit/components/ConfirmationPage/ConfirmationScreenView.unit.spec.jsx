import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import { normalizeFullName } from '../../../../utils/helpers/general';
import content from '../../../../locales/en/content.json';

describe('ezr <ConfirmationScreenView>', () => {
  const subject = (timestamp = undefined, additionalData = {}) => {
    const props = {
      name: normalizeFullName(
        { first: 'John', middle: 'David', last: 'Smith' },
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
    };
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            'view:veteranInformation': {
              veteranFullName: { first: 'John', last: 'Smith' },
            },
            ...additionalData,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationScreenView {...props} />
      </Provider>,
    );
    const selectors = () => ({
      subtitles: container.querySelectorAll('h2, h3'),
      veteranName: container.querySelector('.ezr-veteran-fullname'),
      applicationDate: container.querySelector('.ezr-submission-date'),
      downloadLink: container.querySelector('.ezr-application--download'),
      printBtn: container.querySelector('va-button'),
    });
    return { selectors };
  };

  describe('when the component renders', () => {
    context('default behavior', () => {
      it('should render section titles and applicant name', () => {
        const { selectors } = subject();
        const { subtitles, veteranName } = selectors();
        expect(subtitles).to.have.lengthOf(2);
        expect(subtitles[0]).to.contain.text(content['confirm-success-title']);
        expect(subtitles[1]).to.contain.text(content['confirm-app-title']);
        expect(veteranName).to.contain.text('John David Smith');
      });

      it('should render `print page` button', () => {
        const { selectors } = subject();
        const { printBtn } = selectors();
        expect(printBtn).to.exist;
        expect(printBtn).to.have.attribute('text', content['button-print']);
      });
    });

    context('when timestamp is not provided', () => {
      it('should not render application date', () => {
        const { selectors } = subject();
        const { applicationDate } = selectors();
        expect(applicationDate).to.not.exist;
      });
    });

    context('when timestamp is provided', () => {
      it('should render submission date with the correct date format', () => {
        const { selectors } = subject(1666887649663);
        const { applicationDate } = selectors();
        expect(applicationDate).to.exist;
        expect(applicationDate).to.contain.text('Oct. 27, 2022');
      });
    });

    context('when the ezrDownloadPdfEnabled feature toggle is enabled', () => {
      it('should render download pdf button', () => {
        /*
        We need to have all of the necessary data to supply to the submitTransformer
        as well as the data that is used to render the component
        */
        const { selectors } = subject(undefined, {
          'view:isDownloadPdfEnabled': true,
          veteranDateOfBirth: '1990-01-01',
          gender: 'M',
        });
        const { downloadLink } = selectors();
        expect(downloadLink).to.exist;
      });
    });

    context('when the ezrDownloadPdfEnabled feature toggle is disabled', () => {
      it('should not render download pdf button', () => {
        /*
        We need to have all of the necessary data to supply to the submitTransformer
        as well as the data that is used to render the component
        */
        const { selectors } = subject(undefined, {
          'view:isDownloadPdfEnabled': false,
          veteranDateOfBirth: '1990-01-01',
          gender: 'M',
        });
        const { downloadLink } = selectors();
        expect(downloadLink).to.not.exist;
      });
    });
  });

  describe('when the print button is clicked', () => {
    it('should fire `window.print` function', () => {
      const printSpy = sinon.spy();
      Object.defineProperty(window, 'print', {
        value: printSpy,
        configurable: true,
      });
      const { selectors } = subject();
      const { printBtn } = selectors();
      fireEvent.click(printBtn);
      expect(printSpy.called).to.be.true;
    });
  });
});
