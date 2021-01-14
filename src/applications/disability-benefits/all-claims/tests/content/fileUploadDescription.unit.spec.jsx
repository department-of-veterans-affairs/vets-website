import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { UploadDescription } from '../../content/fileUploadDescriptions';
import { MAX_FILE_SIZE_MB, MAX_PDF_FILE_SIZE_MB } from '../../constants';

describe('526 All Claims -- File upload descriptions', () => {
  it('should render', () => {
    const tree = shallow(
      <UploadDescription uploadTitle={'test'} showPdfSize={false} />,
    );
    expect(tree.find('UploadDescription')).to.exist;
    tree.unmount();
  });
  it('should render only the max global file size', () => {
    const tree = shallow(
      <UploadDescription uploadTitle={'test'} showPdfSize={false} />,
    );
    const text = tree.text();
    expect(text).to.contain(`Maximum file size: ${MAX_FILE_SIZE_MB}`);
    expect(text).to.not.contain(MAX_PDF_FILE_SIZE_MB);
    tree.unmount();
  });
  it('should render only the appropriate panels', () => {
    const tree = shallow(
      <UploadDescription uploadTitle={'test'} showPdfSize />,
    );
    const text = tree.text();
    expect(text).to.contain(MAX_PDF_FILE_SIZE_MB);
    tree.unmount();
  });
});
