import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiRequest } from '../../api';

describe('apiRequest', () => {
  const server = setupServer();
  let expected;

  before(() => {
    server.listen();
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
  it('should not fail when downloading a file', async () => {
    const benefitLetterOptions = {
      letterName: 'Benefit Summary Letter',
      letterType: 'benefit_summary',
      letterOptions: {
        militaryService: true,
        monthlyAward: true,
        serviceConnectedEvaluation: true,
        chapter35Eligibility: true,
        serviceConnectedDisabilities: true,
      },
    };

    server.use(
      rest.post(
        `https://dev-api.va.gov/v0/letters/benefit_summary`,
        (_, res, ctx) => {
          const pdfFile = fs.readFileSync(
            path.resolve(__dirname, './pdfFixture.pdf'),
          );

          return res(
            ctx.status(200),
            ctx.set('Content-Length', pdfFile.byteLength.toString()),
            ctx.set('Content-Type', 'application/pdf'),
            ctx.body(pdfFile),
          );
        },
      ),
    );

    const response = await apiRequest('/letters/benefit_summary', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(benefitLetterOptions),
    });

    expect(response.bodyUsed).to.be.false;
    expect(response.status).to.eql(200);
    expect(expected.response.body).to.not.be.null;
  });
});
