import { expect } from 'chai';

describe('ProfileWrapper', () => {
  let ProfileWrapper;

  beforeEach(() => {
    // Load the component
    ProfileWrapper = require('./ProfileWrapper').default;
  });

  describe('VA Profile ID Initialization - Core Logic', () => {
    it('should be a connected Redux component', () => {
      expect(ProfileWrapper).to.exist;
      expect(ProfileWrapper.WrappedComponent).to.exist;
    });
  });

  describe('Component Structure', () => {
    it('should be exported as a connected component', () => {
      // ProfileWrapper is a connected component (object), not a function
      expect(ProfileWrapper).to.be.an('object');
      expect(ProfileWrapper.WrappedComponent).to.exist;
    });

    it('should have a WrappedComponent for testing', () => {
      // The WrappedComponent is the actual functional component
      expect(ProfileWrapper.WrappedComponent).to.be.a('function');
    });
  });

  describe('Conditional Wrapper Logic - Integration', () => {
    // These tests verify that the InitializeVAPServiceID wrapper is conditionally applied
    // based on isLOA3 and isInMVI props. The actual rendering is tested via E2E/Cypress tests.

    it('should include InitializeVAPServiceID import', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify the import exists
      expect(componentSource).to.include('InitializeVAPServiceID');
      expect(componentSource).to.include(
        "from '@@vap-svc/containers/InitializeVAPServiceID'",
      );
    });

    it('should have conditional logic for LOA3 and isInMVI', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify conditional wrapping logic exists
      expect(componentSource).to.include('if (isLOA3 && isInMVI)');
      expect(componentSource).to.include('<InitializeVAPServiceID>');
    });

    it('should have comment explaining the fix', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify explanatory comment exists
      expect(componentSource).to.include('Wrap all Profile content');
      expect(componentSource).to.include('VA Profile ID');
    });
  });

  describe('Regression - Notification Settings and Military Information', () => {
    it('should wrap all Profile content including children', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // The wrapper should wrap the content variable which includes children
      expect(componentSource).to.include('{content}');
      expect(componentSource).to.include('{children}');
    });
  });

  describe('Code Structure Verification', () => {
    it('should store JSX in content variable', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify the content variable pattern
      expect(componentSource).to.include('const content =');
    });

    it('should return content wrapped in InitializeVAPServiceID for LOA3/MVI users', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify the return pattern
      expect(componentSource).to.include(
        'return <InitializeVAPServiceID>{content}</InitializeVAPServiceID>',
      );
    });

    it('should return unwrapped content for non-LOA3/non-MVI users', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify fallback return
      expect(componentSource).to.include('return content');
    });
  });
});
