import { expect } from 'chai';
import { render } from '@testing-library/react';
import { additionalInput } from '../../../components/fileInputComponent/AdditionalUploadInput';
import {
  ATTACHMENTS_TYPE,
  ADDITIONAL_ATTACHMENT_LABEL,
} from '../../../components/fileInputComponent/constants';

describe('AdditionalUploadInput', () => {
  it('renders a required va-select with default label and docType name', () => {
    const { container } = render(additionalInput());
    const select = container.querySelector('va-select');

    expect(select).to.exist;
    expect(select).to.have.attribute('required', 'true');
    expect(select).to.have.attribute('name', 'docType');
    expect(select).to.have.attribute('label', ADDITIONAL_ATTACHMENT_LABEL);
    expect(container.querySelectorAll('option')).to.have.lengthOf(
      ATTACHMENTS_TYPE.length,
    );
  });

  it('renders provided label and attachment types', () => {
    const customAttachmentTypes = [
      { value: 'CUSTOM_1', label: 'Custom Type 1' },
      { value: 'CUSTOM_2', label: 'Custom Type 2' },
    ];

    const { container } = render(
      additionalInput({
        attachmentTypes: customAttachmentTypes,
        label: 'Custom label',
      }),
    );

    const select = container.querySelector('va-select');
    const options = container.querySelectorAll('option');

    expect(select).to.have.attribute('label', 'Custom label');
    expect(options).to.have.lengthOf(2);
    expect(options[0]).to.have.attribute('value', 'CUSTOM_1');
    expect(options[0].textContent).to.equal('Custom Type 1');
    expect(options[1]).to.have.attribute('value', 'CUSTOM_2');
    expect(options[1].textContent).to.equal('Custom Type 2');
  });
});
