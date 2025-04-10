import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';

import UploadStatus from '../../components/UploadStatus';

const props = {
  files: 1,
  progress: 0.5,
  onCancel: () => {},
};

describe('<UploadStatus>', () => {
  it('should render 1 file uploading and in progress', () => {
    const uploadText = `Uploading ${props.files} file...`;
    const { container, getByText, getByRole } = render(
      <UploadStatus {...props} />,
    );
    getByText('Uploading files');
    const h4Element = getByRole('heading', { level: 4 });
    expect(h4Element.textContent).to.equal(uploadText);
    expect($('va-progress-bar', container)).to.exist;
    expect($('va-progress-bar', container).getAttribute('percent')).to.equal(
      '50',
    );
  });
  it('should call onCancel', () => {
    const onCancel = sinon.spy();
    const { container } = render(
      <UploadStatus {...props} onCancel={onCancel} />,
    );
    fireEvent.click($('va-button', container));
    expect(onCancel.called).to.be.true;
  });
});
