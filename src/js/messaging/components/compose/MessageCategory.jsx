import React from 'react';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import { makeField } from '../../../common/model/fields.js';

class MessageCategory extends React.Component {
  render() {
    const categories = this.props.categories;
    const categoryValue = makeField(this.props.value);

    return (
      <div className="messaging-category">
        <ErrorableSelect
            additionalClass="messaging-category-select"
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
  errorMessage: React.PropTypes.string,
  menuClass: React.PropTypes.string,
  name: React.PropTypes.string,
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
