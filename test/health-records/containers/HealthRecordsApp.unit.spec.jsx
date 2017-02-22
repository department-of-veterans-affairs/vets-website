import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { HealthRecordsApp } from '../../../src/js/health-records/containers/HealthRecordsApp';

const props = {
  modal: {
    content: '',
    title: '',
    visible: false
  },
  closeModal: () => {}
};

describe('<HealthRecordsApp>', () => {
  const tree = SkinDeep.shallowRender(<HealthRecordsApp {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
