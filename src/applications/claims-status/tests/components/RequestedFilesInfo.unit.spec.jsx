import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import RequestedFilesInfo from '../../components/RequestedFilesInfo';

describe('<RequestedFilesInfo>', () => {
  it('should display no documents messages', () => {
    const filesNeeded = [];
    const optionalFiles = [];

    const tree = SkinDeep.shallowRender(
      <RequestedFilesInfo
        id="1"
        filesNeeded={filesNeeded}
        optionalFiles={optionalFiles}
      />,
    );
    expect(tree.everySubTree('.no-documents')).not.to.be.empty;
  });
  it('should display requested items', () => {
    const filesNeeded = [
      {
        trackedItemId: 1,
        type: 'still_need_from_you_list',
        displayName: 'Request 1',
        description: 'Some description',
        status: 'NEEDED',
      },
    ];
    const optionalFiles = [];

    const tree = SkinDeep.shallowRender(
      <RequestedFilesInfo
        id="1"
        filesNeeded={filesNeeded}
        optionalFiles={optionalFiles}
      />,
    );
    const content = tree.dive(['FilesNeededOld']);
    expect(content).not.to.be.empty;
    expect(content.subTree('.file-request-list-item').text()).to.contain(
      filesNeeded[0].displayName,
    );
    expect(content.subTree('.file-request-list-item').text()).to.contain(
      filesNeeded[0].description,
    );
    expect(content.subTree('.file-request-list-item').text()).to.contain(
      '<Link />',
    );
  });
  it('should display optional files', () => {
    const optionalFiles = [
      {
        trackedItemId: 1,
        type: 'still_need_from_others_list',
        status: 'NEEDED',
        displayName: 'Request 1',
        description: 'Some description',
      },
    ];
    const filesNeeded = [];

    const tree = SkinDeep.shallowRender(
      <RequestedFilesInfo
        id="1"
        filesNeeded={filesNeeded}
        optionalFiles={optionalFiles}
      />,
    );

    const content = tree.dive(['FilesOptionalOld']);
    expect(content).not.to.be.empty;
    expect(content.subTree('.file-request-list-item').text()).to.contain(
      optionalFiles[0].displayName,
    );
    expect(content.subTree('.file-request-list-item').text()).to.contain(
      optionalFiles[0].description,
    );
    expect(content.subTree('.file-request-list-item').text()).to.contain(
      '<Link />',
    );
  });
});
