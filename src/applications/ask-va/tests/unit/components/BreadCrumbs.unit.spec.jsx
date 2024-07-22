import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import BreadCrumbs from '../../../components/BreadCrumbs';
import { breadcrumbsDictionary } from '../../../constants';

describe('BreadCrumbs component', () => {
  it('does not render breadcrumb links if currentLocation does not match', () => {
    const currentLocation = '/unknown-location';
    const { queryByText } = render(
      <BreadCrumbs currentLocation={currentLocation} />,
    );

    // Since there are no breadcrumbs defined for '/unknown-location', no links should be rendered
    Object.values(breadcrumbsDictionary).forEach(breadcrumbs => {
      breadcrumbs.forEach(link => {
        expect(queryByText(link.label)).to.not.exist;
      });
    });
  });
});
