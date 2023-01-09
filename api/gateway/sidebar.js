module.exports = [
  { type: "doc", id: "gateway/public-rest-api" },
  {
    type: "category",
    label: "Purchases",
    items: [
      {
        type: "doc",
        id: "gateway/purchases-create",
        label:
          "Create a purchase – the main request for any e-commerce integration.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-read",
        label: "Retrieve an object by ID.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/purchases-cancel",
        label: "Cancel a pending purchase.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-release",
        label: "Release funds on hold.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-capture",
        label: "Capture a previously authorized payment.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-charge",
        label: "Charge a purchase using a saved token.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-delete-recurring-token",
        label: "Delete a recurring token associated with a purchase.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-refund",
        label: "Refund a paid purchase.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-mark-as-paid",
        label: "Mark a purchase as paid.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/purchases-resend-invoice",
        label: "Re-sends invoice",
        className: "api-method post",
      },
    ],
  },
  {
    type: "category",
    label: "Payment methods",
    items: [
      {
        type: "doc",
        id: "gateway/payment-methods",
        label: "Get the list of payment methods available for your purchase.",
        className: "api-method get",
      },
    ],
  },
  {
    type: "category",
    label: "Billing",
    items: [
      {
        type: "doc",
        id: "gateway/billing-templates-one-time-invoices",
        label: "Send an invoice to one or several clients.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-create",
        label:
          "Create a template to issue repeated invoices from in the future, with or without a subscription.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-list",
        label: "List all billing templates.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-read",
        label: "Retrieve a billing template by ID.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-update",
        label: "Update a billing template by ID.",
        className: "api-method put",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-delete",
        label: "Delete a billing template by ID.",
        className: "api-method delete",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-send-invoice",
        label:
          "Send an invoice, generating a purchase from billing template data.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-add-subscriber",
        label:
          "Add a billing template client and activate recurring billing (is_subscription: true).",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-clients-list",
        label: "List all billing template clients for this billing template.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-clients-read",
        label: "Retrieve a billing template client by client's ID.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/billing-templates-clients-partial-update",
        label: "Partially update a billing template client by client's ID.",
        className: "api-method patch",
      },
    ],
  },
  {
    type: "category",
    label: "Clients",
    items: [
      {
        type: "doc",
        id: "gateway/clients-create",
        label: "Create a new client.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/clients-list",
        label: "List all clients.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/clients-read",
        label: "Retrieve an object by ID.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/clients-update",
        label: "Update a client by ID.",
        className: "api-method put",
      },
      {
        type: "doc",
        id: "gateway/clients-partial-update",
        label: "Partially update a client by ID.",
        className: "api-method patch",
      },
      {
        type: "doc",
        id: "gateway/clients-delete",
        label: "Delete a client by ID.",
        className: "api-method delete",
      },
      {
        type: "doc",
        id: "gateway/client-recurring-tokens-list",
        label: "List recurring tokens saved for a client.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/client-recurring-tokens-read",
        label: "Retrieve an object by ID.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/client-recurring-tokens-delete",
        label: "Delete a client recurring token by ID.",
        className: "api-method delete",
      },
    ],
  },
  {
    type: "category",
    label: "Webhooks",
    items: [
      {
        type: "doc",
        id: "gateway/webhooks-create",
        label: "Create a new webhook.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/webhooks-list",
        label: "List all webhooks.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/webhooks-read",
        label: "Retrieve an object by ID.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/webhooks-update",
        label: "Update a webhook by ID.",
        className: "api-method put",
      },
      {
        type: "doc",
        id: "gateway/webhooks-partial-update",
        label: "Partially update a webhook by ID.",
        className: "api-method patch",
      },
      {
        type: "doc",
        id: "gateway/webhooks-delete",
        label: "Delete a webhook by ID.",
        className: "api-method delete",
      },
    ],
  },
  {
    type: "category",
    label: "Public Key",
    items: [
      {
        type: "doc",
        id: "gateway/public-key",
        label: "Get a callback public key.",
        className: "api-method get",
      },
    ],
  },
  {
    type: "category",
    label: "Account",
    items: [
      {
        type: "doc",
        id: "gateway/balance",
        label: "Get company balance.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/turnover",
        label: "Get company turnover.",
        className: "api-method get",
      },
    ],
  },
  {
    type: "category",
    label: "Company Statements",
    items: [
      {
        type: "doc",
        id: "gateway/company-statements-create",
        label: "Schedule a statement generation.",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "gateway/company-statements-list",
        label: "List all generated statements.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/company-statements-read",
        label: "Retrieve a statement by ID.",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "gateway/company-statements-cancel",
        label: "Cancel a statement generation by ID.",
        className: "api-method post",
      },
    ],
  },
];
