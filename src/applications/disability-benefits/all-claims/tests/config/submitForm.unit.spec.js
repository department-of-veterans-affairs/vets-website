import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import localStorage from 'platform/utilities/storage/localStorage';

describe('Form 526 submit reject timer', () => {
  let xhr;

  before(() => {
    sinon.stub(localStorage, 'getItem');
  });

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
  });

  afterEach(() => {
    global.XMLHttpRequest = window.XMLHttpRequest;
    xhr.restore();
  });

  after(() => {
    localStorage.getItem.restore();
  });

  it('should trigger reject timer', async () => {
    const blankFormConfig = {
      chapters: {},
    };
    const form = {
      pages: {
        testing: {},
      },
      data: {
        testing: 1,
      },
    };

    const promise = await formConfig
      .submit(form, blankFormConfig, { mode: 'testing' })
      .catch(error => {
        expect(error.message).to.eql('client_error: Request taking too long');
      });

    return promise;
  });
});
