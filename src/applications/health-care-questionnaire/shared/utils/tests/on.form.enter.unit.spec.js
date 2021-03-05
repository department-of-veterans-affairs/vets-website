import { expect } from 'chai';
import sinon from 'sinon';

import { onFormEnter } from '../index';

describe('health care questionnaire -- utils -- form enter routing based on id', () => {
  // set to null since we do not use nextState
  const nextState = null;
  it('should return a function', () => {
    const fakeId = '12345';
    const onEnter = onFormEnter(fakeId);
    expect(onEnter).to.be.a('function');
  });
  it('both ids are supplied -- should call replace with the questionnaire form url with id', () => {
    const replace = sinon.spy();
    const formId = '12345';
    const onEnter = onFormEnter(formId);
    expect(onEnter).to.be.a('function');
    onEnter(nextState, replace);
    expect(replace.called).to.be.true;
    expect(replace.calledWith(`/introduction?id=${formId}`)).to.be.true;
  });
  it('no form id is supplied -- should call replace with the questionnaire list ', () => {
    const replace = sinon.spy();
    const formId = null;
    const onEnter = onFormEnter(formId);
    expect(onEnter).to.be.a('function');
    onEnter(nextState, replace);
    expect(replace.called).to.be.true;
    expect(
      replace.calledWith(`/health-care/health-questionnaires/questionnaires`),
    ).to.be.true;
  });
});
