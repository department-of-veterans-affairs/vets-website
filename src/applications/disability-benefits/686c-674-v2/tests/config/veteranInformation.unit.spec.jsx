import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import createCommonStore from 'platform/startup/store';
import VeteranInformationComponent from '../../config/chapters/veteran-information/veteran-information/VeteranInformationComponent';

const defaultStore = createCommonStore();

describe('Veteran Information Component', () => {
  it('Should Render an h3 element with the correct text', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <VeteranInformationComponent />
      </Provider>,
    );

    const heading = getByText(
      'Confirm the personal information we have on file for you.',
    );
    expect(heading.tagName).to.equal('H3');
  });

  it('Should Render a div with the specific class name', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <VeteranInformationComponent />
      </Provider>,
    );

    const divElement = container.querySelector('.blue-bar-block');
    expect(divElement).to.not.be.null;
  });
});
