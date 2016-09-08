import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import NavButtons from '../../../src/js/edu-benefits/components/NavButtons';

describe('<NavButtons>', () => {
  describe('should render', () => {
    const path = '/some-url';
    const submission = {
      status: false
    };
    const pages = ['/introduction', '/some-url'];
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}/>
    );
    it('two buttons', () => {
      expect(tree.everySubTree('ProgressButton').length).to.equal(2);
    });
    it('two buttons that say back and continue', () => {
      expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal('Back');
      expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Continue');
    });
  });
  describe('when on /introduction should render', () => {
    const path = '/introduction';
    const submission = {
      status: false
    };
    const pages = ['/introduction', '/some-url'];
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}/>
    );
    it('one button that says get started', () => {
      expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal('Get Started');
    });
  });
  describe('when on /review-and-submit should render ', () => {
    const path = '/review-and-submit';
    const submission = {
      status: false
    };
    const pages = ['/introduction', '/review-and-submit'];
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}/>
    );
    it('a back button', () => {
      expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal('Back');
    });
    it('a submit button', () => {
      expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Submit Application');
    });
  });
  describe('when on /review-and-submit and pending should render ', () => {
    const path = '/review-and-submit';
    const submission = {
      status: 'submitPending'
    };
    const pages = ['/introduction', '/review-and-submit'];
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}/>
    );
    it('a back button', () => {
      expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal('Back');
    });
    it('a disabled sending button', () => {
      expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Sending...');
      expect(tree.everySubTree('ProgressButton')[1].props.buttonClass).to.equal('usa-button-disabled');
    });
  });
  describe('when on /review-and-submit and submitted should render ', () => {
    const path = '/review-and-submit';
    const submission = {
      status: 'applicationSubmitted'
    };
    const pages = ['/introduction', '/review-and-submit'];
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}/>
    );
    it('a back button', () => {
      expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal('Back');
    });
    it('a green submitted button', () => {
      expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Submitted');
      expect(tree.everySubTree('ProgressButton')[1].props.buttonClass).to.equal('form-button-green');
    });
  });
  describe('when on /review-and-submit and there is an error should render ', () => {
    const path = '/review-and-submit';
    const submission = {
      status: 'adfadsf'
    };
    const pages = ['/introduction', '/review-and-submit'];
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}/>
    );
    it('a back button', () => {
      expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal('Back');
    });
    it('a disabled send failed button', () => {
      expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Send Failed');
      expect(tree.everySubTree('ProgressButton')[1].props.buttonClass).to.equal('usa-button-secondary form-button-disabled');
    });
    it('an error message', () => {
      expect(tree.everySubTree('.usa-alert-error').length).to.equal(1);
    });
  });

  it('if invalid on /review-and-submit should not submit', () => {
    const path = '/review-and-submit';
    const submission = {
      status: false
    };
    const pages = ['/introduction', '/review-and-submit'];
    const isValid = false;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();
    const onSubmit = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}
          onSubmit={onSubmit}/>
    );

    tree.everySubTree('ProgressButton')[1].props.onButtonClick();

    expect(onSubmit.called).to.be.false;
  });
  describe('if valid on /review-and-submit', () => {
    const path = '/review-and-submit';
    const pages = ['/introduction', '/review-and-submit'];
    const submission = {
      status: false
    };
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();
    const onSubmit = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}
          onSubmit={onSubmit}/>
    );

    it('should submit', () => {
      tree.everySubTree('ProgressButton')[1].props.onButtonClick();
      expect(onSubmit.called).to.be.true;
    });
  });
  describe('if valid', () => {
    const path = '/benefits-eligibility/benefits-selection';
    const pages = ['/introduction', '/benefits-eligibility/benefits-selection', '/review-and-submit'];
    const submission = {
      status: false
    };
    const isValid = true;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();
    const onSubmit = sinon.spy();
    const onComplete = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}
          onSubmit={onSubmit}
          onComplete={onComplete}/>
    );

    it('should navigate forward', () => {
      tree.everySubTree('ProgressButton')[1].props.onButtonClick();
      expect(onNavigate.calledWith('/review-and-submit')).to.be.true;
      expect(onComplete.calledWith(path)).to.be.true;
    });

    it('should navigate back', () => {
      tree.everySubTree('ProgressButton')[0].props.onButtonClick();
      expect(onNavigate.calledWith('/introduction')).to.be.true;
    });
  });
  describe('if invalid', () => {
    const path = '/benefits-eligibility/benefits-selection';
    const pages = ['/introduction', '/benefits-eligibility/benefits-selection', '/review-and-submit'];
    const submission = {
      status: false
    };
    const isValid = false;
    const dirtyPage = sinon.spy();
    const onNavigate = sinon.spy();
    const onSubmit = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <NavButtons
          submission={submission}
          path={path}
          pages={pages}
          isValid={isValid}
          dirtyPage={dirtyPage}
          onNavigate={onNavigate}
          onSubmit={onSubmit}/>
    );

    it('should not navigate forward', () => {
      tree.everySubTree('ProgressButton')[1].props.onButtonClick();
      expect(onNavigate.called).to.be.false;
    });

    it('should dirty fields', () => {
      tree.everySubTree('ProgressButton')[1].props.onButtonClick();
      expect(dirtyPage.calledWith(path)).to.be.true;
    });

    it('should navigate back', () => {
      tree.everySubTree('ProgressButton')[0].props.onButtonClick();
      expect(onNavigate.calledWith('/introduction')).to.be.true;
    });
  });
});
