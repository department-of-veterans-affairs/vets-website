import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { useContactInfoDeepLink } from '../../hooks/useContactInfoDeepLink';

// Test component that uses the hook
const TestComponent = ({ onResult }) => {
  const { generateContactInfoLink } = useContactInfoDeepLink();

  React.useEffect(
    () => {
      if (onResult) {
        onResult({ generateContactInfoLink });
      }
    },
    [generateContactInfoLink, onResult],
  );

  return <div>Test Component</div>;
};

TestComponent.propTypes = {
  onResult: PropTypes.func,
};

describe('useContactInfoDeepLink hook', () => {
  let sandbox;
  let resultCallback;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    resultCallback = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderHook = (props = {}) => {
    return render(<TestComponent onResult={resultCallback} {...props} />);
  };

  describe('generateContactInfoLink', () => {
    it('generates correct URL with fieldName only', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];
      const result = generateContactInfoLink({ fieldName: 'mobilePhone' });

      expect(result).to.equal('/profile/edit?fieldName=mobilePhone');
    });

    it('generates correct URL with fieldName and returnPath', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];
      const result = generateContactInfoLink({
        fieldName: 'homePhone',
        returnPath: '/profile/contact-information',
      });

      expect(result).to.equal(
        '/profile/edit?fieldName=homePhone&returnPath=/profile/contact-information',
      );
    });

    it('handles different fieldName values', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];

      expect(generateContactInfoLink({ fieldName: 'email' })).to.equal(
        '/profile/edit?fieldName=email',
      );
      expect(generateContactInfoLink({ fieldName: 'mailingAddress' })).to.equal(
        '/profile/edit?fieldName=mailingAddress',
      );
      expect(
        generateContactInfoLink({ fieldName: 'residentialAddress' }),
      ).to.equal('/profile/edit?fieldName=residentialAddress');
    });

    it('handles different returnPath values', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];

      expect(
        generateContactInfoLink({
          fieldName: 'mobilePhone',
          returnPath: '/profile',
        }),
      ).to.equal('/profile/edit?fieldName=mobilePhone&returnPath=/profile');

      expect(
        generateContactInfoLink({
          fieldName: 'mobilePhone',
          returnPath: '/profile/personal-information',
        }),
      ).to.equal(
        '/profile/edit?fieldName=mobilePhone&returnPath=/profile/personal-information',
      );
    });

    it('handles empty returnPath as null', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];
      const result = generateContactInfoLink({
        fieldName: 'mobilePhone',
        returnPath: null,
      });

      expect(result).to.equal('/profile/edit?fieldName=mobilePhone');
    });

    it('handles undefined returnPath', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];
      const result = generateContactInfoLink({
        fieldName: 'mobilePhone',
        returnPath: undefined,
      });

      expect(result).to.equal('/profile/edit?fieldName=mobilePhone');
    });

    it('handles empty string returnPath', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];
      const result = generateContactInfoLink({
        fieldName: 'mobilePhone',
        returnPath: '',
      });

      expect(result).to.equal('/profile/edit?fieldName=mobilePhone');
    });

    it('handles special characters in fieldName', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];
      const result = generateContactInfoLink({
        fieldName: 'field-with-dashes',
      });

      expect(result).to.equal('/profile/edit?fieldName=field-with-dashes');
    });

    it('handles special characters in returnPath', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];
      const result = generateContactInfoLink({
        fieldName: 'mobilePhone',
        returnPath: '/profile/path with spaces',
      });

      expect(result).to.equal(
        '/profile/edit?fieldName=mobilePhone&returnPath=/profile/path with spaces',
      );
    });

    it('returns the same function reference on re-renders', () => {
      const { rerender } = renderHook();

      const firstResult = resultCallback.lastCall.args[0];
      rerender(<TestComponent onResult={resultCallback} />);
      const secondResult = resultCallback.lastCall.args[0];

      expect(firstResult.generateContactInfoLink).to.equal(
        secondResult.generateContactInfoLink,
      );
    });

    it('returns consistent results for same inputs', () => {
      renderHook();

      const { generateContactInfoLink } = resultCallback.lastCall.args[0];

      const result1 = generateContactInfoLink({
        fieldName: 'mobilePhone',
        returnPath: '/profile/contact-information',
      });
      const result2 = generateContactInfoLink({
        fieldName: 'mobilePhone',
        returnPath: '/profile/contact-information',
      });

      expect(result1).to.equal(result2);
      expect(result1).to.equal(
        '/profile/edit?fieldName=mobilePhone&returnPath=/profile/contact-information',
      );
    });
  });

  describe('hook return value', () => {
    it('returns an object with generateContactInfoLink function', () => {
      renderHook();

      const result = resultCallback.lastCall.args[0];

      expect(result).to.be.an('object');
      expect(result).to.have.property('generateContactInfoLink');
      expect(result.generateContactInfoLink).to.be.a('function');
    });

    it('returns only the generateContactInfoLink property', () => {
      renderHook();

      const result = resultCallback.lastCall.args[0];

      expect(Object.keys(result)).to.have.lengthOf(1);
      expect(result).to.have.property('generateContactInfoLink');
    });
  });
});
