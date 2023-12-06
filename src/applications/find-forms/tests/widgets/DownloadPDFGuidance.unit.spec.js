import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import { expect } from 'chai';
import DownloadPDFGuidance from '../../widgets/createFindVaFormsPDFDownloadHelper/DownloadPDFGuidance';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

describe('DownloadPDFGuidance', () => {
  const insertSpy = sinon.spy();
  const removeSpy = sinon.spy();
  const clickSpy = sinon.spy();
  const removeChildSpy = sinon.spy();

  describe('if the feature flag is on', () => {
    let domStub;
    let reduxStore;

    before(() => {
      domStub = sinon.stub(ReactDOM, 'render').returns(<div />);

      reduxStore = {
        getState: () => {
          return {
            featureToggles: {
              [featureFlagNames.findFormsShowPdfModal]: true,
            },
          };
        },
      };
    });

    after(() => {
      domStub.restore();
    });

    it('should render the download pdf modal when everything is valid and retrieved', () => {
      DownloadPDFGuidance({
        downloadUrl: 'https://test.com',
        form: {},
        formNumber: 10109,
        formPdfIsValid: true,
        formPdfUrlIsValid: true,
        link: {
          parentNode: {
            insertBefore: insertSpy,
          },
          removeEventListener: removeSpy,
          click: clickSpy,
        },
        listenerFunction: () => {},
        netWorkRequestError: null,
        reduxStore,
      });

      expect(domStub.called).to.be.true;
    });
  });

  describe('if the feature flag is off', () => {
    describe('if the PDF is valid', () => {
      it('should not render the PDF', () => {
        DownloadPDFGuidance({
          downloadUrl: 'https://test.com',
          form: {},
          formNumber: 10109,
          formPdfIsValid: true,
          formPdfUrlIsValid: true,
          link: {
            parentNode: {
              insertBefore: insertSpy,
              removeChild: removeChildSpy,
            },
            removeEventListener: removeSpy,
            click: clickSpy,
          },
          listenerFunction: () => {},
          netWorkRequestError: null,
          reduxStore: {},
        });

        expect(removeSpy.called).to.be.true;
        expect(clickSpy.called).to.be.true;
      });
    });

    describe('if the PDF is not valid', () => {
      it('should not render the PDF', () => {
        DownloadPDFGuidance({
          downloadUrl: 'https://test.com',
          form: {},
          formNumber: 10109,
          formPdfIsValid: false,
          formPdfUrlIsValid: false,
          link: {
            parentNode: {
              insertBefore: insertSpy,
              removeChild: removeChildSpy,
            },
            removeEventListener: removeSpy,
            click: clickSpy,
          },
          listenerFunction: () => {},
          netWorkRequestError: null,
          reduxStore: {},
        });

        expect(insertSpy.called).to.be.true;
        expect(removeChildSpy.called).to.be.true;
      });
    });

    describe('if the PDF is not valid', () => {
      it('should not render the PDF', () => {
        DownloadPDFGuidance({
          downloadUrl: 'https://test.com',
          form: {},
          formNumber: 10109,
          formPdfIsValid: true,
          formPdfUrlIsValid: false,
          link: {
            parentNode: {
              insertBefore: insertSpy,
              removeChild: removeChildSpy,
            },
            removeEventListener: removeSpy,
            click: clickSpy,
          },
          listenerFunction: () => {},
          netWorkRequestError: null,
          reduxStore: {},
        });

        expect(insertSpy.called).to.be.true;
        expect(removeChildSpy.called).to.be.true;
      });
    });

    describe('if there is a network error', () => {
      it('should not render the PDF', () => {
        DownloadPDFGuidance({
          downloadUrl: 'https://test.com',
          form: {},
          formNumber: 10109,
          formPdfIsValid: true,
          formPdfUrlIsValid: true,
          link: {
            parentNode: {
              insertBefore: insertSpy,
              removeChild: removeChildSpy,
            },
            removeEventListener: removeSpy,
            click: clickSpy,
          },
          listenerFunction: () => {},
          netWorkRequestError: true,
          reduxStore: {},
        });

        expect(insertSpy.called).to.be.true;
        expect(removeChildSpy.called).to.be.true;
      });
    });
  });
});
