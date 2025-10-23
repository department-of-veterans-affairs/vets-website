import { expect } from 'chai';
import formConfig from '../../config/form';
import { AUTHORIZER_TYPES } from '../../definitions/constants';

describe('form config options', () => {
  it('should use the correct full name path in the statement of truth for a veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.VETERAN,
    };
    const path = formConfig.preSubmitInfo.statementOfTruth.fullNamePath(
      formData,
    );

    expect(path).to.eq('veteranFullName');
  });

  it('should use the correct full name path in the statement of truth for a non veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.NON_VETERAN,
    };
    const path = formConfig.preSubmitInfo.statementOfTruth.fullNamePath(
      formData,
    );

    expect(path).to.eq('authorizerFullName');
  });

  it('should show correct title for veteran personal info for a veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.VETERAN,
    };
    const title = formConfig.chapters.veteranPersonalInfoChapter.title({
      formData,
    });

    expect(title).to.eq('Your personal information');
  });

  it('should show correct title for veteran personal info for a non veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.NON_VETERAN,
    };
    const title = formConfig.chapters.veteranPersonalInfoChapter.title({
      formData,
    });

    expect(title).to.eq('Veteran’s personal information');
  });

  it('should show correct title for veteran identification info for a veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.VETERAN,
    };
    const title = formConfig.chapters.veteranIdentificationInfoChapter.title({
      formData,
    });

    expect(title).to.eq('Your identification information');
  });

  it('should show correct title for veteran identification info for a non veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.NON_VETERAN,
    };
    const title = formConfig.chapters.veteranIdentificationInfoChapter.title({
      formData,
    });

    expect(title).to.eq('Veteran’s identification information');
  });

  it('should show correct title for security info for a veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.VETERAN,
    };
    const title = formConfig.chapters.securityInfoChapter.title({
      formData,
    });

    expect(title).to.eq('Security information');
  });

  it('should show correct title for security info for a non veteran', () => {
    const formData = {
      authorizerType: AUTHORIZER_TYPES.NON_VETERAN,
    };
    const title = formConfig.chapters.securityInfoChapter.title({
      formData,
    });

    expect(title).to.eq('Security question');
  });
});
