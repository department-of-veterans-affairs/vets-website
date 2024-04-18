import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import RemoveFileModal from '../../../components/claim-files-tab/RemoveFileModal';

describe('<RemoveFileModal>', () => {
  it('should render component', () => {
    const removeFileName = 'test.pdf';
    const showRemoveFileModal = true;
    const onRemoveFile = sinon.spy();
    const onCloseModal = sinon.spy();

    const { container, getByText } = render(
      <RemoveFileModal
        removeFileName={removeFileName}
        showRemoveFileModal={showRemoveFileModal}
        closeModal={onCloseModal}
        removeFile={onRemoveFile}
      />,
    );

    expect($('#remove-file', container)).to.exist;
    expect($('va-modal', container).getAttribute('primarybuttontext')).to.equal(
      'Yes, remove this',
    );
    expect(
      $('va-modal', container).getAttribute('secondarybuttontext'),
    ).to.equal('No, keep this');
    expect(getByText(removeFileName)).to.exist;
  });

  it('calls removeFile when primary button is clicked', () => {
    const removeFileName = 'test.pdf';
    const showRemoveFileModal = true;
    const onRemoveFile = sinon.spy();
    const onCloseModal = sinon.spy();

    const { container } = render(
      <RemoveFileModal
        removeFileName={removeFileName}
        showRemoveFileModal={showRemoveFileModal}
        closeModal={onCloseModal}
        removeFile={onRemoveFile}
      />,
    );

    $('va-modal', container).__events.primaryButtonClick();
    expect(onRemoveFile.calledOnce).to.be.true;
  });

  it('calls closeModal when secondary button is clicked', () => {
    const removeFileName = 'test.pdf';
    const showRemoveFileModal = true;
    const onRemoveFile = sinon.spy();
    const onCloseModal = sinon.spy();

    const { container } = render(
      <RemoveFileModal
        removeFileName={removeFileName}
        showRemoveFileModal={showRemoveFileModal}
        closeModal={onCloseModal}
        removeFile={onRemoveFile}
      />,
    );

    $('va-modal', container).__events.secondaryButtonClick();
    expect(onCloseModal.calledOnce).to.be.true;
  });

  it('calls closeModal when close button is clicked', () => {
    const removeFileName = 'test.pdf';
    const showRemoveFileModal = true;
    const onRemoveFile = sinon.spy();
    const onCloseModal = sinon.spy();

    const { container } = render(
      <RemoveFileModal
        removeFileName={removeFileName}
        showRemoveFileModal={showRemoveFileModal}
        closeModal={onCloseModal}
        removeFile={onRemoveFile}
      />,
    );

    $('va-modal', container).__events.closeEvent();
    expect(onCloseModal.calledOnce).to.be.true;
  });
});
