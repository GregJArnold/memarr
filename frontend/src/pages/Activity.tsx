import {gql, useQuery} from "@apollo/client";

const GET_ACTIVITY_QUERY = gql`
	query GetActivity {
		events {
			id
			type
			timestamp
			description
			meme {
				id
				templateName
				thumbnailUrl
			}
		}
	}
`;

export const Activity = () => {
	const {loading, error, data} = useQuery(GET_ACTIVITY_QUERY);

	if (loading) {
		return (
			<div className="container mx-auto px-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">Activity</h1>
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="animate-pulse">
						<div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-2/3"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">Activity</h1>
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					Error loading activity: {error.message}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-3xl font-bold text-gray-900 mb-6">Activity</h1>
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Event
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Meme
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Time
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{data?.events.map((event: any) => (
								<tr key={event.id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{event.description}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{event.meme?.templateName || "N/A"}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{new Date(event.timestamp).toLocaleString()}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<button className="text-indigo-600 hover:text-indigo-900">View</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
