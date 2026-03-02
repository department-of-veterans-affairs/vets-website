import React from 'react';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ConfirmationScreenView from '../../../../components/ConfirmationPage/ConfirmationScreenView';
import { normalizeFullName } from '../../../../utils/helpers/general';
import content from '../../../../locales/en/content.json';
import { renderProviderWrappedComponent } from '../../../helpers';

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
      form: {
        data: {
          veteranDateOfBirth: '1990-01-01',
          gender: 'M',
          ...additionalData,
        },
        loadedData: {
          formData: {
            veteranDateOfBirth: '1990-01-01',
            gender: 'M',
          },
        },
      },
      user: {
        profile: {
          userFullName: { first: 'John', last: 'Smith' },
        },
      },
    };
    const { container } = renderProviderWrappedComponent(
      mockStore,
      <ConfirmationScreenView {...props} />,
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
