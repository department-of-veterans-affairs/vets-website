import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { BrowserRouter } from 'react-router-dom';
import AuthorizationAlert, {
  EVIDENCE_PRIVATE_MEDICAL_RECORDS,
} from '../../components/AuthorizationAlert';

const MockBasicLink = ({ path, text, className, onClick, ...props }) => (
  <a
    href={path}
    className={className}
    onClick={e => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
      // Simulate navigation by setting window.location
      Object.defineProperty(window, 'location', {
        value: { pathname: path },
        writable: true,
      });
    }}
    data-testid="basic-link"
    {...props}
  >
    {text}
  </a>
);

const createMockFunction = () => {
  const calls = [];
  const mockFn = (...args) => {
    calls.push(args);
    return mockFn;
  };
  mockFn.calls = calls;
  mockFn.mockClear = () => {
    calls.length = 0;
  };
  return mockFn;
};

describe('AuthorizationAlert Component', () => {
  let mockOnAnchorClick;

  const defaultProps = {
    hasError: true,
    onAnchorClick: null,
  };

  beforeEach(() => {
    mockOnAnchorClick = createMockFunction();
    defaultProps.onAnchorClick = mockOnAnchorClick;

    require('../../components/BasicLink').default = MockBasicLink;

    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });
  });

  const setup = (
    props = {
      hasError: true,
      onAnchorClick: null,
    },
  ) => {
    return render(
      <BrowserRouter>
        <AuthorizationAlert {...props} />
      </BrowserRouter>,
    );
  };

  describe('BasicLink Navigation', () => {
    it('should render BasicLink with correct path and text', () => {
      const screen = setup({
        hasError: true,
        onAnchorClick: null,
      });

      const basicLink = screen.getByTestId('goBack');

      expect(basicLink).to.exist;
      expect(basicLink).to.have.attribute(
        'href',
        `/${EVIDENCE_PRIVATE_MEDICAL_RECORDS}`,
      );
    });

    describe('Component Integration', () => {
      it('should render alert with error state and interactive BasicLink', () => {
        const screen = setup({
          hasError: true,
          onAnchorClick: null,
        });

        expect(screen.getByRole('alert')).to.exist;

        const basicLink = screen.getByTestId('goBack');
        expect(basicLink).to.exist;

        fireEvent.click(basicLink);
        expect(window.location.pathname).to.equal(
          `/${EVIDENCE_PRIVATE_MEDICAL_RECORDS}`,
        );
      });

      it('should have visible set to false when BasicLink hasError is false', () => {
        const screen = setup({
          hasError: false,
          onAnchorClick: null,
        });

        expect(screen.getByRole('alert')).to.attribute('visible', 'false');
      });
    });
  });
});
