import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import FormFooter from '../../components/FormFooter';

describe('FormFooter', () => {
  it('should not render with no getHelp value', () => {
    const { container } = render(
      <FormFooter
        formConfig={{}}
        currentLocation={{ pathname: '/introduction' }}
      />,
    );

    expect($('va-need-help', container)).to.not.exist;
    expect(container.textContent).to.be.empty;
  });

  it('should not render and not throw errors with no props', () => {
    const { container } = render(<FormFooter />);
    expect($('va-need-help', container)).to.not.exist;
    expect(container.textContent).to.be.empty;
  });

  it('should not render if on the confirmation page', () => {
    const GetFormHelp = () => {
      return <div id="inner">Help!</div>;
    };
    const { container } = render(
      <FormFooter
        formConfig={{ getHelp: GetFormHelp }}
        currentLocation={{ pathname: '/confirmation' }}
      />,
    );

    expect($('va-need-help', container)).to.not.exist;
    expect(container.textContent).to.be.empty;
  });

  it('should render <GetFormHelp> if passed to config', () => {
    let renderedProps;
    const GetFormHelp = props => {
      renderedProps = props;
      return <div id="inner">Help!</div>;
    };
    const { container } = render(
      <FormFooter
        formConfig={{ getHelp: GetFormHelp }}
        currentLocation={{ pathname: '/introduction' }}
      />,
    );

    expect($('#inner', container).textContent).to.contain('Help!');
    expect(renderedProps).to.haveOwnProperty('formConfig');
  });
});
