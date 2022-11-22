import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Profile.css";

import LoadingPage from "../common/LoadingPage";
import FitnessJourney from "../../api";
import UserContext from "../auth/UserContext";

/** Current User Component
 *
 * Fetches user data from database.
 *
 */

const CurrentUserProfile = () => {
	const history = useHistory();
	const { currentUser } = useContext(UserContext);
	const [user, setUser] = useState(null);

	/** Request post from API via postId */

	useEffect(
		function getUserOnMount() {
			async function getUser() {
				let user = await FitnessJourney.getCurrentUser(currentUser.username);
				// set user state to the handle
				setUser(user);
			}

			getUser();
		},
		// rerun when username changes
		[currentUser.username]
	);

	const deleteProfile = async () => {
		await FitnessJourney.deleteProfile(currentUser.username);

		history.push("/login");
		window.location.reload(true);
	};

	if (!user) return <LoadingPage />;

	console.log(currentUser);

	return (
		<div className="UserDashboard py-4">
			<div className="container pb-5 mb-5">
				<div className="col-md-10 offset-md-1">
					<section id="breadcrumb" className="">
						<nav aria-label="breadcrumb">
							<div className="d-flex justify-content-between align-items-center">
								<h2>Dashboard</h2>
								<ol className="breadcrumb">
									<li className="breadcrumb-item past">
										<Link to="/" style={{ textDecoration: "none" }}>
											Home
										</Link>
									</li>
									<li className="breadcrumb-item active" aria-current="page">
										{currentUser.username}
									</li>
								</ol>
							</div>
						</nav>
					</section>
				</div>

				<div className="col-md-8 offset-md-2">
					<div className="row">
						<div className="col-sm-12 col-md-12 col-lg-12 mx-auto">
							<div className="panel">
								<div className="row">
									<div className="col-sm-12 col-md-12 col-lg-6">
										<img
											alt="User's Avatar"
											src={currentUser.imageUrl}
											className="img-thumbnail rounded mx-auto d-block"
										/>
										<div className="d-flex justify-content-center">
											<Link to="/athlete/edit">
												<button className="btn btn-outline-secondary m-2">
													Edit Profile
												</button>
											</Link>

											<button
												className="btn btn-danger m-2"
												onClick={deleteProfile}
											>
												Delete Profile
											</button>
										</div>
									</div>
									<div className="col-sm-12 col-md-12 col-lg-6">
										<h4>@{currentUser.username}</h4>

										<div className="dashboard-content">
											<p>{currentUser.bio}</p>
											<p>
												<span className="fa fa-map-marker"></span>{" "}
												{currentUser.city},{currentUser.state}
											</p>
											<p>{currentUser.fitnessType}</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="col-sm-12 col-md-12 col-lg-6 mx-auto">
							<div className="panel">
								<div className="dashboard-panel">
									<h4 className="dashboard-title">Routines</h4>
									<div className="dashboard-content">
										{currentUser.routines.length ? (
											<ul className="list-group list-group-flush">
												{currentUser.routines.map((routine) => (
													<Link
														to={`/routines/${routine.id}`}
														style={{ color: "inherit", textDecoration: "none" }}
													>
														<li className="list-group-item list-group-item-action">
															{routine.name}
														</li>
													</Link>
												))}
											</ul>
										) : (
											<p className="lead text-center">No routines found.</p>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-12 col-lg-6 mx-auto">
							<div className="panel">
								<div className="dashboard-panel">
									<h4 className="dashboard-title">Workouts Logged</h4>
									<div className="dashboard-content">
										{currentUser.logs.length ? (
											<ul className="list-group list-group-flush">
												{currentUser.logs.map((log) => (
													<Link
														to={`/logs/${log.id}`}
														style={{ color: "inherit", textDecoration: "none" }}
													>
														<li
															className="list-group-item list-group-item-action"
															key={log.id}
														>
															{log.date}
														</li>
													</Link>
												))}
											</ul>
										) : (
											<p className="lead text-center">No logs found.</p>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CurrentUserProfile;
