import {ApolloProvider} from "@apollo/client";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {client} from "./lib/apollo";
import {Layout} from "./components/Layout";
import {ToastProvider} from "./contexts/ToastContext";
import {Home} from "./pages/Home";
import {Library} from "./pages/Library";
import {Activity} from "./pages/Activity";
import {Login} from "./pages/Login";
import {Signup} from "./pages/Signup";
import {Profile} from "./pages/Profile";
import {Settings} from "./pages/Settings";
import {Create} from "./pages/Create";
import {Edit} from "./pages/Edit";
import "./App.css";

export const App = () => {
	return (
		<ApolloProvider client={client}>
			<ToastProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/library" element={<Library />} />
							<Route path="/activity" element={<Activity />} />
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/create" element={<Create />} />
							<Route path="/edit/:id" element={<Edit />} />
						</Routes>
					</Layout>
				</Router>
			</ToastProvider>
		</ApolloProvider>
	);
};

export default App;
