import {ReactNode} from "react";
import {Link, useLocation} from "react-router-dom";

interface LayoutProps {
	children: ReactNode;
}

export const Layout = ({children}: LayoutProps) => {
	const location = useLocation();
	const isAuthenticated = !!localStorage.getItem("token");

	const navLinks = [
		{path: "/", label: "Home"},
		{path: "/library", label: "Library"},
		{path: "/activity", label: "Activity"},
	];

	const authLinks = isAuthenticated
		? [
				{path: "/profile", label: "Profile"},
				{path: "/settings", label: "Settings"},
		  ]
		: [
				{path: "/login", label: "Login"},
				{path: "/signup", label: "Sign Up"},
		  ];

	return (
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<Link to="/" className="text-xl font-bold text-gray-800">
									Memarr
								</Link>
							</div>
							<div className={`sm:ml-6 sm:flex sm:space-x-8 ${isAuthenticated ? "" : "hidden"}`}>
								{navLinks.map(link => (
									<Link
										key={link.path}
										to={link.path}
										className={`${
											location.pathname === link.path
												? "border-indigo-500 text-gray-900"
												: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
										} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
									>
										{link.label}
									</Link>
								))}
							</div>
						</div>
						<div className="sm:ml-6 sm:flex sm:items-center sm:space-x-8">
							{authLinks.map(link => (
								<Link
									key={link.path}
									to={link.path}
									className={`${
										location.pathname === link.path
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</nav>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
		</div>
	);
};
