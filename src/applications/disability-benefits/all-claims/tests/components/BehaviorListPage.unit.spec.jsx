import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';

import BehaviorListPage from '../../components/BehaviorListPage';
import {
  BEHAVIOR_LIST_SECTION_SUBTITLES,
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../../constants';

describe('BehaviorListPage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
  } = {}) => {
    return (
      <div>
        <BehaviorListPage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
        />
      </div>
    );
  };

  it('should render with all checkboxes', () => {
    const { container } = render(page());
    expect($$('va-checkbox-group', container).length).to.equal(4);

    expect($$('va-checkbox', container).length).to.equal(16);

    // verify subtitles for checkbox sections are present
    Object.values(BEHAVIOR_LIST_SECTION_SUBTITLES).forEach(option => {
      expect($$(`va-checkbox[title="${option}"]`, container)).to.exist;
    });

    // verify each checkbox exists with user facing label
    Object.values(BEHAVIOR_CHANGES_WORK).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(BEHAVIOR_CHANGES_HEALTH).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(BEHAVIOR_CHANGES_OTHER).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    expect($$(`va-checkbox[label="none"]`, container)).to.exist;
  });

  it('should submit without making a selection', () => {
    const goForwardSpy = sinon.spy();

    const data = {
      syncModern0781Flow: true,
    };

    const { container } = render(page({ data, goForward: goForwardSpy }));

    fireEvent.click($('button[type="submit"]', container));
    expect(goForwardSpy.called).to.be.true;
  });

  it('should submit if selections made', () => {
    const goForwardSpy = sinon.spy();

    const data = {
      syncModern0781Flow: true,
      workBehaviors: {
        reassignment: true,
        absences: false,
      },
      otherBehaviors: {
        unlisted: true,
      },
      'view:noneCheckbox': { 'view:noBehaviorChanges': false },
    };

    const { container } = render(page({ data, goForward: goForwardSpy }));

    fireEvent.click($('button[type="submit"]', container));
    expect(goForwardSpy.called).to.be.true;
  });
});
