import React from 'react';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import { makeField } from '../../../common/model/fields.js';

class MessageCategory extends React.Component {
  render() {
    const categories = this.props.categories;
    const categoryValue = makeField(undefined);

    return (
      <div className={this.props.cssClass}>
        <ErrorableSelect
            additionalClass={`${this.props.cssClass}-category`}
            label="Category"
            name="messageCategory"
            onValueChange={this.props.onValueChange}
            options={categories}
            value={categoryValue}/>
      </div>
    );
  }
}

MessageCategory.propTypes = {
  cssClass: React.PropTypes.string,
  errorMessage: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  categories: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.number }),
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.string }),
    ])).isRequired
};

export default MessageCategory;
