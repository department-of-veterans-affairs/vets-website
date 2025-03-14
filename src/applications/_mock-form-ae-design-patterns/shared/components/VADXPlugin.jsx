import React from 'react';
import { Link } from 'react-router';

export const VADXPlugin = () => {
  return (
    <div>
      <p>VADX Plugin Example</p>
      <div>
        <Link to="/1">Pattern 1</Link>
        <ul>
          <li>
            <Link to="/1/task-green">Task Green</Link>
          </li>
          <li>
            <Link to="/1/task-yellow/introduction?loggedIn=true">
              Task Yellow
            </Link>
          </li>
          <li>
            <Link to="/1/task-purple/introduction?loggedIn=true">
              Task Purple
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link to="/2">Pattern 2</Link>
        <ul>
          <li>
            <Link to="/2/task-orange">Task Orange</Link>
          </li>
          <li>
            <Link to="/2/task-gray/introduction?loggedIn=true">Task Gray</Link>
          </li>
          <li>
            <Link to="/2/task-blue">Task Blue</Link>
          </li>
          <li>
            <Link to="/2/post-study">Post Study</Link>
          </li>
        </ul>
      </div>
      <div>
        <Link to="/3">Pattern 3</Link>
        <ul>
          <li>
            <Link to="/3/service-list-demo">Service List Demo</Link>
          </li>
          <li>
            <Link to="/3/critical-information-demo">
              Critical Information Demo
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const plugin = {
  id: 'AEDP',
  component: VADXPlugin,
};
