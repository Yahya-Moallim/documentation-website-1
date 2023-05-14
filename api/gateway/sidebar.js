module.exports = [
	{ type: "doc", id: "gateway/public-rest-api" },
	{
		type: "category",
		label: "Purchase",
		items: [
			{
				type: "doc",
				id: "gateway/authentication-request",
				label: "Authentication request to create a payment session",
				className: "api-method post",
			},
		],
	},
	{
		type: "category",
		label: "default",
		items: [
			{
				type: "doc",
				id: "gateway/recurring-request",
				label: "RECURRING request",
				className: "api-method post",
			},
			{
				type: "doc",
				id: "gateway/get-trans-status-request",
				label: "GET_TRANS_STATUS request",
				className: "api-method post",
			},
			{
				type: "doc",
				id: "gateway/refund-request",
				label: "Refund request",
				className: "api-method post",
			},
		],
	},
];
