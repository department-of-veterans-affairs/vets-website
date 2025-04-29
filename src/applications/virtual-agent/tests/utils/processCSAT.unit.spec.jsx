import sinon from 'sinon';
import { expect } from 'chai';

import processCSAT, { BLUE_STAR } from '../../utils/processCSAT';

describe('processCSAT', () => {
  let sandbox;
  let columns;
  let stars;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    columns = [{ style: { pointerEvents: 'not-none' } }];
    stars = [
      {
        src: 'some-url',
      },
      {
        src: 'some-url',
      },
      {
        src: 'some-url',
      },
      {
        src: 'some-url',
      },
      {
        src: 'some-url',
      },
    ];

    sandbox.stub(document, 'querySelectorAll').returns([
      {
        querySelectorAll: sandbox.stub().callsFake(query => {
          if (query === '#chatbot-csat-survey-columnset') {
            return columns;
          }
          if (query === 'img') {
            return stars;
          }
          return sandbox.stub();
        }),
      },
    ]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should disable the survey', () => {
    processCSAT({ value: { response: '3' } });

    expect(columns[0].style.pointerEvents).to.equal('none');
  });
  it('Should fill in the stars when a numerical rating is given', () => {
    processCSAT({ value: { response: '3' } });

    expect(stars[0].src).to.equal(BLUE_STAR);
    expect(stars[1].src).to.equal(BLUE_STAR);
    expect(stars[2].src).to.equal(BLUE_STAR);
    expect(stars[3].src).to.equal('some-url');
    expect(stars[4].src).to.equal('some-url');
  });
  it('Should not fill in the stars when a non-numerical rating is given', () => {
    processCSAT({ value: { response: 'No response' } });

    expect(stars[0].src).to.equal('some-url');
    expect(stars[1].src).to.equal('some-url');
    expect(stars[2].src).to.equal('some-url');
    expect(stars[3].src).to.equal('some-url');
    expect(stars[4].src).to.equal('some-url');
  });
});
