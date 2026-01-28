import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Element } from 'platform/utilities/scroll';
import { isMinimalHeaderApp } from 'platform/forms-system/src/js/patterns/minimal-header';
import { SCROLL_ELEMENT_SUFFIX } from '../../../../utilities/constants';
import set from '../../../../utilities/data/set';
import { setFormErrors } from '../actions';
import ReviewChapterContent from './ReviewChapterContent';
import { getChapterTitle } from './utils';

/*
 * Displays all the pages in a chapter on the review page
 */
class ReviewCollapsibleChapter extends React.Component {
  handleEdit = (key, editing, index = null) => {
    this.props.onEdit(key, editing, index);
  };

  handleSubmit = (formData, key, path = null, index = null) => {
    if (path) {
      const newData = set([path, index], formData, this.props.form.data);
      this.props.setData(newData);
    }

    this.props.onEdit(key, false, index);
  };

  render() {
    const { chapterFormConfig, form } = this.props;
    const chapterTitle = getChapterTitle(
      chapterFormConfig,
      form.data,
      form,
      true,
    );
    const subHeader = 'Some information has changed. Please review.';

    return (
      <>
        <Element
          name={`chapter${this.props.chapterKey}${SCROLL_ELEMENT_SUFFIX}`}
        />
        <va-accordion-item
          data-chapter={this.props.chapterKey}
          subHeader={this.props.hasUnviewedPages ? subHeader : ''}
          data-unviewed-pages={this.props.hasUnviewedPages}
          open={this.props.open}
          bordered
          uswds
        >
          {isMinimalHeaderApp() ? (
            <h2 slot="headline">{chapterTitle}</h2>
          ) : (
            <h3 slot="headline">{chapterTitle}</h3>
          )}
          {this.props.hasUnviewedPages && (
            <va-icon slot="icon" icon="error" class="vads-u-color--secondary" />
          )}
          {ReviewChapterContent({
            ...this.props,
            onEdit: this.handleEdit,
          })}
        </va-accordion-item>
      </>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
  setFormErrors,
};

// TODO: refactor to pass form.data instead of the entire form object
ReviewCollapsibleChapter.propTypes = {
  chapterFormConfig: PropTypes.object.isRequired,
  chapterKey: PropTypes.string.isRequired,
  filterEmptyFields: PropTypes.bool,
  form: PropTypes.object.isRequired,
  hasUnviewedPages: PropTypes.bool.isRequired,
  pageList: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  setFormErrors: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  formOptions: PropTypes.shape({
    useWebComponentForNavigation: PropTypes.bool,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  open: PropTypes.bool,
  reviewEditFocusOnHeaders: PropTypes.bool,
  reviewErrors: PropTypes.shape({}),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  uploadFile: PropTypes.func,
  onBlur: PropTypes.func,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ReviewCollapsibleChapter),
);

// for tests
export { ReviewCollapsibleChapter };
