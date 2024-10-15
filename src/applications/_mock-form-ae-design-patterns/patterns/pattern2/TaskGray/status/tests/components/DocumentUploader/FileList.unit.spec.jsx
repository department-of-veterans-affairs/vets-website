import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import FileList from '../../../components/DocumentUploader/FileList';

describe('FileList', () => {
  it('should render FileList page', () => {
    const props = {
      files: [
        { fileName: 'file1.pdf', documentType: 'Something' },
        { fileName: 'file2.jpg', documentType: 'Other' },
      ],
      onClick: () => {},
    };
    const { container } = render(
      <div>
        <FileList {...props} />
      </div>,
    );

    const names = $$('strong', container);
    expect(names[0].textContent).to.eq(props.files[0].fileName);
    expect(names[1].textContent).to.eq(props.files[1].fileName);

    expect($$('button', container).length).to.eq(props.files.length);
  });
});
