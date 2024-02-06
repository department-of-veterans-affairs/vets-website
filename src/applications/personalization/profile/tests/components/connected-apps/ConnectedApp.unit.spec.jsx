import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { ConnectedApp } from '../../../components/connected-apps/ConnectedApp';
import { getVaButtonByText } from '../../../../common/unitHelpers';

describe('<ConnectedApp>', () => {
  it('renders correctly', () => {
    const defaultProps = {
      attributes: {
        grants: [
          { created: '2020-06-27T12:42:41.798Z', title: 'hello' },
          { title: 'hello' },
          { title: 'hello' },
        ],
        logo: 'logoURL',
        title: 'Random title',
      },
      confirmDelete: () => {},
      id: '1',
    };

    const view = render(<ConnectedApp {...defaultProps} />);

    // image should be rendered with the correct src
    expect(
      view.container.querySelector(
        `img[src="${defaultProps.attributes.logo}"]`,
      ),
    ).to.exist;

    // title and connected date should be rendered
    expect(view.getByText('Random title', { selector: 'h2' })).to.exist;
    expect(view.getByText('Connected on June 27, 2020 6:42 a.m.')).to.exist;

    // button should be rendered with the correct text
    expect(view.findByTestId('disconnect-app-1')).to.be.ok;
    expect(getVaButtonByText('Disconnect', view)).to.be.ok;
  });
});
