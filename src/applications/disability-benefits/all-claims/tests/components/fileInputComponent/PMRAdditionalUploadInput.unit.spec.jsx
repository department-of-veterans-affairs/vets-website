import { expect } from 'chai';
import { render } from '@testing-library/react';
import { additionalInput } from '../../../components/fileInputComponent/PMRAdditionalUploadInput';
import {
  PMR_ATTACHMENTS_TYPES,
  ADDITIONAL_ATTACHMENT_LABEL,
} from '../../../components/fileInputComponent/constants';

describe('PMRAdditionalUploadInput', () => {
  it('renders a required va-select with default label and attachmentId name', () => {
    const { container } = render(additionalInput());
    const select = container.querySelector('va-select');

    expect(select).to.exist;
    expect(select).to.have.attribute('required', 'true');
    expect(select).to.have.attribute('name', 'attachmentId');
    expect(select).to.have.attribute('label', ADDITIONAL_ATTACHMENT_LABEL);
    expect(container.querySelectorAll('option')).to.have.lengthOf(
      PMR_ATTACHMENTS_TYPES.length,
    );
  });

  it('renders provided label and attachment types', () => {
    const customAttachmentTypes = [
      { value: 'CUSTOM_PMR_1', label: 'Custom PMR Type 1' },
      { value: 'CUSTOM_PMR_2', label: 'Custom PMR Type 2' },
    ];

    const { container } = render(
      additionalInput({
        attachmentTypes: customAttachmentTypes,
        label: 'Custom PMR label',
      }),
    );

    const select = container.querySelector('va-select');
    const options = container.querySelectorAll('option');

    expect(select).to.have.attribute('label', 'Custom PMR label');
    expect(options).to.have.lengthOf(2);
    expect(options[0]).to.have.attribute('value', 'CUSTOM_PMR_1');
    expect(options[0].textContent).to.equal('Custom PMR Type 1');
    expect(options[1]).to.have.attribute('value', 'CUSTOM_PMR_2');
    expect(options[1].textContent).to.equal('Custom PMR Type 2');
  });
});
