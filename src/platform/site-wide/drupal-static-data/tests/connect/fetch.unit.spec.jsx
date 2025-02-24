import environment from 'platform/utilities/environment';
import { DATA_FILES_PATH } from '../../constants';

const sinon = require('sinon');
const { fetchDrupalStaticDataFile } = require('../../connect/fetch');

describe('fetchDrupalStaticDataFile', () => {
  let mock;
  let expectation;

  const filename = 'test-file.json';

  beforeEach(() => {
    mock = sinon.mock(global);
    expectation = mock.expects('fetch').once();
  });

  it('uses the environment base URL by default', async () => {
    expectation = expectation.withArgs(
      `${environment.BASE_URL}/${DATA_FILES_PATH}/${filename}`,
    );
    await fetchDrupalStaticDataFile(filename);

    mock.verify();
  });

  it('uses a custom server when given one', async () => {
    const testServer = 'https://example.com';
    expectation = expectation.withArgs(
      `${testServer}/${DATA_FILES_PATH}/${filename}`,
    );

    await fetchDrupalStaticDataFile(filename, testServer);

    mock.verify();
  });
});
