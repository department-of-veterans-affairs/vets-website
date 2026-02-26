import { expect } from 'chai';
import sinon from 'sinon';

import processCSAT, { BLUE_STAR } from '../../../webchat/utils/processCSAT';

describe('processCSAT', () => {
  let sandbox;
  let columns;
  let stars;
  let surveys;
  let shouldReturnColumns;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
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

    shouldReturnColumns = true;

    const survey = {
      querySelectorAll: sandbox.stub().callsFake(query => {
        if (query === '#chatbot-csat-survey-columnset') {
          return shouldReturnColumns ? columns : [];
        }
        if (query === 'img') {
          return stars;
        }
        return [];
      }),
    };

    surveys = [survey];

    sandbox.stub(document, 'querySelectorAll').callsFake(selector => {
      if (selector === '#chatbot-csat-survey') {
        return surveys;
      }
      return [];
    });
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

  it('Should return early when surveys are not present', () => {
    surveys.length = 0;

    expect(() => processCSAT({ value: { response: '3' } })).to.not.throw();
  });

  it('Should return early when the latest survey cannot be found', () => {
    surveys.splice(0, surveys.length, undefined);

    expect(() => processCSAT({ value: { response: '3' } })).to.not.throw();
  });

  it('Should leave pointer events untouched when no column set is returned', () => {
    shouldReturnColumns = false;

    processCSAT({ value: { response: '3' } });

    expect(columns[0].style.pointerEvents).to.equal('not-none');
  });
});
