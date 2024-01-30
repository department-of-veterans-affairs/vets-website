// formFlowHelper.test.js

import { expect } from 'chai';
import { flowPages } from '../../../config/schema-helpers/formFlowHelper';

describe('flowPages', () => {
  const testPages = {
    page1: {
      title: 'Page 1',
    },
    page2: {
      title: 'Page 2',
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

  it('sets onNavForward handler', () => {
    const result = flowPages(testPages, testList, testPath);
    expect(result.page2_testpath.onNavForward).to.be.a('function');
  });

  it('sets onNavBack handler', () => {
    const result = flowPages(testPages, testList, testPath);
    expect(result.page1_testpath.onNavBack).to.be.a('function');
  });
});
