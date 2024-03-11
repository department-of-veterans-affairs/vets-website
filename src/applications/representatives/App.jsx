import * as React from 'react';
import {
  Await,
  createBrowserRouter,
  defer,
  Form,
  Link,
  Outlet,
  RouterProvider,
  useAsyncError,
  useAsyncValue,
  useFetcher,
  useFetchers,
  useLoaderData,
  useNavigation,
  useParams,
  useRevalidator,
  useRouteError,
} from 'react-router-dom-v5-compat';

import manifest from './manifest.json';

const TODOS_KEY = 'todos';

const uuid = () =>
  Math.random()
    .toString(36)
    .substr(2, 9);

function saveTodos(todos) {
  return localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function initializeTodos() {
  const todos = new Array(10)
    .fill(null)
    .reduce(
      (acc, _, index) =>
        Object.assign(acc, { [uuid()]: `Seeded Todo #${index + 1}` }),
      {},
    );
  saveTodos(todos);
  return todos;
}

function getTodos() {
  let todos = null;
  try {
    todos = JSON.parse(localStorage.getItem(TODOS_KEY));
  } catch (e) {
    // Empty block statement
  }
  if (!todos) {
    todos = initializeTodos();
  }
  return todos;
}

function addTodo(todo) {
  const newTodos = { ...getTodos() };
  newTodos[uuid()] = todo;
  saveTodos(newTodos);
}

function deleteTodo(id) {
  const newTodos = { ...getTodos() };
  delete newTodos[id];
  saveTodos(newTodos);
}

// function resetTodos() {
//   localStorage.removeItem(TODOS_KEY);
//   initializeTodos();
// }

function sleep(n) {
  return new Promise(r => setTimeout(r, n));
}

function Fallback() {
  return <p>Performing initial data load</p>;
}

// Layout
function Layout() {
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const fetchers = useFetchers();
  const fetcherInProgress = fetchers.some(f =>
    ['loading', 'submitting'].includes(f.state),
  );

  return (
    <>
      <h1>Data Router Example</h1>

      <p>
        This example demonstrates some of the core features of React Router
        including nested &lt;Route&gt;s, &lt;Outlet&gt;s, &lt;Link&gt;s, and
        using a "*" route (aka "splat route") to render a "not found" page when
        someone visits an unrecognized URL.
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
          <li>
            <Link to="/deferred">Deferred</Link>
          </li>
          <li>
            <Link to="/404">404 Link</Link>
          </li>
          <li>
            <button onClick={() => revalidator.revalidate()}>
              Revalidate Data
            </button>
          </li>
        </ul>
      </nav>
      <div style={{ position: 'fixed', top: 0, right: 0 }}>
        {navigation.state !== 'idle' && <p>Navigation in progress...</p>}
        {revalidator.state !== 'idle' && <p>Revalidation in progress...</p>}
        {fetcherInProgress && <p>Fetcher in progress...</p>}
      </div>
      <p>
        Click on over to <Link to="/todos">/todos</Link> and check out these
        data loading APIs!
      </p>
      <p>
        Or, checkout <Link to="/deferred">/deferred</Link> to see how to
        separate critical and lazily loaded data in your loaders.
      </p>
      <p>
        We've introduced some fake async-aspects of routing here, so Keep an eye
        on the top-right hand corner to see when we're actively navigating.
      </p>
      <hr />
      <Outlet />
    </>
  );
}

// Home
async function homeLoader() {
  await sleep();
  return {
    date: new Date().toISOString(),
  };
}

function Home() {
  const data = useLoaderData();
  return (
    <>
      <h2>Home</h2>
      <p>Date from loader: {data.date}</p>
    </>
  );
}

// Todos
async function todosAction({ request }) {
  await sleep();

  const formData = await request.formData();

  // Deletion via fetcher
  if (formData.get('action') === 'delete') {
    const id = formData.get('todoId');
    if (typeof id === 'string') {
      deleteTodo(id);
      return { ok: true };
    }
  }

  // Addition via <Form>
  const todo = formData.get('todo');
  if (typeof todo === 'string') {
    addTodo(todo);
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/todos' },
  });
}

async function todosLoader() {
  await sleep();
  return getTodos();
}

function TodosList() {
  const todos = useLoaderData();
  const navigation = useNavigation();
  const formRef = React.useRef(null);

  // If we add and then we delete - this will keep isAdding=true until the
  // fetcher completes it's revalidation
  const [isAdding, setIsAdding] = React.useState(false);
  React.useEffect(
    () => {
      if (navigation.formData?.get('action') === 'add') {
        setIsAdding(true);
      } else if (navigation.state === 'idle') {
        setIsAdding(false);
        formRef.current?.reset();
      }
    },
    [navigation],
  );

  return (
    <>
      <h2>Todos</h2>
      <p>
        This todo app uses a &lt;Form&gt; to submit new todos and a
        &lt;fetcher.form&gt; to delete todos. Click on a todo item to navigate
        to the /todos/:id route.
      </p>
      <ul>
        <li>
          <Link to="/todos/junk">
            Click this link to force an error in the loader
          </Link>
        </li>
        {Object.entries(todos).map(([id, todo]) => (
          <li key={id}>
            <TodoItem id={id} todo={todo} />
          </li>
        ))}
      </ul>
      <Form method="post" ref={formRef}>
        <input type="hidden" name="action" value="add" />
        <input name="todo" />
        <button type="submit" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </Form>
      <Outlet />
    </>
  );
}

function TodosBoundary() {
  const error = useRouteError();
  return (
    <>
      <h2>Error 💥</h2>
      <p>{error.message}</p>
    </>
  );
}

function TodoItem({ id, todo }) {
  const fetcher = useFetcher();

  const isDeleting = fetcher.formData != null;
  return (
    <>
      <Link to={`/todos/${id}`}>{todo}</Link>
      &nbsp;
      <fetcher.Form method="post" style={{ display: 'inline' }}>
        <input type="hidden" name="action" value="delete" />
        <button type="submit" name="todoId" value={id} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </fetcher.Form>
    </>
  );
}

// Todo
async function todoLoader({ params }) {
  await sleep();
  const todos = getTodos();
  if (!params.id) {
    throw new Error('Expected params.id');
  }
  const todo = todos[params.id];
  if (!todo) {
    throw new Error(`Uh oh, I couldn't find a todo with id "${params.id}"`);
  }
  return todo;
}

function Todo() {
  const params = useParams();
  const todo = useLoaderData();
  return (
    <>
      <h2>Nested Todo Route:</h2>
      <p>id: {params.id}</p>
      <p>todo: {todo}</p>
    </>
  );
}

const rand = () => Math.round(Math.random() * 100);
const resolve = (d, ms) =>
  new Promise(r => setTimeout(() => r(`${d} - ${rand()}`), ms));
const reject = (d, ms) => {
  let _d = d;
  return new Promise((_, r) =>
    setTimeout(() => {
      if (_d instanceof Error) {
        _d.message += ` - ${rand()}`;
      } else {
        _d += ` - ${rand()}`;
      }
      r(_d);
    }, ms),
  );
};

async function deferredLoader() {
  return defer({
    critical1: await resolve('Critical 1', 250),
    critical2: await resolve('Critical 2', 500),
    lazyResolved: Promise.resolve(`Lazy Data immediately resolved - ${rand()}`),
    lazy1: resolve('Lazy 1', 1000),
    lazy2: resolve('Lazy 2', 1500),
    lazy3: resolve('Lazy 3', 2000),
    lazyError: reject(new Error('Kaboom!'), 2500),
  });
}

function DeferredPage() {
  const data = useLoaderData();
  return (
    <div>
      {/* Critical data renders immediately */}
      <p>{data.critical1}</p>
      <p>{data.critical2}</p>

      {/* Pre-resolved deferred data never triggers the fallback */}
      <React.Suspense fallback={<p>should not see me!</p>}>
        <Await resolve={data.lazyResolved}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      {/* Deferred data can be rendered using a component + the useAsyncValue() hook */}
      <React.Suspense fallback={<p>loading 1...</p>}>
        <Await resolve={data.lazy1}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      <React.Suspense fallback={<p>loading 2...</p>}>
        <Await resolve={data.lazy2}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>

      {/* Or you can bypass the hook and use a render function */}
      <React.Suspense fallback={<p>loading 3...</p>}>
        <Await resolve={data.lazy3}>{_data => <p>{_data}</p>}</Await>
      </React.Suspense>

      {/* Deferred rejections render using the useAsyncError hook */}
      <React.Suspense fallback={<p>loading (error)...</p>}>
        <Await resolve={data.lazyError} errorElement={<RenderAwaitedError />}>
          <RenderAwaitedData />
        </Await>
      </React.Suspense>
    </div>
  );
}

function RenderAwaitedData() {
  const data = useAsyncValue();
  return <p>{data}</p>;
}

function RenderAwaitedError() {
  const error = useAsyncError();
  return (
    <p style={{ color: 'red' }}>
      Error (errorElement)!
      <br />
      {error.message} {error.stack}
    </p>
  );
}

const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: Home,
      },
      {
        path: 'todos',
        action: todosAction,
        loader: todosLoader,
        Component: TodosList,
        ErrorBoundary: TodosBoundary,
        children: [
          {
            path: ':id',
            loader: todoLoader,
            Component: Todo,
          },
        ],
      },
      {
        path: 'deferred',
        loader: deferredLoader,
        Component: DeferredPage,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: manifest.rootUrl,
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<Fallback />}
      // eslint-disable-next-line camelcase
      future={{ v7_startTransition: true }}
    />
  );
}
