import React from 'react';
import MessageSearchAdvanced from './MessageSearchAdvanced';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';

class MessageSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
    this.formatParams = this.formatParams.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  formatParams() {
    const params = this.props.params;

    return {
      dateRange: {
        start: params.dateRange.start,
        end: params.dateRange.end
      },
      term: params.term,
      from: {
        field: params.from.field,
        exact: params.from.exact
      },
      subject: {
        field: params.subject.field,
        exact: params.subject.exact
      }
    };
  }

  handleSearchTermChange(field) {
    this.props.onFieldChange('term', field);
  }

  handleSubmit(domEvent) {
    domEvent.preventDefault();
    this.props.onSubmit(this.formatParams(), this.props.folder);
  }

  render() {
    let basicSearch;
    if (!this.props.isAdvancedVisible) {
      basicSearch = (
        <div className="va-flex va-flex--stretch msg-search-simple-wrap">
          <ErrorableTextInput
              field={this.props.params.term}
              name="msg-search-simple"
              label="Search messages"
              onValueChange={this.handleSearchTermChange}/>
          <button
              type="submit"
              className="msg-search-btn">
            <i className="fa fa-search"></i>
            <span className="msg-search-btn-text">Search</span>
          </button>
        </div>
      );
    }

    return (
      <form
          className={this.props.cssClass}
          id="msg-search"
          onSubmit={this.handleSubmit}>
        {basicSearch}
        <MessageSearchAdvanced
            params={this.props.params}
            isVisible={this.props.isAdvancedVisible}
            onAdvancedSearch={this.props.onAdvancedSearch}
            onFieldChange={this.props.onFieldChange}
            onDateChange={this.props.onDateChange}/>
      </form>);
  }
}

MessageSearch.propTypes = {
  cssClass: React.PropTypes.string,
  folder: React.PropTypes.number,
  isAdvancedVisible: React.PropTypes.bool.isRequired,
  onAdvancedSearch: React.PropTypes.func.isRequired,
  onFieldChange: React.PropTypes.func.isRequired,
  onDateChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func,
  params: React.PropTypes.shape({
    dateRange: React.PropTypes.shape({
      start: React.PropTypes.object,
      end: React.PropTypes.object
    }),
    term: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    }),
    from: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    }),
    subject: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    })
  }).isRequired
};

export default MessageSearch;
