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
				className: "gateway-method post",
			},
			{
				type: "doc",
				id: "gateway/charge-token",
				label: "Charge a transaction using a saved token",
				className: "gateway-method post",
			},
		],
	},
	{
		type: "category",
		label: "Status",
		items: [
			{
				type: "doc",
				id: "gateway/check-transaction-status",
				label: "Get Transaction Status",
				className: "gateway-method post",
			},
		],
	},
	{
		type: "category",
		label: "Refund",
		items: [
			{
				type: "doc",
				id: "gateway/refund",
				label: "Refund request",
				className: "gateway-method post",
			},
		],
	},
];
