import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import VeteranNameDescription from '../../../../components/FormDescriptions/VeteranNameDescription';

describe('10-7959a <VeteranNameDescription>', () => {
  const subject = ({ role = '' }) => {
    const props = { formData: { certifierRole: role } };
    return render(<VeteranNameDescription {...props} />);
  };

  it('should render correct content when certifier role is `sponsor`', () => {
    const { queryByTestId } = subject({ role: 'sponsor' });
    expect(queryByTestId('veteran-name-description')).to.exist;
  });

  it('should render correct content when certifier role is not `sponsor`', () => {
    const { queryByTestId, getByText } = subject({ role: 'veteran' });
    expect(queryByTestId('veteran-name-description')).to.not.exist;
    expect(getByText(/Enter the Veteran.?s name/i)).to.exist;
  });
});
