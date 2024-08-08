import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import AdditionalEvidenceItem from '../../components/AdditionalEvidenceItem';

describe('<AdditionalEvidenceItem>', () => {
  it('should render additional evidence item', () => {
    const item = {
      uploadDate: '2010-01-01',
      documentTypeLabel: 'Test Type',
      originalFileName: 'testfile.pdf',
    };

    const tree = SkinDeep.shallowRender(<AdditionalEvidenceItem item={item} />);

    expect(tree.subTree('.additional-evidence').text()).to.equal(
      'Additional evidence',
    );
    expect(tree.subTree('.submission-description').text()).contain(
      'File: testfile.pdf',
    );
    expect(tree.subTree('.submission-description').text()).contain(
      'Type: Test Type',
    );
    expect(tree.everySubTree('.submission-date')).not.to.be.empty;
  });

  it('should render additional evidence item without date', () => {
    const item = {
      uploadDate: null,
      documentTypeLabel: 'Test Type',
      originalFileName: 'testfile.pdf',
    };

    const tree = SkinDeep.shallowRender(<AdditionalEvidenceItem item={item} />);

    expect(tree.everySubTree('.submission-date')).to.be.empty;
  });

  it('should mask filenames in DataDog (no PII)', () => {
    const item = {
      uploadDate: null,
      documentTypeLabel: 'Test Type',
      originalFileName: 'testfile.pdf',
    };

    const tree = SkinDeep.shallowRender(<AdditionalEvidenceItem item={item} />);

    expect(tree.subTree('.filename').props['data-dd-privacy']).to.equal('mask');
  });
});
