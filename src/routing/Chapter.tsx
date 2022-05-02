import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { ChapterProps } from './types';

/**
 * Renders the chapter contents
 *
 * @beta
 */
export default function Chapter(props: ChapterProps): JSX.Element {
  const listOfPages = props.children.filter((child) =>
    String(child.type).includes('Page')
  );

  return (
    <div>
      {listOfPages.map((page) => (
        <Link to={`${props.path}/${page.props.path}`} key={page.props.path}>
          <button type="button">{page.props.title}</button>
        </Link>
      ))}
      <Routes>
        <Route path={`${props.path}/*`} element={props.children} />
      </Routes>
    </div>
  );
}
