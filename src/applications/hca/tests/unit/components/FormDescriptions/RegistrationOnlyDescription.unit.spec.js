import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import RegistrationOnlyDescription from '../../../../components/FormDescriptions/RegistrationOnlyDescription';

describe('hca <RegistrationOnlyDescription>', () => {
  const getData = ({ headingLevel = undefined }) => ({
    props: { headingLevel },
  });
  const subject = ({ props }) => {
    const { container } = render(<RegistrationOnlyDescription {...props} />);
    const selectors = () => ({
      h2: container.querySelector('h2'),
      h3: container.querySelector('h3'),
    });
    return { container, selectors };
  };

  it('should render with default heading level when prop is undefined', () => {
    const { props } = getData({});
    const { container, selectors } = subject({ props });
    expect(container).to.not.be.empty;
    expect(selectors().h3).to.exist;
  });

  it('should render with correct heading level when prop is defined', () => {
    const { props } = getData({ headingLevel: 2 });
    const { container, selectors } = subject({ props });
    expect(container).to.not.be.empty;
    expect(selectors().h2).to.exist;
  });
});
