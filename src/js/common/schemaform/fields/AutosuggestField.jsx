import React from 'react';
import _ from 'lodash/fp';
import Autosuggest from 'react-autosuggest-ie11-compatible';

function getSuggestions(options, value) {
  if (value) {
    return options.filter(option =>
      option.label.toUpperCase().includes(value.toUpperCase()));
  }

  return [];
}

export default class AutosuggestWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      input: props.formData ? (props.formData.label || '') : '',
      suggestions: []
    };
  }

  componentDidMount() {
    if (!this.props.formContext.reviewMode) {
      const uiOptions = this.props.uiSchema['ui:options'];
      uiOptions.getOptions().then(options => {
        if (!this.unmounted) {
          this.setState({ options, suggestions: getSuggestions(options, this.state.input) });
        }
      });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  onChange = (event, { newValue }) => {
    this.setState({ input: newValue });
    if (!newValue) {
      this.props.onChange();
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      input: value,
      suggestions: getSuggestions(this.state.options, value)
    });
  }

  handleSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    if (suggestion) {
      this.props.onChange(_.set('widget', 'autosuggest', suggestion));
    } else {
      this.props.onChange();
    }
    this.setState({ input: suggestion.label });
  }

  handleBlur = (event, { focusedSuggestion }) => {
    if (focusedSuggestion) {
      this.props.onChange(_.set('widget', 'autosuggest', focusedSuggestion));
      this.setState({ input: focusedSuggestion.label });
    } else {
      const value = _.get('formData.label', this.props) || '';
      if (value !== this.state.input) {
        this.setState({ input: value });
      }
    }
    this.props.onBlur(this.props.id);
  }

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  }

  shouldRenderSuggestions(searchTerm) {
    const checkLength = searchTerm.trim().length > 2;
    return checkLength;
  }

  renderSuggestion(suggestion) {
    return <div>{suggestion.label}</div>;
  }

  render() {
    const { idSchema, formContext, formData } = this.props;
    const id = idSchema.$id;

    if (formContext.reviewMode) {
      return (
        <div className="review-row">
          <dt>{this.props.uiSchema['ui:title']}</dt>
          <dd><span>{formData.label}</span></dd>
        </div>
      );
    }

    return (
      <Autosuggest
        getSuggestionValue={suggestion => suggestion.label}
        highlightFirstSuggestion
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        renderSuggestion={this.renderSuggestion}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        suggestions={this.state.suggestions}
        inputProps={{
          id,
          name: id,
          value: this.state.input,
          onChange: this.onChange,
          'aria-labelledby': `${id}-label`,
          onBlur: this.handleBlur
        }}/>
    );
  }
}
