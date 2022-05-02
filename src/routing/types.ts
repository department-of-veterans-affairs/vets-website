/**
 * The properties for the Router React component
 *
 * @beta
 */
export interface RouterProps {
  children: Routable | Array<Routable>;
  basename: string;
  formData: IFormData;
}

/**
 * Indicates if a component can be routed using `react-router-dom`. The `path`
 * prop must be present.
 *
 * @beta
 */
export interface Routable {
  path: string;
}

/**
 * The properties for the Page React component
 *
 * @beta
 */
export interface PageProps {
  children: JSX.Element[];
  title: string;
  path: string;
  nextPage: string;
}

/**
 * The type for the FormData to define the flexible data object
 *
 * @beta
 */
export interface IFormData {
  [prop: string]: unknown;
}

/**
 * The properties for the Chapter React component
 *
 * @beta
 */
export interface ChapterProps {
  children: Array<any>;
  title: string;
  path: string;
}
