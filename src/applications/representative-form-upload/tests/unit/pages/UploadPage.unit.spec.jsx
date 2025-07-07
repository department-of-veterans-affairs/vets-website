import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { uploadPage } from '../../../pages/upload';
import formConfig from '../../../config/form';

describe('uploadPage', () => {
  const { uiSchema } = formConfig.chapters.uploadChapter.pages.uploadPage;
  const subject = () => render(<uploadPage />);

  it('renders successfully', () => {
    const { container } = subject();

    expect(container).to.exist;
  });

  it('updates the title when there are no warnings', () => {
    const result = uiSchema.uploadedFile['ui:options'].updateUiSchema({});

    expect(result).to.deep.equal({
      'ui:title': 'Select a file to upload',
    });
  });

  it('updates the title when there are warnings', () => {
    const formData = {
      uploadedFile: {
        warnings: ['bad news'],
      },
    };
    const result = uiSchema.uploadedFile['ui:options'].updateUiSchema(formData);

    expect(result).to.deep.equal({
      'ui:title': 'Select a file to upload',
    });
  });
});
