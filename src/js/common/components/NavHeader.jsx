import React from 'react';

export default class NavHeader extends React.Component {
  render() {
    const { chapters, path, className } = this.props;
    const total = chapters.length;

    let step;
    let name;
    chapters
      .forEach((chapter, index) => {
        if (chapter.pages.some(page => page.path === path)) {
          step = index + 1;
          name = chapter.name;
        }
      });

    return step
      ? <h4
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin="1"
          aria-valuetext={`Step ${step} of ${total}: ${name}`}
          aria-valuemax={total}
          className={`nav-header ${className}`}>
        <span className="form-process-step current">{step}</span> of {total} {name}
      </h4>
      : null;
  }
}

NavHeader.propTypes = {
  path: React.PropTypes.string.isRequired,
  chapters: React.PropTypes.array.isRequired,
  className: React.PropTypes.string
};
