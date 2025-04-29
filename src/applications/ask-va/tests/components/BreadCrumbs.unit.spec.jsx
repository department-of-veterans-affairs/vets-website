import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import BreadCrumbs from '../../components/BreadCrumbs';
import {
  askVABreadcrumbs,
  newQuestionBreadcrumbs,
  questionDetailsBreadcrumbs,
  responseSentBreadcrumbs,
} from '../../constants';
import manifest from '../../manifest.json';

describe('BreadCrumbs component', () => {
  it('renders breadcrumb links for introduction path', () => {
    const currentLocation = '/introduction';
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    const breadcrumb = screen.getByTestId('Breadcrumb');
    expect(breadcrumb).to.exist;
    expect(breadcrumb.getAttribute('breadcrumb-list')).to.equal(
      JSON.stringify(askVABreadcrumbs),
    );
  });

  it('renders breadcrumb links for user dashboard path', () => {
    const currentLocation = `${manifest.rootUrl}/user/dashboard`;
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    const breadcrumb = screen.getByTestId('Breadcrumb');
    expect(breadcrumb).to.exist;
    expect(breadcrumb.getAttribute('breadcrumb-list')).to.equal(
      JSON.stringify(questionDetailsBreadcrumbs),
    );
  });

  it('renders breadcrumb links for response sent path', () => {
    const currentLocation = '/response-sent';
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    const breadcrumb = screen.getByTestId('Breadcrumb');
    expect(breadcrumb).to.exist;
    expect(breadcrumb.getAttribute('breadcrumb-list')).to.equal(
      JSON.stringify(responseSentBreadcrumbs),
    );
  });

  it('renders breadcrumb links for new question path (default case)', () => {
    const currentLocation = '/some-unknown-path';
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    const breadcrumb = screen.getByTestId('Breadcrumb');
    expect(breadcrumb).to.exist;
    expect(breadcrumb.getAttribute('breadcrumb-list')).to.equal(
      JSON.stringify(newQuestionBreadcrumbs),
    );
  });

  it('renders with correct CSS classes', () => {
    const currentLocation = '/introduction';
    const screen = render(<BreadCrumbs currentLocation={currentLocation} />);

    const outerDiv = screen.getByTestId('Breadcrumb').parentElement
      .parentElement;
    expect(outerDiv.className).to.equal('row');
    expect(outerDiv.firstChild.className).to.equal(
      'usa-width-two-thirds medium-8 columns',
    );
  });
});
