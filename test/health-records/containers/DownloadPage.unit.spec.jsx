import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DownloadPage } from '../../../src/js/health-records/containers/DownloadPage';

const props = () => {
  return {
    refresh: {
      statuses: {
        failed: [],
        incomplete: [],
        successful: [],
      }
    },
    form: {
      requestDate: new Date().toISOString(),
      ready: true,
    }
  };
};

describe('<DownloadPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DownloadPage {...props()}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should render success state correctly', () => {
    const tree = SkinDeep.shallowRender(<DownloadPage {...props()}/>);
    const alertBox = tree.subTree('AlertBox');
    expect(alertBox).to.be.ok;
    expect(alertBox.props.status).to.equal('success');
  });

  it('should render refresh error correctly', () => {
    const errorProps = Object.assign({}, props());
    errorProps.refresh.statuses.failed.push({ id: 0 });
    const tree = SkinDeep.shallowRender(<DownloadPage {...errorProps}/>);
    const alertBox = tree.subTree('AlertBox');
    expect(alertBox).to.be.ok;
    expect(alertBox.props.status).to.equal('warning');
  });

  it('should render report generation error correctly', () => {
    const errorProps = Object.assign({}, props());
    errorProps.form.ready = false;
    const tree = SkinDeep.shallowRender(<DownloadPage {...errorProps}/>);
    const alertBox = tree.subTree('AlertBox');
    expect(alertBox).to.be.ok;
    expect(alertBox.props.status).to.equal('error');
  });

  it('should render skipped update warning corrserectly', () => {
    const errorProps = Object.assign({}, props());
    errorProps.form.ready = true;
    errorProps.refresh.statuses.incomplete.push({ id: 0 });
    const tree = SkinDeep.shallowRender(<DownloadPage {...errorProps}/>);
    const alertBox = tree.subTree('AlertBox');
    expect(alertBox).to.be.ok;
    expect(alertBox.props.status).to.equal('warning');
  });
});
