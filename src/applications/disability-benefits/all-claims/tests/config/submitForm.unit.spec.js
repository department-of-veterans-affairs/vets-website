import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';

describe('Form 526 submit reject timer', () => {
  let xhr;
  let requests = [];

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = req => {
      requests.push(req);
    };
  });

  afterEach(() => {
    global.XMLHttpRequest = window.XMLHttpRequest;
    xhr.restore();
    requests = [];
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
