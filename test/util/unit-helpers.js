import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import jsdom from 'jsdom';
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
}

/**
 * Convert data-attr into key
 * data-foo-bar -> fooBar
 * @param {String} val
 * @returns {String}
 */
const _attrToDataKey = function attrToDataKeyFn(val) {
  const out = val.substr(5);
  return out.split('-').map((part, inx) => {
    if (!inx) {
      return part;
    }
    return part.charAt(0).toUpperCase() + part.substr(1);
  }).join('');
};

let _datasetProxy = null;

 /**
 * Produce dataset object emulating behavior of el.dataset
 * @param {Element} el
 * @returns {Object}
 */
const _getNodeDataAttrs = function getNodeDataAttrsFn(el) {
  let i = 0;
  const atts = el.attributes;
  const len = atts.length;
  let attr;
  const _datasetMap = [];
  // represents el.dataset
  const proxy = {};
  let datakey;

  for (i = 0; i < len; i++) {
    attr = atts[i].nodeName;
    if (attr.indexOf('data-') === 0) {
      datakey = _attrToDataKey(attr);
      if (typeof _datasetMap[datakey] !== 'undefined') {
        break;
      }
      _datasetMap[datakey] = atts[i].nodeValue;
      /* eslint-disable no-loop-func */
      Object.defineProperty(proxy, datakey, {
        enumerable: true,
        configurable: true,
        get() {
          return _datasetMap[datakey];
        },
        set(val) {
          _datasetMap[datakey] = val;
          el.setAttribute(attr, val);
        }
      });
      /* eslint-enable no-loop-func */
    }
  }
  return proxy;
};

Object.defineProperty(global.window.Element.prototype, 'dataset', {
  get() {
    _datasetProxy = _datasetProxy || _getNodeDataAttrs(this);
    return _datasetProxy;
  }
});

export { chai, expect, setupJSDom };
