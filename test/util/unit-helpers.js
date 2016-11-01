import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import jsdom from 'jsdom';
import polyfillDataset from 'element-dataset';

chai.use(chaiAsPromised);

const expect = chai.expect;

function setupJSDom() {
  // setup the simplest document possible
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

  // get the window object out of the document
  const win = doc.defaultView;

  global.document = doc;
  global.window = win;
  global.navigator = win.navigator;

  polyfillDataset();
}

export { chai, expect, setupJSDom };
