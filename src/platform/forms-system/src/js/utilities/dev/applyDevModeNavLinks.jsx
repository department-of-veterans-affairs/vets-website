import React from 'react';
import { Link } from 'react-router';

/**
 * Prepends navigation links to the beginning of a given uiSchema and schema
 *
 * @param {Array<Object>} pageList - router pageList
 * @param {SchemaOptions} schema
 * @param {UISchemaOptions} uiSchema
 * @returns {{schema: SchemaOptions, uiSchema: UISchemaOptions}}
 */
export const applyDevModeNavLinks = (pageList, schema, uiSchema) => {
  const newUiSchema = {
    navLinks: {
      'ui:title': ' ',
      'ui:field': 'StringField',
      'ui:widget': () => (
        <span>
          {pageList.map(({ path }) => {
            return (
              <Link
                key={path}
                className="vads-u-padding-right--2"
                to={`${path}`}
              >
                {path}
              </Link>
            );
          })}
        </span>
      ),
    },
    ...uiSchema,
  };

  const newSchema = {
    ...schema,
    properties: {
      navLinks: {
        type: 'string',
      },
      ...schema.properties,
    },
  };

  return { schema: newSchema, uiSchema: newUiSchema };
};
