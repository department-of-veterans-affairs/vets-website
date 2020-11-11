import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import VAPServiceEditModalErrorMessage from '../../components/base/VAPServiceEditModalErrorMessage';

describe('<VAPServiceEditModalErrorMessage />', () => {
  it('shows the correct error message when there is an invalid email', () => {
    const invalidEmailError = {
      errors: [
        {
          title: 'Check Email Address',
          detail:
            "Email address cannot have 2 @ symbols, must have at least one period '.' after the @ character, and cannot have '.%' or '%.' or '%..%' or \" ( ) , : ; < > @ [ ] or space unless in a quoted string in the local part.",
          code: 'VET360_EMAIL305',
          source: 'Vet360::ContactInformation::Service',
          status: '400',
        },
      ],
    };
    const wrapper = shallow(
      <VAPServiceEditModalErrorMessage
        clearErrors={() => {}}
        error={invalidEmailError}
        title=""
      />,
    );
    const alert = wrapper.find('AlertBox');
    const alertContentText = alert?.prop('content')?.props?.children?.props
      ?.children;
    expect(alertContentText).to.include(
      'It looks like the email you entered isn’t valid. Please enter your email address again.',
    );
    wrapper.unmount();
  });
});
