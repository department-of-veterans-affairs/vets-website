import { expect } from 'chai';

import environment from 'platform/utilities/environment';

import formConfig from '../../config/form';
import {
  NEW_API,
  EVIDENCE_UPLOAD_API,
  EVIDENCE_UPLOAD_API_NEW,
} from '../../constants/apis';

describe('Supplemental Claims evidence upload page', () => {
  const { uiSchema } = formConfig.chapters.evidence.pages.evidenceUpload;

  // Increase test coverage
  it('should updateUiSchema for current API', () => {
    window.location = { pathname: '/review-and-submit' };
    const result = uiSchema.additionalDocuments['ui:options'].updateUiSchema({
      [NEW_API]: false,
    });
    expect(result).to.deep.equal({
      'ui:options': {
        fileUploadUrl: `${environment.API_URL}${EVIDENCE_UPLOAD_API}`,
      },
    });
  });
  it('should updateUiSchema for new API', () => {
    window.location = { pathname: '/review-and-submit' };
    const result = uiSchema.additionalDocuments['ui:options'].updateUiSchema({
      [NEW_API]: true,
    });
    expect(result).to.deep.equal({
      'ui:options': {
        fileUploadUrl: `${environment.API_URL}${EVIDENCE_UPLOAD_API_NEW}`,
      },
    });
  });
});
