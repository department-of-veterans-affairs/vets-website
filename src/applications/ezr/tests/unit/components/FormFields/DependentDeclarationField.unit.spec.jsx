import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentDeclarationField from '../../../../components/FormFields/DependentDeclarationField';
import content from '../../../../locales/en/content.json';

describe('ezr <DependentDeclarationField>', () => {
  const getData = ({
    error = false,
    hasList = false,
    defaultValue = null,
  }) => ({
    props: {
      error,
      hasList,
      defaultValue,
      onChange: sinon.spy(),
    },
  });

  context('when no default value is provided', () => {
    it('should render radio inputs without checked attribute', () => {
      const { props } = getData({});
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelectorAll('input[type="radio"]');
      selector.forEach(input => {
        expect(input).not.to.have.attr('checked');
      });
    });
  });

  context('when a default value is provided', () => {
    it('should render radio inputs with correct checked attribute based on value selected', () => {
      const { props } = getData({ defaultValue: true });
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('input[value="Y"]');
      expect(selector).to.have.attr('checked');
    });
  });

  context('when fieldset does not have an error', () => {
    it('should not render error message', () => {
      const { props } = getData({});
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.usa-input-error-message');
      expect(selector).to.not.exist;
    });
  });

  context('when fieldset has an error', () => {
    it('should render error message when `error` is set to `true`', () => {
      const { props } = getData({ error: true });
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.usa-input-error-message');
      expect(selector).to.exist;
    });
  });

  context('when dependents list is empty', () => {
    it('should render with default question', () => {
      const { props } = getData({});
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.schemaform-label');
      expect(selector).to.contain.text(
        content['household-dependent-report-question'],
      );
    });
  });

  context('when dependents list is not empty', () => {
    it('should render with alternative question', () => {
      const { props } = getData({ hasList: true });
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.schemaform-label');
      expect(selector).to.contain.text(
        content['household-dependent-report-question-addtl'],
      );
    });
  });

  context('when radio value is selected', () => {
    it('should fire the `onChange` prop', () => {
      const { props } = getData({ error: true });
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('input[value="N"]');
      fireEvent.click(selector);
      expect(props.onChange.called).to.be.true;
    });
  });
});
