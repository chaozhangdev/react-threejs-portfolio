import { lazy, Suspense, useEffect, createContext, useReducer, Fragment } from 'react';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import Navbar from 'components/Navbar';
import ThemeProvider from 'components/ThemeProvider';
import { tokens } from 'components/ThemeProvider/theme';
import VisuallyHidden from 'components/VisuallyHidden';
import { useLocalStorage } from 'hooks';
import { msToNum } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import { initialState, reducer } from 'app/reducer';
import './reset.css';
import './index.css';

const Home = lazy(() => import('pages/Home'));
const Contact = lazy(() => import('pages/Contact'));
// const Articles = lazy(() => import('pages/Articles'));
const Page404 = lazy(() => import('pages/404'));
// const ProjectSPR = lazy(() => import('pages/SmartSparrow'));
// const ProjectSlice = lazy(() => import('pages/Slice'));
// const ProjectVolkihar = lazy(() => import('pages/VolkiharKnight'));
const Uses = lazy(() => import('pages/Uses'));

export const AppContext = createContext();
export const TransitionContext = createContext();

const repoPrompt = ``;

const App = () => {
  const [storedTheme] = useLocalStorage('theme', 'dark');
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!prerender) {
      console.info(`${repoPrompt}\n\n`);
    }
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    dispatch({ type: 'setTheme', value: storedTheme });
  }, [storedTheme]);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      <ThemeProvider themeId={state.theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Fragment>
      <Helmet>
        <link rel="canonical" href={``} />
      </Helmet>
      <VisuallyHidden showOnFocus as="a" className="skip-to-main" href="#MainContent">
        Skip to main content
      </VisuallyHidden>
      <Navbar location={location} />
      <TransitionGroup component="main" className="app" tabIndex={-1} id="MainContent">
        <Transition
          key={pathname}
          timeout={msToNum(tokens.base.durationS)}
          onEnter={reflow}
        >
          {status => (
            <TransitionContext.Provider value={{ status }}>
              <div className={classNames('app__page', `app__page--${status}`)}>
                <Suspense fallback={<Fragment />}>
                  <Switch location={location}>
                    <Route exact path="/" component={Home} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/research" component={Uses} />
                    {/* <Route path="/research" component={Articles} /> */}
                    {/* <Route path="/uses" component={Uses} /> */}
                    <Route component={Page404} />

                    {/* <Route path="/projects/smart-sparrow" component={ProjectSPR} />
                    <Route path="/projects/slice" component={ProjectSlice} />
                    <Route path="/projects/volkihar-knight" component={ProjectVolkihar} /> */}
                  </Switch>
                </Suspense>
              </div>
            </TransitionContext.Provider>
          )}
        </Transition>
      </TransitionGroup>
    </Fragment>
  );
};

export default App;
