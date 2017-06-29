import React from 'react';

// We're expanding or contracting the array based on the count
// and returning undefined if the array should be empty
function getValue(count, value = []) {
  if (!count || parseInt(count, 10) < 1) {
    return undefined;
  }

  const intCount = parseInt(count, 10);
  if (intCount < value.length) {
    return value.slice(0, intCount);
  }

  return value.concat(Array(intCount - value.length).fill({}));
}

export default class ArrayCountWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: !!props.value ? props.value.length : undefined };
  }

  // Need to keep the count state in sync, but don't want to overwrite if the
  // user has chosen '' or 0
  componentWillReceiveProps(props) {
    const arrayData = props.value || [];
    if (!!arrayData.length && (!this.state.value || this.state.value !== arrayData.length)) {
      this.setState({ value: arrayData.length });
    }
  }

  updateArrayLength = (event) => {
    let count = event.target.value;
    // You can lock up the browser by setting too high of a number here
    // and 29 appears to be the record, so this seems safe
    if (count > 29) {
      count = 29;
    }
    this.setState({ value: count }, () => {
      this.props.onChange(getValue(count, this.props.value));
    });
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
