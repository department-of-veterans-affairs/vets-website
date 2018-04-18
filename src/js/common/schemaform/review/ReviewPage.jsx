import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import recordEvent from '../../../../platform/monitoring/record-event';

import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';

import { focusElement } from '../../../../platform/utilities/ui';
import {
  createPageListByChapter,
} from '../helpers';
import { getReviewPageOpenChapters } from '../state/selectors';
import {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setPrivacyAgreement,
  setEditMode,
  setSubmission,
  submitForm,
  uploadFile
} from '../actions';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export default class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
  }

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
      chapters,
      chapterNames,
      chapterFormConfigs,
      form,
      formConfig,
      formContext,
      contentAfterButtons,
      openChapters,
      pagesByChapter,
      renderErrorMessage,
      setData,
      setPagesViewed,
      setValid,
      uploadFile,
      viewedPages
    } = this.props;
    console.log(chapters);

    return (
      <div>
        <div className="input-section">
          <div>
            {chapterNames.map(chapterName=> (
              <ReviewCollapsibleChapter
                key={chapterName}
                onEdit={this.handleEdit}
                toggleButtonClicked={() => this.handleToggleChapter(chapterName)}
                open={openChapters.includes(chapterName)}
                pages={pagesByChapter[chapterName]}
                chapterKey={chapterName}
                setData={setData}
                setValid={setValid}
                uploadFile={uploadFile}
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

