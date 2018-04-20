import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';

import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';

import { focusElement } from '../../../../platform/utilities/ui';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export default class ReviewPage extends React.Component {
  componentDidMount() {
    scrollToTop();
    focusElement('h4');
  }

  handleEdit = (pageKey, editing, index = null) => {
    const fullPageKey = `${pageKey}${index === null ? '' : index}`;
    if (editing) {
      this.props.setPagesViewed([fullPageKey]);
    }
    this.props.setEditMode(pageKey, editing, index);
  }

  handleToggleChapter(toggledChapter) {
    if (this.props.openChapters.includes(toggledChapter)) {
      this.props.closeReviewChapter(toggledChapter);
    } else {
      this.props.openReviewChapter(toggledChapter);
    }
  }

  render() {
    const {
      chapterNames,
      chapterFormConfigs,
      form,
      formContext,
      openChapters,
      pagesByChapter,
      setData,
      setPagesViewed,
      setValid,
      viewedPages
    } = this.props;

    return (
      <div>
        <div className="input-section">
          <div>
            {chapterNames.map(chapterName => (
              <ReviewCollapsibleChapter
                key={chapterName}
                onEdit={this.handleEdit}
                toggleButtonClicked={() => this.handleToggleChapter(chapterName)}
                open={openChapters.includes(chapterName)}
                pages={pagesByChapter[chapterName]}
                chapterKey={chapterName}
                setData={setData}
                setValid={setValid}
                uploadFile={this.props.uploadFile}
                chapterFormConfig={chapterFormConfigs[chapterName]}
                viewedPages={viewedPages}
                setPagesViewed={setPagesViewed}
                formContext={formContext}
                form={form}/>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ReviewPage.propTypes = {
  closeReviewChapter: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formContext: PropTypes.object,
  openChapters: PropTypes.array.isRequired,
  openReviewChapter: PropTypes.func.isRequired,
  renderErrorMessage: PropTypes.func,
  pagesByChapter: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  setPrivacyAgreement: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired
};

