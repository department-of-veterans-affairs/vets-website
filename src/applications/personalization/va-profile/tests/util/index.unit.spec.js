import sinon from 'sinon';
import { expect } from 'chai';

import sendAndMergeApiRequests from '../../util/sendAndMergeApiRequests';

describe('sendAndMergeApiRequests', () => {

  const apiRequest = sinon.spy((route) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const attributes = {};
        switch (route) {
          case '/property/one':
            attributes.value = 1;
            break;
          case '/property/two':
            attributes.value = 2;
            break;
          case '/property/three':
            attributes.value = 3;
            break;
          default:
            reject({ message: 'An error occurred' });
            return;
        }
        resolve({ data: { attributes } });
      }, 1);
    });
  });

  before(() => {
    apiRequest.reset();
  });

  it('generates an object out of an API-route map', async () => {
    const builder = {
      firstProperty: '/property/one',
      secondProperty: '/property/two',
      thirdProperty: '/property/three',
      erroredProperty: '/property/error'
    };

    const expectedResult = {
      firstProperty: { value: 1 },
      secondProperty: { value: 2 },
      thirdProperty: { value: 3 },
      erroredProperty: {
        error: {
          message: 'An error occurred'
        }
      }
    };

    const actualResult = await sendAndMergeApiRequests(builder, apiRequest);

    expect(actualResult).to.deep.equal(expectedResult);
    expect(apiRequest.callCount).to.equal(Object.keys(builder).length);
  });
});
