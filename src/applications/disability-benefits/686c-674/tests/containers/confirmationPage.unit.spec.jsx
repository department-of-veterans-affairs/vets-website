import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { ConfirmationPage } from '../../containers/ConfirmationPage';

describe('Confirmation Page', () => {
  it('should render with data', () => {
    const form = {
      submission: {
        response: {
          timestamp: new Date().toISOString(),
        },
      },
      data: {
        veteranInformation: {
          fullName: {
            first: 'first',
            last: 'last',
          },
        },
      },
      formId: 'test',
    };

    const component = shallow(<ConfirmationPage form={form} />);
    const buttons = component.find('button');
    expect(buttons.length).to.eql(1);
    component.unmount();
  });

  it('should render without data', () => {
    const form = {
      submission: {
        response: {
          timestamp: null,
        },
      },
      data: {
        veteranInformation: {
          fullName: {
            first: null,
            last: null,
          },
        },
      },
      formId: 'test',
    };

    const component = shallow(<ConfirmationPage form={form} />);
    const buttons = component.find('button');
    expect(buttons.length).to.eql(1);
    component.unmount();
  });
});
