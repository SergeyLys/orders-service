import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spinner } from "./ui";

const LazyOrders = lazy(() => import("./pages/Orders"));
const LazyOrderEditor = lazy(() => import("./pages/OderEditor"));
const LazyStats = lazy(() => import("./pages/Stats"));

function App() {
	return (
		<Routes>
			<Route
				index
				element={
					<Suspense fallback={<Spinner />}>
						<LazyOrders />
					</Suspense>
				}
			/>
			<Route
				path="edit/:orderId?"
				element={
					<Suspense fallback={<Spinner />}>
						<LazyOrderEditor />
					</Suspense>
				}
			/>
			<Route
				path="stats"
				element={
					<Suspense fallback={<Spinner />}>
						<LazyStats />
					</Suspense>
				}
			/>
		</Routes>
	);
}

export default App;
