import React from 'react';

export default class SpouseMarriageWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: !!props.value
      ? props.value.length - (this.props.options.countOffset || 0)
      : undefined };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      let count = parseInt(this.state.value, 10);
      if (isNaN(count)) {
        count = 0;
      }

      if (count > 29) {
        count = 29;
      }

      this.props.onChange(this.getValue(count, this.props.value));
    }
  }
  // We're expanding or contracting the array based on the count
  // and returning undefined if the array should be empty
  getValue = (count, value = []) => {
    if (count === 0) {
      return undefined;
    }

    const intCount = count + (this.props.options.countOffset || 0);

    if (intCount < value.length) {
      return value.slice(0, intCount);
    }

    return Array(intCount - value.length).fill({}).concat(value);
  }

  updateArrayLength = (event) => {
    this.setState({ value: event.target.value });
  }

  render() {
    const props = this.props;

    if (props.formContext.reviewMode) {
      return (
        <div className="review-row">
          <dt>{props.uiSchema['ui:title']}</dt><dd>{this.state.value}</dd>
        </div>
      );
    }

    return (
      <input type="number"
          step="1"
          min="1"
          id={props.id}
          name={props.id}
          disabled={props.disabled}
          autoComplete={props.options.autocomplete || false}
          className={props.options.widgetClassNames}
          value={typeof this.state.value === 'undefined' ? '' : this.state.value}
          onBlur={() => props.onBlur(props.id)}
          onChange={this.updateArrayLength}/>
    );
  }
}
