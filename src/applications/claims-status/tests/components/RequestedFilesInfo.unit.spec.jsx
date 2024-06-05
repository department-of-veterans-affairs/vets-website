import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import * as AdditionalEvidencePageOld from '../../containers/AdditionalEvidencePageOld';
import RequestedFilesInfo from '../../components/RequestedFilesInfo';

let stub;

describe('<RequestedFilesInfo>', () => {
  before(() => {
    // Stubbing AdditionalEvidencePageOld as we aren't interested
    // in testing the functionality of this component
    stub = sinon.stub(AdditionalEvidencePageOld, 'default');
    stub.returns(<div data-testid="additional-evidence-page-old" />);
  });

  after(() => {
    stub.restore();
  });

  it('should display no documents messages', () => {
    const screen = render(
      <RequestedFilesInfo id="1" filesNeeded={[]} optionalFiles={[]} />,
    );

    screen.getByText('You don’t need to turn in any documents to VA.');
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
