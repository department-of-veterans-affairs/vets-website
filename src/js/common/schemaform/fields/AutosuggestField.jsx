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
    const uiOptions = this.props.uiSchema['ui:options'];
    uiOptions.getOptions().then(options => {
      this.setState({ options, suggestions: getSuggestions(options, this.state.input) });
    });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      input: value,
      suggestions: getSuggestions(this.state.options, value)
    });
  }

  onChange = (event, { newValue }) => {
    this.setState({ input: newValue });
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

  shouldRenderSuggestions(searchTerm) {
    const checkLength = searchTerm.trim().length > 2;
    return checkLength;
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

  renderSuggestion(suggestion) {
    return <div>{suggestion.label}</div>;
  }

  render() {
    const { idSchema, formContext, formData } = this.props;
    const id = idSchema.$id;

    if (formContext.reviewMode) {
      return <span>{formData.value}</span>;
    }

    return (
      <Autosuggest
        getSuggestionValue={suggestion => suggestion.label}
        highlightFirstSuggestion
        onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
        onSuggestionSelected={this.handleSuggestionSelected}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
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
