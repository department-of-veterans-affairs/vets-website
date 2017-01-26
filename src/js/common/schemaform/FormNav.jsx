import React from 'react';
import shallowEqual from 'recompose/shallowEqual';

import SegmentedProgressBar from '../components/SegmentedProgressBar';

import { createFormPageList, createPageList } from './helpers';

export default class FormNav extends React.Component {
  // The formConfig transforming is a little heavy, so skip it if we can
  shouldComponentUpdate(newProps) {
    return !shallowEqual(this.props, newProps);
  }
  render() {
    const { formConfig, currentPath } = this.props;

    // This is converting the config into a list of pages with chapter keys,
    // finding the current page, then getting the chapter name using the key
    const formPages = createFormPageList(formConfig);
    const pageList = createPageList(formConfig, formPages);
    const page = pageList.filter(p => p.path.endsWith(currentPath))[0];
    const chapters = Object.keys(formConfig.chapters).concat('review');
    const current = chapters.indexOf(page.chapterKey) + 1;
    // The review page is always part of our forms, but isn't listed in chapter list
    const chapterName = page.chapterKey === 'review'
      ? 'Review Application'
      : formConfig.chapters[page.chapterKey].title;

    return (
      <div>
        <SegmentedProgressBar total={chapters.length} current={current}/>
        <div className="schemaform-chapter-progress">
          <h4
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin="1"
              aria-valuetext={`Step ${current} of ${chapters.length}: ${chapterName}`}
              aria-valuemax={chapters.length}
              className="nav-header nav-header-schemaform">
            <span className="form-process-step current">{current}</span> <span className="form-process-total">of {chapters.length}</span> {chapterName}
          </h4>
        </div>
      </div>
    );
  }
}
