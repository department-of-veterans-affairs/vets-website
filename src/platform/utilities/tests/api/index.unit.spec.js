import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
// import
import { apiRequest } from '../../api';

describe('apiRequest', () => {
  const server = setupServer();
  let expected;

  before(() => {
    server.listen({
      onUnhandledRequest: 'bypass',
    });
    server.events.on('request:end', async req => {
      expected = { ...expected, request: req };
    });
    server.events.on('response:mocked', async res => {
      expected = { ...expected, response: res };
    });
  });

  afterEach(() => {
    server.resetHandlers();
    expected = undefined;
  });

  after(() => {
    server.close();
  });

  it('should return JSON when appropriate headers are specified on (status: 200)', async () => {
    const jsonResponse = { status: 'ok' };
    server.use(
      rest.get(/v0\/status/, (req, res, ctx) =>
        res(ctx.status(200), ctx.json(jsonResponse)),
      ),
    );

    const response = await apiRequest('/status', {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(expected.response.body).to.have.a.lengthOf(
      JSON.stringify(jsonResponse).length,
    );
    expect(response.status).to.eql('ok');
  });

  it('should not return JSON on (status: 204)', async () => {
    server.use(rest.get(/v0\/status/, (req, res, ctx) => res(ctx.status(204))));

    const response = await apiRequest('/status', {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.ok).to.eql(true);
    expect(expected.response.body).to.be.null;
    expect(response.body._readableState.buffer.length).to.eql(0);
  });
  it('should not return JSON on (status: 404)', async () => {
    server.use(
      rest.get('*', (req, res, ctx) =>
        res(
          ctx.status(404),
          ctx.json({ errors: [{ status: '404', title: 'Not found' }] }),
        ),
      ),
    );

    await apiRequest('/status', {
      headers: { 'Content-Type': 'application/json' },
    }).catch(error => {
      expect(expected.response.body).to.not.be.null;
      expect(error).to.deep.equal(JSON.parse(expected.response.body));
    });
  });
});

describe('fetchAndUpdateSessionExpiration', () => {});
