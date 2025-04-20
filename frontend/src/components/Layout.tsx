import {ReactNode} from "react";
import {Link, useLocation} from "react-router-dom";
import {AppBar, Box, Button, Container, CssBaseline, Toolbar, Typography} from "@mui/material";

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
		<Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
			<CssBaseline />
			<AppBar position="static">
				<Container maxWidth="lg">
					<Toolbar disableGutters>
						<Typography
							variant="h6"
							component={Link}
							to="/"
							sx={{
								flexGrow: 1,
								textDecoration: "none",
								color: "inherit",
								fontWeight: "bold",
							}}
						>
							Memarr
						</Typography>
						<Box sx={{display: "flex", gap: 2}}>
							{navLinks.map(link => (
								<Button
									key={link.path}
									component={Link}
									to={link.path}
									color="inherit"
									sx={{
										fontWeight: location.pathname === link.path ? "bold" : "normal",
									}}
								>
									{link.label}
								</Button>
							))}
						</Box>
						<Box sx={{display: "flex", gap: 2, ml: 2}}>
							{authLinks.map(link => (
								<Button
									key={link.path}
									component={Link}
									to={link.path}
									color="inherit"
									sx={{
										fontWeight: location.pathname === link.path ? "bold" : "normal",
									}}
								>
									{link.label}
								</Button>
							))}
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Container component="main" maxWidth="lg" sx={{flex: 1, py: 4}}>
				{children}
			</Container>
		</Box>
	);
};
