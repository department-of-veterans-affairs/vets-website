import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { setupPages } from '../utils/taskListPages';

export default function App(props) {
  const { location, children } = props;
  const { chapterTitles, findPageFromPath } = setupPages(formConfig);
  const currentPath = location.pathname;
  const { chapterIndex } = findPageFromPath(currentPath);

  const noHeader = ['/introduction', '/confirmation'];

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <div className="row">
        {!noHeader.includes(currentPath) && (
          <div>
            <h1>Ask VA</h1>
            <div className="usa-width-two-thirds medium-8 vads-u-margin-top--2 vads-u-padding-x--0">
              <va-segmented-progress-bar
                current={chapterIndex + 1}
                heading-text={chapterTitles[chapterIndex]}
                label=""
                labels={chapterTitles.join(';')}
                total={chapterTitles.length}
                uswds
              />
            </div>
          </div>
        )}
        {children}
      </div>
    </RoutedSavableApp>
  );
}
