import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';
import { GiBillApp } from 'applications/gi/containers/GiBillApp';
import reducer from '../../reducers';
import { Provider } from 'react-redux';

const defaultStore = createCommonStore(reducer);

const defaultProps = {
  ...defaultStore.getState(),
  dispatchFetchConstants: () => {},
  dispatchEnterPreviewMode: () => {},
  dispatchExitPreviewMode: () => {},
};

describe('<GiBillApp>', () => {
  it.skip('should render', () => {
    const tree = mount(
      <MemoryRouter>
        <Provider store={defaultStore}>
          <GiBillApp {...defaultProps} />
        </Provider>
      </MemoryRouter>,
    );

    expect(tree.find('div.gi-app').length).to.eq(1);
    tree.unmount();
  });

  it('should render LoadingIndicator', () => {
    const props = {
      ...defaultProps,
      constants: {
        ...defaultProps.constants,
        inProgress: true,
      },
    };
    const tree = mount(
      <MemoryRouter>
        <Provider store={defaultStore}>
          <GiBillApp {...props} />
        </Provider>
      </MemoryRouter>,
    );

    expect(tree.find('.loading-indicator-container').length).to.eq(1);
    tree.unmount();
  });

  it('should render error message when constants fail', () => {
    const errorProps = {
      ...defaultProps,
      constants: {
        ...defaultProps.constants,
        inProgress: true,
        error: 'Service Unavailable',
      },
    };
    const tree = mount(
      <MemoryRouter>
        <Provider store={defaultStore}>
          <GiBillApp {...errorProps} />
        </Provider>
      </MemoryRouter>,
    );
    expect(tree.find('ServiceError').length).to.eq(1);
    tree.unmount();
  });
});
