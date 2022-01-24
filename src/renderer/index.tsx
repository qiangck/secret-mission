import { render } from 'react-dom';
import {
  Routes,
  Route,
  HashRouter,
  useLocation,
  Navigate,
} from 'react-router-dom';
import 'antd/dist/antd.css';
import './index.css';
import App from './views/App';
import Login from './views/Login';
import OutApp from './views/OutApp';
import { router, routerMap } from './router';
import { getSession } from './utils';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const auth = getSession();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === '/login') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

render(
  <HashRouter>
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route
        path="/"
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        }
      >
        {router.map((node) => {
          const map = { ...routerMap };

          const NodeItem = map[node.path];

          if (node.index) {
            return <Route index element={<NodeItem />} key={node.key} />;
          }
          return (
            <Route path={node.path} element={<NodeItem />} key={node.key} />
          );
        })}
      </Route>
      <Route path="/outWindow" element={<OutApp />}></Route>
    </Routes>
  </HashRouter>,
  document.getElementById('root')
);
