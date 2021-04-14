import { expect } from 'chai';
import sinon from 'sinon';

import { openPdfInNewWindow } from '../../utils';

describe('health care questionnaire -- utils -- print pdf -- browser methods are called -- ', () => {
  describe('params are valid --', () => {
    it('window is undefined', () => {
      const window = undefined;
      expect(() => openPdfInNewWindow(window)).to.throw(TypeError, /window/);
    });
    it('window is missing document', () => {
      const window = {};
      expect(() => openPdfInNewWindow(window)).to.throw(
        TypeError,
        /window.document/,
      );
    });

    it('blob is undefined', () => {
      const window = { document: {}, URL: {} };
      const blob = undefined;
      expect(() => openPdfInNewWindow(window, blob)).to.throw(
        TypeError,
        /blob/,
      );
    });
  });
  describe('ie', () => {
    it('uses msSaveOrOpenBlob', () => {
      const msSaveOrOpenBlob = sinon.spy();
      const window = {
        document: {},
        navigator: {
          msSaveOrOpenBlob,
        },
      };
      const blob = 'hello';
      openPdfInNewWindow(window, blob);
      expect(msSaveOrOpenBlob.called).to.be.true;
      expect(msSaveOrOpenBlob.calledWith(blob, 'Questionnaire Response.pdf')).to
        .be.true;
    });
  });
  describe('download logic', () => {
    it('happy path', () => {
      const blob = 'hello, there';
      const createObjectURL = sinon.stub().returns('blob:http://blob.url');
      const revokeObjectURL = sinon.spy();
      const click = sinon.spy();
      const appendChild = sinon.spy();
      const removeChild = sinon.spy();

      const window = {
        document: {
          body: {
            appendChild,
            removeChild,
          },
          createElement: () => {
            return {
              href: '',
              target: '',
              click,
            };
          },
        },
        URL: {
          createObjectURL,
          revokeObjectURL,
        },
      };

      openPdfInNewWindow(window, blob);

      // url is created
      expect(createObjectURL.called).to.be.true;
      expect(
        createObjectURL.calledWith(blob, {
          type: 'application/pdf',
        }),
      );

      // that url is revoked
      expect(revokeObjectURL.called).to.be.true;

      // the a is added/removed from DOM
      expect(appendChild.called).to.be.true;
      expect(removeChild.called).to.be.true;

      // that an tag gets created with the details
      const anchor = appendChild.args[0][0];
      expect(anchor.href).to.equal('blob:http://blob.url');
      // that the a is clicked
      expect(click.called).to.be.true;
    });
  });
  describe('mobile safari', () => {
    it('happy path', () => {
      const blob = 'hello, there';
      const createObjectURL = sinon.stub().returns('blob:http://blob.url');
      const revokeObjectURL = sinon.spy();
      const click = sinon.spy();
      const appendChild = sinon.spy();
      const removeChild = sinon.spy();
      const newWindow = {
        location: {
          href: '',
        },
      };
      const open = sinon.stub().returns(newWindow);
      const window = {
        navigator: {
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        },
        open,
        document: {
          body: {
            appendChild,
            removeChild,
          },
          createElement: () => {
            return {
              href: '',
              target: '',
              click,
            };
          },
        },
        URL: {
          createObjectURL,
          revokeObjectURL,
        },
      };

      openPdfInNewWindow(window, blob);

      // url is created
      expect(createObjectURL.called).to.be.true;
      expect(
        createObjectURL.calledWith(blob, {
          type: 'application/pdf',
        }),
      );

      // that url is revoked
      expect(revokeObjectURL.called).to.be.true;

      // the a is added/removed from DOM
      expect(appendChild.called).to.be.true;
      expect(removeChild.called).to.be.true;

      // that an tag gets created with the details
      const anchor = appendChild.args[0][0];
      expect(anchor.href).to.equal('blob:http://blob.url');
      // that the a is clicked
      expect(click.called).to.be.true;

      expect(newWindow.location.href).to.equal('blob:http://blob.url');
    });
  });
  describe('uses which URL', () => {
    it('window uses URL', () => {});
    it('window uses webkitURL', () => {});
  });
});
