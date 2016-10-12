import React from 'react';
import moment from 'moment';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Folder } from '../../../src/js/messaging/containers/Folder';

const props = {
  folder: {
    attributes: {
      folderId: 0,
      name: 'Inbox'
    },
    messages: [],
    pagination: {
      currentPage: 0,
      perPage: 0,
      totalEntries: 0,
      totalPages: 0
    },
    persistFolder: 0
  },
  currentRange: '1 - 5',
  messageCount: 5,
  page: 1,
  totalPages: 1,
  isAdvancedVisible: false,
  searchDateRangeStart: moment(),
  searchDateRangeEnd: moment(),

  // No-op function to override dispatch
  dispatch: () => {}
};

describe('Folder', () => {
  const tree = SkinDeep.shallowRender(<Folder {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
