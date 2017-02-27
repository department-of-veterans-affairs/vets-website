import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DownloadPage } from '../../../src/js/health-records/containers/DownloadPage';

const props = {
  refresh: {
    statuses: {
      OK: [],
      ERROR: [],
    }
  }
};

describe('<DownloadPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DownloadPage {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should render success state correctly', () => {
    const tree = SkinDeep.shallowRender(<DownloadPage {...props}/>);
    const alertBox = tree.subTree('AlertBox');
    expect(alertBox).to.be.ok;
    expect(alertBox.props.status).to.equal('success');
  });

  it('should render error state correctly', () => {
    const errorProps = Object.assign({}, props);
    errorProps.refresh.statuses.ERROR.push({ id: 0 });
    const tree = SkinDeep.shallowRender(<DownloadPage {...errorProps}/>);
    const alertBox = tree.subTree('AlertBox');
    expect(alertBox).to.be.ok;
    expect(alertBox.props.status).to.equal('warning');
  });
});
