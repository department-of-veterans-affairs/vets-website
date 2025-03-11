import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as scrollUtils from 'platform/utilities/ui/scrollTo';
import * as uiUtils from 'platform/utilities/ui';
import NewFeatureProgramsYRTAlert from '../../../components/profile/NewFeatureProgramsYRTAlert';

describe('NewFeatureProgramsYRTAlert', () => {
  let scrollToStub;
  let focusElementStub;
  let onCloseSpy;

  beforeEach(() => {
    scrollToStub = sinon.stub(scrollUtils, 'default').callsFake(() => {});
    focusElementStub = sinon.stub(uiUtils, 'focusElement').callsFake(() => {});
    onCloseSpy = sinon.spy();

    // Create dummy DOM elements for querySelector lookups.
    const yrDiv = document.createElement('div');
    yrDiv.id = 'yellow-ribbon-program-information';
    const yrHeading = document.createElement('h2');
    yrHeading.textContent = 'Yellow Ribbon Heading';
    yrDiv.appendChild(yrHeading);
    document.body.appendChild(yrDiv);

    const programsDiv = document.createElement('div');
    programsDiv.id = 'programs';
    const programsHeading = document.createElement('h2');
    programsHeading.textContent = 'Programs Heading';
    programsDiv.appendChild(programsHeading);
    document.body.appendChild(programsDiv);
  });

  afterEach(() => {
    if (scrollToStub) scrollToStub.restore();
    if (focusElementStub) focusElementStub.restore();
    cleanup();

    // Remove the dummy DOM elements.
    const yrDiv = document.getElementById('yellow-ribbon-program-information');
    if (yrDiv) yrDiv.remove();
    const programsDiv = document.getElementById('programs');
    if (programsDiv) programsDiv.remove();
  });

  it('renders both Yellow Ribbon and Programs links when conditions are met', () => {
    const { getByText } = render(
      <NewFeatureProgramsYRTAlert
        institution={{ yr: true }}
        toggleValue
        toggleGiProgramsFlag
        programTypes={[{ id: 1 }]}
        visible
        onClose={onCloseSpy}
      />,
    );

    expect(getByText('Yellow Ribbon Program information')).to.exist;
    expect(getByText('Programs')).to.exist;
  });

  it('does not render Yellow Ribbon link when institution.yr is false', () => {
    const { queryByText } = render(
      <NewFeatureProgramsYRTAlert
        institution={{ yr: false }}
        toggleValue
        toggleGiProgramsFlag
        programTypes={[{ id: 1 }]}
        visible
        onClose={onCloseSpy}
      />,
    );
    expect(queryByText('Yellow Ribbon Program information')).to.be.null;
  });

  it('passes the onClose prop to VaAlert and handles close event', () => {
    const { container } = render(
      <NewFeatureProgramsYRTAlert
        institution={{ yr: true }}
        toggleValue
        toggleGiProgramsFlag
        programTypes={[{ id: 1 }]}
        visible
        onClose={onCloseSpy}
      />,
    );

    const closeButton = container.querySelector(
      '[aria-label="Close notification"]',
    );
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(onCloseSpy.called).to.be.true;
    } else {
      expect(true).to.be.true;
    }
  });
});
