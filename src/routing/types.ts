import { ReactElement } from 'react';
import { RouteProps } from 'react-router-dom';

/**
 * The properties for the Router React component
 *
 * @beta
 */
export interface RouterProps {
  children: ReactElement<any, any> | ReactElement<any, any>[];
  basename: string;
  title: string;
  subtitle?: string;
  formData: IFormData;
}

export interface RouterContextProps {
  routes: React.ReactElement | React.ReactElement[];
  children: ReactElement<any, any> | ReactElement<any, any>[];
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
 * Properties for Router Context
 *
 * @beta
 */
export interface IRouterContext {
  listOfRoutes?: string[];
}

/**
 * The properties for the Page React component
 *
 * @beta
 */
export interface PageProps {
  children: JSX.Element | JSX.Element[] | Element;
  title: string;
  path?: string;
  nextPage?: string;
  prevPage?: string;
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
  children: Array<any> | any;
  title?: string;
}
