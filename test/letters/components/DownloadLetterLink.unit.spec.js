import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { DownloadLetterLink } from '../../../src/js/letters/components/DownloadLetterLink.jsx';

const defaultProps = {
  letterName: 'Commissary Letter',
  letterType: 'commissary'
};

let oldWindow;
let oldFetch;

// TODO: fix this warning and improve test coverage for various scenarios:
//   UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1):
//   TypeError: Cannot read property 'ok' of undefined"

const setup = () => {
  oldFetch = global.fetch;
  oldWindow = global.window;
  global.fetch = sinon.spy(() => {
    return Promise.resolve();
  });
  global.window = {
    navigator: {},
    open: sinon.spy(),
    dataLayer: [],
    URL: {
      revokeObjectURL: () => {}
    }
  };
  global.sessionStorage = {
    userToken: 'abc'
  };
};

const teardown = () => {
  global.window = oldWindow;
  global.fetch = oldFetch;
};


describe('<DownloadLetterLink>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetterLink {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should render Link component', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetterLink {...defaultProps}/>);
    expect(tree.subTree('Link')).to.exist;
  });

  it('should show download button', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetterLink {...defaultProps}/>);
    expect(tree.dive(['.usa-button-primary']).text()).to.equal('Download Letter');
  });

  it('should call download function on click', () => {
    setup();
    const tree = SkinDeep.shallowRender(<DownloadLetterLink {...defaultProps}/>);
    const link = tree.subTree('Link');
    link.props.onClick({
      preventDefault() {}
    });
    expect(global.fetch.args[0][0]).to.contain('/v0/letters/');
    teardown();
  });
});
