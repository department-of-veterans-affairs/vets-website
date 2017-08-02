import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import SkinDeep from 'skin-deep';

import { RequiredTermsAcceptanceView } from '../../../src/js/common/components/RequiredTermsAcceptanceView';
import createCommonStore from '../../../src/js/common/store';

const defaultProps = {
  store: createCommonStore(),
  checkAcceptance: sinon.spy(),
  fetchLatestTerms: sinon.spy(),
  acceptTerms: sinon.spy(),
  termsNeeded: true,
  terms: {
    acceptance: false,
  }
};

describe('<RequiredTermsAcceptanceView>', () => {
  it('should call initial actions properly', () => {
    const tree = SkinDeep.shallowRender(
      <RequiredTermsAcceptanceView {...defaultProps}/>
    );
    tree.getMountedInstance().componentDidMount();

    expect(defaultProps.fetchLatestTerms.called).to.be.true;
  });

  it('should properly render loading state', () => {
    const props = {
      ...defaultProps,
      terms: {
        loading: true,
      }
    };
    const tree = SkinDeep.shallowRender(
      <RequiredTermsAcceptanceView {...props}/>
    );

    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });

  it('should properly render children if terms accepted', () => {
    const props = {
      ...defaultProps,
      termsNeeded: false,
      terms: {
        acceptance: true,
      }
    };
    const tree = SkinDeep.shallowRender(
      <RequiredTermsAcceptanceView {...props}/>
    );

    expect(tree.toString()).to.eq('<div>\n\n</div>');
  });

  it('should properly render prompt if terms not accepted', () => {
    const tree = SkinDeep.shallowRender(
      <RequiredTermsAcceptanceView {...defaultProps}/>
    );

    expect(tree.subTree('AcceptTermsPrompt')).to.be.ok;
  });
});
