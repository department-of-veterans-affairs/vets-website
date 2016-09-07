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

    return (
      <h4 className={className}><span className="form-process-step current">{step}</span> of {total} {name}</h4>
    );
  }
}

NavHeader.propTypes = {
  path: React.PropTypes.string.isRequired,
  chapters: React.PropTypes.array.isRequired,
  className: React.PropTypes.string
};
