import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { UploadPage } from '../../../pages/upload';
import formConfig from '../../../config/form';
import { UPLOAD_GUIDELINES } from '../../../config/constants';

describe('UploadPage', () => {
  const { uiSchema } = formConfig().chapters.uploadChapter.pages.uploadPage;
  const subject = () => render(<UploadPage />);

  it('renders successfully', () => {
    const { container } = subject();

    expect(container).to.exist;
  });

  it('updates the description when there are no warnings', () => {
    const result = uiSchema['view:uploadGuidelines'][
      'ui:options'
    ].updateUiSchema({});

    expect(result).to.deep.equal({
      'ui:description': UPLOAD_GUIDELINES,
    });
  });

  it('updates the description when there are warnings', () => {
    const formData = {
      uploadedFile: {
        warnings: ['bad news'],
      },
    };
    const result = uiSchema['view:uploadGuidelines'][
      'ui:options'
    ].updateUiSchema(formData);

    expect(result).to.deep.equal({
      'ui:description': <h3>Your file</h3>,
    });
  });

  it('updates the title when there are no warnings', () => {
    const result = uiSchema.uploadedFile['ui:options'].updateUiSchema({});

    expect(result).to.deep.equal({
      'ui:title': 'Upload VA Form ',
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
      'ui:title': 'VA Form ',
    });
  });
});
