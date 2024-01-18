import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import FilesNeeded from '../../components/FilesNeeded';

describe('<FilesNeededOld>', () => {
  it('should render va-alert with item data', () => {
    const id = 1;
    const item = {
      displayName: 'Request 1',
      description: 'This is a alert',
      suspenseDate: '2024-12-01',
    };
    const tree = SkinDeep.shallowRender(<FilesNeeded id={id} item={item} />);

    expect(tree.everySubTree('.file-request-title')[0].text()).to.equal(
      item.displayName,
    );
    expect(tree.everySubTree('.submission-description')[0].text()).to.equal(
      item.description,
    );
  });
});
