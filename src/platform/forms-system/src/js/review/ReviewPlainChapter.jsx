import PropTypes from 'prop-types';
import React from 'react';
import { Element } from 'platform/utilities/scroll';
import { SCROLL_ELEMENT_SUFFIX } from '../../../../utilities/constants';
import ReviewChapterContent from './ReviewChapterContent';
import { getChapterTitle } from './utils';

const ReviewPlainChapter = props => {
  const { chapterFormConfig, chapterKey, form } = props;
  const chapterTitle = getChapterTitle(
    chapterFormConfig,
    form.data,
    form,
    true,
  );

  return (
    <section className="form-review-chapter">
      <Element name={`chapter${chapterKey}${SCROLL_ELEMENT_SUFFIX}`} />
      <h2 className="vads-u-margin-top--0">{chapterTitle}</h2>
      <ReviewChapterContent {...props} />
    </section>
  );
};

ReviewPlainChapter.propTypes = {
  chapterFormConfig: PropTypes.object.isRequired,
  chapterKey: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
};

export default ReviewPlainChapter;
export { ReviewPlainChapter };
