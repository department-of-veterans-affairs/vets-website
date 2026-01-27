import { expect } from 'chai';

import {
  uiSchema,
  migrateEvidenceChoiceUploadFormData,
} from '../../../../pages/form0781/supportingEvidenceEnhancement/evidenceChoiceUploadPage';

describe('evidenceChoiceUploadPage', () => {
  it('maps upload response guid to confirmationCode via parseResponse', () => {
    const parseResponse =
      uiSchema?.evidenceChoiceFileInput?.['ui:options']?.parseResponse;

    expect(parseResponse).to.be.a('function');

    const response = { data: { attributes: { guid: 'abc-123' } } };
    const file = {
      name: 'test-upload.pdf',
      size: 618,
      type: 'application/pdf',
    };

    const parsed = parseResponse(response, file);

    expect(parsed).to.deep.equal({
      confirmationCode: 'abc-123',
      file,
    });
  });

  it('migrates legacy guid-based files to confirmationCode', () => {
    const formData = {
      evidenceChoiceFileInput: [
        {
          guid: 'legacy-guid-1',
          name: 'file1.pdf',
          size: 123,
          type: 'application/pdf',
        },
      ],
    };

    const migrated = migrateEvidenceChoiceUploadFormData(formData);
    expect(migrated).to.deep.equal({
      evidenceChoiceFileInput: [
        {
          guid: 'legacy-guid-1',
          confirmationCode: 'legacy-guid-1',
          name: 'file1.pdf',
          size: 123,
          type: 'application/pdf',
        },
      ],
    });
  });

  it('defers setting va-select value until component is ready', async () => {
    const additionalInputUpdate =
      uiSchema?.evidenceChoiceFileInput?.['ui:options']?.additionalInputUpdate;
    expect(additionalInputUpdate).to.be.a('function');

    const calls = [];
    const instance = {
      setAttribute: (key, val) => calls.push([key, val]),
      componentOnReady: () => Promise.resolve(),
    };

    additionalInputUpdate(instance, '', { documentType: 'L018' });
    // wait for the componentOnReady promise chain
    await Promise.resolve();

    expect(calls).to.deep.include(['error', '']);
    expect(calls).to.deep.include(['value', 'L018']);
  });
});
