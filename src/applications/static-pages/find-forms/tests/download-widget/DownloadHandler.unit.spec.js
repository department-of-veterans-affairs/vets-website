import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import { expect } from 'chai';
import { renderDownloadModal } from '../../download-widget';

describe('DownloadHandler', () => {
  const insertSpy = sinon.spy();
  const clickSpy = sinon.spy();
  let domStub;

  before(() => {
    domStub = sinon.stub(ReactDOM, 'render').returns(<div />);
  });

  after(() => {
    domStub.restore();
  });

  it('should render the download pdf modal when everything is valid and retrieved', () => {
    renderDownloadModal({
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
});
