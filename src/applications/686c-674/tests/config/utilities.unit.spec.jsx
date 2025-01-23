import { expect } from 'chai';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
  customFormReplacer,
  isClientError,
  isServerError,
  getData,
  validateName,
} from '../../config/utilities';

describe('Utilities', () => {
  it('parses client errors', () => {
    expect(isClientError(500)).to.be.false;
    expect(isClientError(400)).to.be.true;
  });

  it('parses server errors', () => {
    expect(isServerError(500)).to.be.true;
    expect(isServerError(400)).to.be.false;
  });

  it('parses forms', () => {
    expect(customFormReplacer('test', {})).to.be.undefined;
    expect(
      customFormReplacer('test', { widget: 'autosuggest', id: 1 }),
    ).to.be.eq(1);
    expect(
      customFormReplacer('test', { confirmationCode: 'test', file: 'test' }),
    ).to.be.deep.eq({ confirmationCode: 'test' });
    expect(
      customFormReplacer('test', [{ widget: 'autosuggest', id: 1 }]),
    ).to.be.an('array');
    expect(customFormReplacer('test', [])).to.be.undefined;
    expect(customFormReplacer('test', 1)).to.be.eq(1);
  });
});

describe('getData', () => {
  const server = setupServer();

  before(() => {
    server.listen();
  });
  after(() => {
    server.close();
  });

  it('should succeed', async () => {
    server.use(
      rest.get(`https://dev-api.va.gov/v0/some/api-route`, (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({ data: { attributes: { name: 'John' } } }),
        ),
      ),
    );

    const response = await getData('/some/api-route');
    expect(response).to.eql({ name: 'John' });
  });

  it('should fail', async () => {
    server.use(
      rest.get(`https://dev-api.va.gov/v0/some/api-route`, (_, res) =>
        res.networkError(),
      ),
    );

    const response = await getData('/some/api-route');
    expect(response).to.throw;
  });
});

describe('validateName', () => {
  it('should validate the name', () => {
    const response1 = validateName(
      { first: false, last: false },
      { first: 'Bob', last: 'Last' },
    );
    expect(response1).to.be.undefined;
  });
});

describe('isServerError', () => {
  it('should return true for server errors (5xx)', () => {
    expect(isServerError('500')).to.be.true;
    expect(isServerError('501')).to.be.true;
    expect(isServerError('599')).to.be.true;
  });

  it('should return false for non-server errors', () => {
    expect(isServerError('400')).to.be.false;
    expect(isServerError('200')).to.be.false;
    expect(isServerError('404')).to.be.false;
  });
});

describe('isClientError', () => {
  it('should return true for client errors (4xx)', () => {
    expect(isClientError('400')).to.be.true;
    expect(isClientError('404')).to.be.true;
    expect(isClientError('499')).to.be.true;
  });

  it('should return false for non-client errors', () => {
    expect(isClientError('500')).to.be.false;
    expect(isClientError('200')).to.be.false;
    expect(isClientError('201')).to.be.false;
  });
});
