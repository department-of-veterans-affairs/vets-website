import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { makeField } from '../../../src/js/common/model/fields';
import MessageSearch from '../../../src/js/messaging/components/MessageSearch';

const props = {
  isAdvancedVisible: false,
  params: {
    dateRange: {
      start: null,
      end: null
    },
    term: makeField(''),
    from: makeField(''),
    subject: makeField('')
  },
  onAdvancedSearch: () => {},
  onError: () => {},
  onFieldChange: () => {},
  onDateChange: () => {},
  onSubmit: () => {}
};

describe('MessageSearch', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<MessageSearch {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should show basic search', () => {
    const tree = SkinDeep.shallowRender(<MessageSearch {...props }/>);
    expect(tree.subTree('.msg-search-simple-wrap')).to.not.be.false;
  });

  it('should not show basic search when showing advanced search', () => {
    const tree = SkinDeep.shallowRender(
      <MessageSearch {...props } isAdvancedVisible={true}/>
    );
    expect(tree.subTree('.msg-search-simple-wrap')).to.be.false;
  });
});

