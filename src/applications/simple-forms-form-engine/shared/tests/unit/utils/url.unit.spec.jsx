import { expect } from 'chai';

import { getFormIdFromUrl } from '../../../utils/url';

describe('getFormIdFromUrl', () => {
  const rootUrl = 'root/url';

  it('successfully parses the formId when present at the end of the url', () => {
    const formId = '123-abc';
    const url = `https://www.va.gov/${rootUrl}/${formId}`;
    const parsedFormId = getFormIdFromUrl(url, rootUrl);
    expect(parsedFormId).to.equal(formId);
  });

  it('successfully parses the formId when present at the end of the url', () => {
    const formId = '123-abc';
    const url = `https://www.va.gov/${rootUrl}/${formId}`;
    const parsedFormId = getFormIdFromUrl(url, rootUrl);
    expect(parsedFormId).to.equal(formId);
  });

  it('successfully parses the formId when present in the middle of the url', () => {
    const formId = '123-abc';
    const url = `https://www.va.gov/${rootUrl}/${formId}/some/more`;
    const parsedFormId = getFormIdFromUrl(url, rootUrl);
    expect(parsedFormId).to.equal(formId);
  });

  it('returns undefined when not properly formed', () => {
    const url = `https://www.va.gov/${rootUrl}`;
    const parsedFormId = getFormIdFromUrl(url, rootUrl);
    expect(parsedFormId).to.be.undefined;
  });

  it('successfully handles rootUrl with leading slash', () => {
    const formId = '123-abc';
    const url = `https://www.va.gov/${rootUrl}/${formId}/some/more`;
    const parsedFormId = getFormIdFromUrl(url, `/${rootUrl}`);
    expect(parsedFormId).to.equal(formId);
  });

  it('successfully handles rootUrl with trailing slash', () => {
    const formId = '123-abc';
    const url = `https://www.va.gov/${rootUrl}/${formId}/some/more`;
    const parsedFormId = getFormIdFromUrl(url, `${rootUrl}/`);
    expect(parsedFormId).to.equal(formId);
  });

  it('successfully handles rootUrl with leading and trailing slash', () => {
    const formId = '123-abc';
    const url = `https://www.va.gov/${rootUrl}/${formId}/some/more`;
    const parsedFormId = getFormIdFromUrl(url, `/${rootUrl}/`);
    expect(parsedFormId).to.equal(formId);
  });
});
