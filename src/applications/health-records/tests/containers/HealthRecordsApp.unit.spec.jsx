import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { HealthRecordsApp } from '../../containers/HealthRecordsApp';

const location = {
  pathname: '/',
  search: '',
  hash: '',
  action: 'POP',
  key: null,
  basename: '/health-care/health-records',
  query: {}
};

const props = {
  modal: {
    content: '',
    title: '',
    visible: false
  },
  closeModal: () => {},
  profile: {
    healthTermsCurrent: true
  }
};

describe('<HealthRecordsApp>', () => {
  const tree = SkinDeep.shallowRender(<HealthRecordsApp location={location} {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
