import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import FileListItem from '../../../components/DocumentUploader/FileListItem';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

describe('FileListItem', () => {
  it('should render FileListItem', () => {
    const props = {
      index: 3,
      file: { fileName: 'file1.pdf', documentType: 'Something' },
      onClick: sinon.spy(),
    };
    const { container } = render(<FileListItem {...props} />);

    const p = $$('p', container);
    expect(p.length).to.eq(2);
    expect(p[0].textContent).to.eq(props.file.fileName);
    expect(p[1].textContent).to.eq(props.file.documentType);

    fireEvent.click($('button', container), mouseClick);
    expect(props.onClick.called).to.be.true;
    expect(props.onClick.args[0][0]).to.eq(props.index);
  });
});
