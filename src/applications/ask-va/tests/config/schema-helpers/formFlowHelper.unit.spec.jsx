import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from '../../../config/helpers';
import { flowPages } from '../../../config/schema-helpers/formFlowHelper';

describe('flowPages', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(helpers, 'generalQuestionCondition')
      .callsFake(formData => formData.isGeneralQuestion);
  });

  afterEach(() => {
    sandbox.restore();
  });

  const testPages = {
    page1: {
      title: 'Page 1',
    },
    page2: {
      title: 'Page 2',
      depends: formData => formData.showPage2,
    },
  };

  const testList = ['page1', 'page2'];
  const testPath = 'test-path';

  it('clones pages and adds to flow group', () => {
    const result = flowPages(testPages, testList, testPath);
    expect(result.page1_testpath).to.deep.include({
      title: 'Page 1',
    });
    expect(result.page2_testpath).to.deep.include({
      title: 'Page 2',
    });
  });

  it('sets path correctly', () => {
    const result = flowPages(testPages, testList, testPath);
    expect(result.page1_testpath.path).to.equal('test-path-1');
    expect(result.page2_testpath.path).to.equal('test-path-2');
  });

  it('preserves existing depends function', () => {
    const result = flowPages(testPages, testList, testPath);
    const formData = { showPage2: true };
    expect(result.page2_testpath.depends(formData)).to.be.true;

    formData.showPage2 = false;
    expect(result.page2_testpath.depends(formData)).to.be.false;
  });

  it('adds condition from conditionMap when path matches', () => {
    const result = flowPages(testPages, testList, 'general-question');
    const formData = { isGeneralQuestion: true };
    expect(result.page1_generalquestion.depends(formData)).to.be.true;

    formData.isGeneralQuestion = false;
    expect(result.page1_generalquestion.depends(formData)).to.be.false;
  });

  it('combines existing depends with condition from map', () => {
    const result = flowPages(testPages, testList, 'general-question');
    const formData = { showPage2: true, isGeneralQuestion: true };
    expect(result.page2_generalquestion.depends(formData)).to.be.true;

    formData.showPage2 = false;
    expect(result.page2_generalquestion.depends(formData)).to.be.false;

    formData.showPage2 = true;
    formData.isGeneralQuestion = false;
    expect(result.page2_generalquestion.depends(formData)).to.be.false;
  });
});
