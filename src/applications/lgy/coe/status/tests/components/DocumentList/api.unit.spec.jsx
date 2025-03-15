import { expect } from 'chai';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { getCoeDocuments } from '../../../components/DocumentList/api';
import mockDocuments from '../../../../form/tests/fixtures/mocks/documents.json';

const mockError = { errors: 'nope' };

describe('getCoeDocuments', () => {
  it('should successfully fetch COE document with data', () => {
    mockApiRequest(mockDocuments);
    return getCoeDocuments().then(response => {
      expect(response).to.eq(mockDocuments.data.attributes);
    });
  });
  it('should fail fetch COE document with error', () => {
    mockApiRequest(mockError, false);
    return getCoeDocuments().catch(response => {
      response.json().then(json => {
        expect(json.errors).to.eq(mockError.errors);
      });
    });
  });
});
