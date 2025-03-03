import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useWebChatStore, {
  getApiUrl,
  getUserFirstName,
  getUserUuid,
} from '../../hooks/useWebChatStore';

describe('useWebChatStore', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getUserFirstName', () => {
    const processEnvApiUrl = 'process-env-api-url';
    const envApiUrl = 'env-api-url';

    it('should return url from .env when set in .env', () => {
      const processEnv = {
        VIRTUAL_AGENT_BACKEND_URL: processEnvApiUrl,
      };
      sandbox.stub(process, 'env').value(processEnv);

      const environment = {
        API_URL: envApiUrl,
      };

      const baseUrl = getApiUrl(environment);

      expect(baseUrl).to.equal(processEnvApiUrl);
    });
    it('should return url from environment when not set in .env', () => {
      const processEnv = {};
      sandbox.stub(process, 'env').value(processEnv);

      const environment = {
        API_URL: envApiUrl,
      };

      const baseUrl = getApiUrl(environment);

      expect(baseUrl).to.equal(envApiUrl);
    });
  });
  describe('getUserFirstName', () => {
    const name = 'test-user-first-name';

    it('should return name when exists', () => {
      const result = getUserFirstName(name);

      expect(result).to.equal(name);
    });
    it('should return noFirstNameFound when name is empty', () => {
      const result = getUserFirstName('');

      expect(result).to.equal('noFirstNameFound');
    });
  });
  describe('getUserUuid', () => {
    const userUuid = 'test-user-uuid';

    it('should return userUuid when exists', () => {
      const result = getUserUuid(userUuid);

      expect(result).to.equal(userUuid);
    });
    it('should return noUserUuid when userUuid is null', () => {
      const result = getUserUuid(null);

      expect(result).to.equal('noUserUuid');
    });
  });
  describe('useWebChatStore', () => {
    it('should create store with correct parameters', async () => {
      const csrfToken = 'test-csrf-token';
      const apiSession = 'test-api-session';
      const backendUrl = 'https://api.example.com';
      const baseUrl = 'https://example.com';
      const userFirstName = 'John';
      const userUuid = 'test-user-uuid';
      const isMobile = true;
      const environment = {
        API_URL: 'https://api.example.com',
        BASE_URL: baseUrl,
      };

      sandbox
        .stub(process, 'env')
        .value({ VIRTUAL_AGENT_BACKEND_URL: backendUrl });

      const createStore = sinon.stub();

      renderHook(() =>
        useWebChatStore({
          createStore,
          csrfToken,
          apiSession,
          userFirstName,
          userUuid,
          isMobile,
          environment,
        }),
      );

      expect(createStore.calledOnce).to.be.true;
    });
  });
});
