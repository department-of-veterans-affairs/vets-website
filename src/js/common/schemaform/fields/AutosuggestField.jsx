import React from 'react';
import _ from 'lodash/fp';
import Autosuggest from 'react-autosuggest-ie11-compatible';
// import fuzzysearch from 'fuzzysearch';
import fastLevenshtein from 'fast-levenshtein';

function getSuggestions(options, value) {
  if (value) {
    // return fuzzy.filter(value.toUpperCase(), options, {
    //   extract: (option) => option.label.toUpperCase()
    // })
    //   .map(match => match.original);
    // return options.filter(option => fuzzysearch(value.toUpperCase(), option.label.toUpperCase()));
    return options
      .map(option => {
        return {
          score: option.label.toUpperCase().includes(value.toUpperCase())
            ? 0
            : fastLevenshtein.get(value.toUpperCase(), option.label.toUpperCase()),
          original: option
        };
      })
      .sort((a, b) => {
        const result = a.score - b.score;

        if (result === 0) {
          return a.original.label.length - b.original.label.length;
        }

        return result;
      })
      .map(sorted => sorted.original)
      .slice(0, 20);
  }

  return options;
}

export default class AutosuggestField extends React.Component {
  constructor(props) {
    super(props);
    const input = props.formData ? (props.formData.label || '') : '';
    const uiOptions = this.props.uiSchema['ui:options'];

    let options = [];
    let suggestions = [];

    if (!uiOptions.getOptions) {
      const idSchema = props.schema.properties.id;
      options = idSchema.enum.map((id, index) => {
        return {
          id,
          label: uiOptions.labels[id] || idSchema.enumNames[index]
        };
      });
      suggestions = getSuggestions(options, input);
    }

    this.state = {
      options,
      input,
      suggestions
    };

  }

  componentDidMount() {
    if (!this.props.formContext.reviewMode) {
      const uiOptions = this.props.uiSchema['ui:options'];
      if (uiOptions.getOptions) {
        uiOptions.getOptions().then(options => {
          if (!this.unmounted) {
            this.setState({ options, suggestions: getSuggestions(options, this.state.input) });
          }
        });
      }
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
