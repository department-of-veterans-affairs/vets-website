import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { UploadDescription } from '../../content/fileUploadDescriptions';
import { MAX_FILE_SIZE_MB, MAX_PDF_FILE_SIZE_MB } from '../../constants';

describe('526 All Claims -- File upload descriptions', () => {
  it('should render', () => {
    const tree = shallow(<UploadDescription uploadTitle="test" />);
    expect(tree.find('UploadDescription')).to.exist;
    tree.unmount();
  });
  it('should render the max file sizes', () => {
    const tree = shallow(<UploadDescription uploadTitle="test" />);
    const text = tree.text();
    expect(text).to.contain(`Maximum non-PDF file size: ${MAX_FILE_SIZE_MB}MB`);
    expect(text).to.contain(`Maximum PDF file size: ${MAX_PDF_FILE_SIZE_MB}MB`);
    tree.unmount();
  });
});
