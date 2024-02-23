import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import { expect } from 'chai';
import DownloadPDFGuidance from '../../widgets/createFindVaFormsPDFDownloadHelper/DownloadPDFGuidance';

describe('DownloadPDFGuidance', () => {
  const insertSpy = sinon.spy();
  const clickSpy = sinon.spy();
  const removeChildSpy = sinon.spy();
  let domStub;

  before(() => {
    domStub = sinon.stub(ReactDOM, 'render').returns(<div />);
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
        click: clickSpy,
      },
      netWorkRequestError: null,
    });

    expect(domStub.called).to.be.true;
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
          click: clickSpy,
        },
        netWorkRequestError: null,
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
          click: clickSpy,
        },
        netWorkRequestError: null,
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
          click: clickSpy,
        },
        netWorkRequestError: true,
      });

      expect(insertSpy.called).to.be.true;
      expect(removeChildSpy.called).to.be.true;
    });
  });
});
