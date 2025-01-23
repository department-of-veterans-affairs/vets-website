import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import RemoveFileModal from '../../../components/claim-files-tab/RemoveFileModal';

describe('<RemoveFileModal>', () => {
  const props = {
    removeFileName: 'test.pdf',
    showRemoveFileModal: true,
    removeFile: () => {},
    closeModal: () => {},
  };

  it('should render component', () => {
    const { container, getByText } = render(<RemoveFileModal {...props} />);

    expect($('#remove-file', container)).to.exist;
    expect(
      $('va-modal', container).getAttribute('primary-button-text'),
    ).to.equal('Yes, remove this');
    expect(
      $('va-modal', container).getAttribute('secondary-button-text'),
    ).to.equal('No, keep this');
    expect(getByText(props.removeFileName)).to.exist;
  });

  it('calls removeFile when primary button is clicked', () => {
    const removeFile = sinon.spy();
    const { container } = render(
      <RemoveFileModal {...props} removeFile={removeFile} />,
    );

    $('va-modal', container).__events.primaryButtonClick();
    expect(removeFile.calledOnce).to.be.true;
  });

  it('calls closeModal when secondary button is clicked', () => {
    const closeModal = sinon.spy();
    const { container } = render(
      <RemoveFileModal {...props} closeModal={closeModal} />,
    );

    $('va-modal', container).__events.secondaryButtonClick();
    expect(closeModal.calledOnce).to.be.true;
  });

  it('calls closeModal when close button is clicked', () => {
    const closeModal = sinon.spy();
    const { container } = render(
      <RemoveFileModal {...props} closeModal={closeModal} />,
    );

    $('va-modal', container).__events.closeEvent();
    expect(closeModal.calledOnce).to.be.true;
  });

  it('should mask filename from Datadog (no PII)', () => {
    const { container } = render(<RemoveFileModal {...props} />);

    expect($('strong', container).getAttribute('data-dd-privacy')).to.equal(
      'mask',
    );
  });
});
