/* eslint-disable  @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
/**
 * Combines multiple, sequential path segments into one normalized path
 * with a single "/" character between the segments.
 * @param args Path arguments
 * @returns {String} Returns the combined, normalized path
 */
export const buildPath = (...args: string[]): string => {
  return args
    .map((part, i) => {
      if (i === 0) {
        return part.trim().replace(/[/]*$/g, '');
      } else {
        return part.trim().replace(/(^[/]*|[/]*$)/g, '');
      }
    })
    .filter((x) => x.length)
    .join('/');
};

/**
 * Returns the same normalized path as the buildPath function, but
 * the path will always start with a leading "/" character.
 * @param args Path arguments
 * @returns {String} Returns the combined, normalized path with a leading "/"
 */
export const buildRelativePath = (...args: string[]): string => {
  const path = buildPath(...args);

  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * The class used to parse and map a VA JSON schema into an object that can be used by Formik
 */
class JSONSchemaMapper {
  private _jsonProperties: any;
  private _definitions: any;

  constructor(schema: any) {
    this._jsonProperties = schema.properties;
    this._definitions = schema.definitions;
  }

  public get jsonProperties(): any {
    return this._jsonProperties;
  }

  /**
   * Recursively iterate through an object's properties and reduce them into a flatter object
   *
   * @param objectToReduce
   */
  public flattenProperties = (objectToReduce: any) => {
    return Object.entries(objectToReduce).reduce(
      (accumulator, [currentKey, currentValue]) => {
        return this.appendProperty(accumulator, currentKey, currentValue);
      },
      {}
    );
  };

  /**
   * Finds a definition based on the refString passed in, then flattens the definition object
   *
   * @param refString - a string in the form #/definitions/<reference>, where
   * <reference> is a reference to some preset definition
   */
  getReferencedType = (refString: string): any => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const referencedDefinition: string = /\/([A-Za-z]+)$/.exec(refString)![1];
    if (referencedDefinition === 'centralMailAddress') {
      return {
        isMilitaryBaseOutside: null,
        streetAddress: '',
        streetAddressLine2: '',
        streetAddressLine3: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      };
    }
    const definition: any = this._definitions[referencedDefinition];
    switch (definition.type) {
      case 'array':
        return [this.flattenProperties(definition.items.properties)];
      case 'object':
        return this.flattenProperties(definition.properties);
      case 'number':
        return 0;
      case 'boolean':
        return null;
      default:
        return '';
    }
  };

  /**
   * For the passed key/value pair, flatten the value as much as possible, then append
   * the key and updated value to the objectToAppendTo parameter
   *
   * @param objectToAppendTo
   * @param key
   * @param initialValue
   */
  appendProperty = (
    objectToAppendTo: any,
    key: string,
    initialValue: any
  ): any => {
    let updatedValue: any;
    if (initialValue.$ref) {
      updatedValue = this.getReferencedType(initialValue.$ref);
    } else {
      switch (initialValue.type) {
        case 'array':
          if (initialValue.items.$ref) {
            updatedValue = [this.getReferencedType(initialValue.items.$ref)];
          } else {
            updatedValue = [
              this.flattenProperties(initialValue.items.properties),
            ];
          }
          break;
        case 'object':
          updatedValue = this.flattenProperties(initialValue.properties);
          break;
        case 'number':
          updatedValue = 0;
          break;
        case 'boolean':
          updatedValue = null;
          break;
        default:
          updatedValue = '';
          break;
      }
    }

    objectToAppendTo[key] = updatedValue;
    return objectToAppendTo;
  };
}

/**
 * A function to transform a VA schema into a flattened, Formik compatible object
 *
 * @param schema
 */
export const transformJSONSchema = (schema: any) => {
  const schemaMapper = new JSONSchemaMapper(schema);
  return schemaMapper.flattenProperties(schemaMapper.jsonProperties);
};

export const CapitalizeFirstLetter = (value: string): string => {
  return value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
};
