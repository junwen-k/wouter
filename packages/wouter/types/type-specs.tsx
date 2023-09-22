import * as React from "react";
import {
  Link,
  Params,
  Redirect,
  Route,
  RouteComponentProps,
  Router,
  Switch,
  useLocation,
  useRouter,
} from "wouter";

import { useLocation as useBrowserLocation } from "wouter/use-location";

const Header: React.FunctionComponent = () => <div />;
const Profile = ({ params }: RouteComponentProps<{ id: string }>) => (
  <div>User id: {params.id}</div>
);

// example custom hook
type UseNetworkLocation = (options?: {
  protocol: string;
  address: string;
}) => [string, (to: string, options?: { delay: number }) => void];

/*
 * Params type specs
 */
const someParams: Params = { foo: "bar" };
const someParamsWithGeneric: Params<{ foo: string }> = { foo: "bar" };

// error: params should follow generic type
const paramsDontMatchGeneric: Params<{ foo: string }> = { baz: "bar" }; // $ExpectError

// error: values are strings!
const invalidParams: Params = { id: 13 }; // $ExpectError
const invalidParamsWithGeneric: Params<{ id: number }> = { id: 13 }; // $ExpectError

/*
 * Link and Redirect component type specs
 */

// `to` and `href` are aliases, but they are mutually exclusive and
// can't be used at the same time:
<Link to="/users">Users</Link>;
<Link href="/about">About</Link>;
<Link href="/about" to="/app" children="" />; // $ExpectError
<Link children="" />; // $ExpectError

<Link href="/about" replace>
  About
</Link>;

<Link href="/about">
  This is <i>awesome!</i>
</Link>;

<Link href="/">
  <a className="active">Active Link</a>
</Link>;

<Link href="/foo">
  <Header />
</Link>;

// supports standard link attributes
<Link
  href="/somewhere"
  onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {}}
  children={null}
/>;
<Link download href="/" target="_blank" rel="noreferrer" children={null} />;

<Link
  href="/somewhere"
  children={null}
  onDrag={(event) => {
    event; // $ExpectType DragEvent<HTMLAnchorElement>
  }}
/>;

/*
 * Redirect specs
 */

<Redirect to="/" />;
<Redirect href="/" />;
<Redirect href="/" replace />;
<Redirect href="/" unknownProp={1000} />; // $ExpectError

Redirect<UseNetworkLocation>({ href: "/home", delay: 1000 });
// example custom hook
type UseLocWithNoOptions = () => [
  string,
  (to: string, foo: number, bar: string) => void
];
Redirect<UseLocWithNoOptions>({ href: "/app" });

<Redirect>something</Redirect>; // $ExpectError

/*
 * Switch specs
 */

<Switch>
  <Route path="/app/users" />
  <Route path="/app/:id" />
</Switch>;

<Switch>
  <Route path="/app/users" />
  <Route />
</Switch>;

<Switch>
  This won't be rendered, but it's allowed
  <Route path="/app/users" />
  <>
    <div />
    I'm a fragment
  </>
  {false && <a>Conditionals</a>}
  {null}
  {undefined}
  <Route />
</Switch>;

<Switch />; // $ExpectError

/*
 * Router specs
 */

<Router hook="wat?" />; // $ExpectError

const useNetwork: UseNetworkLocation = (() => {}) as UseNetworkLocation;

<Router hook={useNetwork}>this is a valid router</Router>;

<Router>
  <Route path="/" />
  <b>Hello!</b>
</Router>;

<Router>
  Hello, we have <Header /> and some {1337} numbers here.
</Router>;

<Router base="/app">Hello World!</Router>;

const parentRouter = {
  base: "/app",
  ownBase: "/app",
  ssrPath: "/",
  matcher: (() => null) as unknown as MatcherFn,
  hook: useLocation,
};

<Router parent={parentRouter}>Parent router is inherited</Router>;

<Router ssrPath="/foo">SSR</Router>;

/*
 * Hooks API
 */
const [location, setLocation] = useLocation();
location; // $ExpectType string

// embedded useLocation hook doesn't accept any arguments
const [] = useLocation({}); // $ExpectError

setLocation(); // $ExpectError
setLocation("/app");
setLocation("/app", { replace: true });
setLocation("/app", { unknownOption: true }); // $ExpectError

// custom hook
const [networkLoc, setNetworkLoc] = useLocation<UseNetworkLocation>();
setNetworkLoc("/home", { delay: 2000 });

const router = useRouter(); // $ExpectType RouterObject
router.parent; // $ExpectType RouterObject | undefined

/*
 * Standalone useLocation hook
 */

const [loc, navigate] = useBrowserLocation();
loc; // $ExpectType string

useBrowserLocation({ base: "/something" });
useBrowserLocation({ foo: "bar" }); // $ExpectError
