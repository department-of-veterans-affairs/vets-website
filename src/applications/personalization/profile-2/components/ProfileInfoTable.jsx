import React from 'react';
import PropTypes from 'prop-types';

const ProfileInfoTable = ({ data, dataTransformer, fieldName, title }) => (
  <table className="profile-info-table" data-field-name={fieldName}>
    <thead>
      <tr>
        <th>
          <h3>{title}</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      {data
        .map(element => (dataTransformer ? dataTransformer(element) : element))
        .map((row, index) => (
          <tr key={index}>
            <td>
              <h4 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold">
                {row.title}
              </h4>
            </td>
            <td>{row.value}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

ProfileInfoTable.propTypes = {
  title: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  dataTransformer: PropTypes.func,
};

export default ProfileInfoTable;
