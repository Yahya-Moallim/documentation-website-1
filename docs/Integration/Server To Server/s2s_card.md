---
id: s2s_card
title: S2S CARD
---
Version: 5.6.2<br/>
Released: 2025/02/26<br/>

## Introduction
---

This document describes integration procedures and POST protocol usage for e-commerce merchants.

S2S CARD protocol implements acquiring payments (purchases) with specific API interaction using.

⚠️ **Pay attention** <br/>

> _To work with S2S CARD protocol, merchants are required to comply with the Payment Card Industry Data Security Standards (PCI DSS)._

## Integration process
---

### Merchant registration

Before you get an account to access Payment Platform, you must provide the following data to the Payment Platform administrator.

| **Data** | **Description** |
| --- | --- |
| IP list | List of your IP addresses, from which requests to Payment Platform will be sent |
| Callback URL | URL which will be receiving the notifications of the processing results of your request to Payment Platform.<br/>It is mandatory if your account supports 3D-Secure. The length of Notification URL should not be more<br/>than 255 symbols. |
| Contact email | Email address of Responsible Person who will monitor transactions, conduct refunds, etc. |

With all Payment Platform POST requests at Notification URL the Merchant must return the string OK if he/she successfully received data or return ERROR.

⚠️ **Pay attention** <br/>

> _Note that the notification URL may be temporarily blocked due to consistently receiving timeouts in response to the callback.
If five timeouts accumulate within five minutes for a merchant’s notification URL, it will be blocked for 15 minutes. During this block, all merchants associated with the URL will not receive notifications.
The block automatically lifts after 15 minutes.
Additionally, it is possible to manually unblock the URL through the admin panel by navigating to Configuration → Merchants → Edit Merchant. In this case, the block will be removed immediately.
The timeout counter resets if a callback response is successfully processed. For instance, if there are four timeouts within five minutes but a successful response on the sixth minute, the counter resets._

You should get the following information from administrator to begin working with the Payment Platform.

| **Data** | **Description** |
| --- | --- |
| CLIENT_KEY | Unique key to identify the account in Payment Platform (used as request parameter). In the administration platform this parametercorresponds to the Merchant key field |
| PASSWORD | Password for Client authentication in Payment Platform (used for calculating hash parameter). In the administration platform this parameter corresponds to the Password field |
| PAYMENT_URL | URL to request the Payment Platform |

### Protocol Mapping

It is necessary to check the existence of the protocol mapping before using the S2S integration.
Merchants can’t make payments if the S2S CARD protocol is not mapped.


### Interaction with Payment Platform

For the transaction, you must send the server to server HTTPS POST request with fields listed below to Payment Platform URL (PAYMENT_URL). In response Payment Platform will return the JSON ([http://json.org/](http://json.org/)) encoded string.

⚠️ **Pay attention** <br/>
> The S2S (Server-to-Server) protocol requires requests to be sent with the following content type:
Header:<br/>
Content-Type: application/x-www-form-urlencoded

#### 3DS features

If your account supports 3D-Secure and credit card supports 3D-Secure, then Payment Platform will return the link to the 3D-Secure Access Control Server to perform 3D-Secure verification. In this case, you need to redirect the cardholder at this link. If there are also some parameters except the link in the result, you will need to redirect the cardholder at this link together with the parameters using the method of data transmitting indicated in the same result.

In the case of 3D-Secure after verification on the side of the 3D-Secure server, the owner of a credit card will come back to your site using the link you specify in the sale request, and Payment Platform will return the result of transaction processing to the Notification URL action.

⚠️ **NOTE:** <br/>

> As per our API for any 3DS transaction after request, we send to merchant response with:
>
>> - ```redirect_url``` - URL to which the Merchant should redirect the Customer
>> - ```redirect_params``` - Object of specific 3DS parameters. It is an array if ```redirect_params``` have no data. The availability of the ```redirect_params``` depends on the data transmitted by the acquirer. ```Redirect_params``` may be missing. It usually happens when ```redirect_method``` = GET
(or others).
>> - ```redirect_method``` - The method of transferring parameters (POST or GET)
>>
>> ```Redirect_params``` is a value that depends on any particular acquirer. Possible ```redirect_params```: ```PaReq```, ```TermUrl```, and many other multiple values. Each acquirer can send values in different ways and our interface is unified to be able to process redirects to all versions of 3DS and redirection regardless of the acquirer.
>>
>>In general, the redirect works as follows: obtain the response sent from our server, check if it contains redirect data along with associated parameters, and, if redirect data is present, generate an HTML document with a form. Return this HTML content as the response to the customer’s browser. The customer’s browser will automatically handle the redirect process.
>>
>>
>>
>>
>> ⚠️ **NOTE:** <br/>
>>If the required method is `GET` and the `redirect_url` contains query parameters, such as:  
>>`redirect_url=https://example.domain.com/?parameter=1`  
>>
>>There are two possible approaches for implementing the redirect:
>>
>>***Option 1***: Redirecting the customer by sending query parameters within the form inputs<br/>
>>Parse the query parameters from the `redirect_url` and pass them as input elements in an HTML 
>>form.
>>
>>**Example:**  
>>```
>><form action="https://example.domain.com" method="GET">
>>  <input name="parameter" value="1">
>>  <input type="submit" value="Go">
>></form>
>>```
>>
>>***Option 2***: Redirect Using JavaScript <br/>
>>Use JavaScript to redirect the customer to the specified ```redirect_url``` with the query parameters:
>>
>>**Example:**  
>>```
>>document.location = 'https://example.domain.com/?parameter=1';
>>```


#### Redirect parameters
For 3DS-payments, the response for SALE request may contain an object with the redirect parameters. The redirect parameters are provided in the "key-value" format. 

To get the parameters in that format, you need to use an endpoint ```https://{PAYMENT_URL}/post```.

<details>
  <summary markdown="span">Response with key-value format</summary>

```
    "redirect_params": {
        "Param1": "Value1",
        "Param2": "Value2"
    }
```
</details>

As well you can receive redirect parameters as an array with objects that contain the ```name``` and ```value``` parameters. 

To get the parameters in that format, you need to use an endpoint ```https://{PAYMENT_URL}/v2/post```.

<details>
  <summary markdown="span">Response with "name" and "value" parameters</summary>

```
    "redirect_params": [
        {
            "name": "Param1",
            "value": "Value1"
        },
        {
            "name": "Param2",
            "value": "Value2"
        }
    ]
```
</details>

### List of possible actions in Payment Platform

When you make request to Payment Platform, you need to specify action that needs to be done. Possible actions are:

| **Action** | **Description** |
| --- | --- |
| SALE | Creates SALE or AUTH transaction |
| CAPTURE | Creates CAPTURE transaction |
| CREDITVOID | Creates REVERSAL or REFUND transaction |
| VOID | Creates VOID transaction |
| DEBIT | Creates DEBIT transaction as a part of transfer flow |
| CREDIT2CARD | Creates CREDIT2CARD transaction |
| GET_TRANS_STATUS | Gets status of transaction in Payment Platform |
| GET_TRANS_DETAILS | Gets details of the order from Payment platform |
| GET_TRANS_STATUS_BY_ORDER | Gets the status of the most recent transaction in the order's transaction subsequence from Payment platform |
| RECURRING_SALE | Creates SALE or AUTH transaction using previously used cardholder data |
| RETRY | Creates RETRY transaction |
| CARD2CARD | Creates TRANSFER transaction – one-step transfer without split to debit and credit |

#### Recurring schedule operations

| **Action** | **Description** |
| --- | --- |
| CREATE_SCHEDULE | Creates a new schedule object|
| PAUSE_SCHEDULE | Suspends the scheduled payments associated with schedule. A schedule can only be paused if its parameter "paused" has a value "N". Paused schedule can't be used for the new recurring payments until it is released via RUN_SCHEDULE |
| RUN_SCHEDULE | Releases the schedule which was paused via PAUSE_SCHEDULE. It re-schedules cycle of payments and set the value "N" for "paused" parameter for schedule |
| DELETE_SCHEDULE | Deleting schedule means that it can’t be used in the recurring payments |
| SCHEDULE_INFO | Retrieves the details of an existing schedule. You only need to supply the unique schedule identifier that was returned upon schedule creation |
| DESCHEDULE | Stops the payments by the schedule |


Following actions cannot be made by request, they are initiated by Payment Platform in certain circumstances (e.g. issuer initiated chargeback) and you receive callback as a result.

| **Action** | **Description** |
| --- | --- |
| CHARGEBACK | CHARGEBACK transaction was created in Payment Platform |

### List of possible transaction results and statuses

**Result** - value that system returns on request. Possible results are:

| **Result** | **Description** |
| --- | --- |
| SUCCESS  | Action was successfully completed in Payment Platform |
| DECLINED | Result of unsuccessful action in Payment Platform |
| REDIRECT | Additional action required from requester (Redirect to 3ds) |
| ACCEPTED | Action was accepted by Payment Platform, but will be completed later |
| ERROR    | Request has errors and was not validated by Payment Platform |
| UNDEFINED | The transaction has an undefined status. Status could be changed to success or fail |

**Status** - actual status of transaction in Payment Platform. Possible statuses are:

| **Status** | **Description** |
| --- | --- |
| 3DS | The transaction awaits 3D-Secure validation |
| REDIRECT | The transaction is redirected |
| PENDING | The transaction awaits CAPTURE |
| PREPARE | Status is undetermined, final status will be sent in callback |
| SETTLED | Successful transaction |
| REVERSAL | Transaction for which reversal was made |
| REFUND | Transaction for which refund was made |
| VOID | Transaction for which void was made |
| CHARGEBACK | Transaction for which chargeback was made |
| DECLINED | Not successful transaction |

### Callback Events

Merchants receive callbacks when creating transactions with the following statuses:

|**Transaction** | **Status** |
| --- | --- |
| SALE, CREDITVOID, DEBIT, RECURRING_SALE, CARD2CARD | SUCCESS, FAIL, WAITING, UNDEFINED |
| CAPTURE, VOID, CREDIT2CARD | SUCCESS, FAIL, UNDEFINED |

## PAYMENT OPERATIONS

### SALE request
---
Payment Platform supports two main operation type: Single Message System (SMS) and Dual Message System (DMS).

SMS is represented by SALE transaction. It is used for authorization and capture at a time. This operation is commonly used for immediate payments.

DMS is represented by AUTH and CAPTURE transactions. AUTH is used for authorization only, without capture. This operation used to hold the funds on card account (for example to check card validity).

SALE request is used to make both SALE and AUTH transactions.

If you want to make AUTH transaction, you need to use parameter auth with value Y.

If you want to send a payment for the specific sub-account (channel), you need to use `channel_id`, that specified in your Payment Platform account settings.

This request is sent by POST in the background (e.g. through PHP CURL).

⚠️ **Pay attention** <br/>

> _In the case of cascading, the logic for sending callbacks differs.<br/> If cascading is triggered for the order, in general case you will receive only callback for the last payment attempt, where the final status of the order (settled or declined) is determined.
In the particular cases, you will receive callback for the first payment attempt with the data for customer’s redirection if it is required by payment provider. Callbacks for intermediate attempts (between the first decline and the last payment attempt) are not sent._<br/>

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | Sale | SALE | + |
| ```client_key``` | Unique key (client_key) | UUID format value | + |
| ```channel_id``` | Payment channel (Sub-account) | String up to 16 characters | - |
| ```order_id``` | Transaction ID in the Merchants system | String up to 255 characters | + |
| ```order_amount``` | The amount of the transaction |Format depends on currency.<br />Send Integer type value for currencies with zero-exponent. **Example:** <font color='grey'>1000</font><br />Send Float type value for currencies with exponents 2, 3, 4.<br />Format for 2-exponent currencies: <font color='grey'>XX.XX</font> **Example:** <font color='grey'>100.99</font><br />**Pay attention** that currencies 'UGX', 'JPY', 'KRW', 'CLP' must be send in the format <font color='grey'>XX.XX</font>, with the zeros after comma. **Example:** <font color='grey'>100.00</font><br />Format for 3-exponent currencies: <font color='grey'>XXX.XXX</font> **Example:** <font color='grey'>100.999.</font><br />Format for 4-exponent currencies: <font color='grey'>XXX.XXXX</font> **Example:** <font color='grey'>100.9999</font><br /> | + |
| ```order_currency``` | Currency | 3-letter code | + |
| ```order_description``` | Description of the transaction (product name) | String up to 1024 characters | + |
| ```req_token``` | Special attribute pointing for further tokenization | Y or N (default N) | - |
| ```card_token``` | Credit card token value | String 64 characters | - |
| ```card_number``` | Credit Card Number || + * |
| ```card_exp_month``` | Month of expiry of the credit card | Month in the form XX | + * |
| ```card_exp_year``` | Year of expiry of the credit card | Year in the form XXXX | + * |
| ```card_cvv2``` | CVV/CVC2 credit card verification code | 3-4 symbols | + ** |
| ```digital_wallet``` | Determines the use of digital wallets<br/><br/>Possible values:<br/> •	googlepay<br/>•	applepay<br/> Make sure that both digital_wallet and payment_token parameters are specified | String | - |
| ```payment_token``` | Digital wallet token value<br/> <br/>Provide payment token received from Apple Pay or Google Pay.<br/> Make sure that both ```digital_wallet``` and ```payment_token``` parameters are specified.<br/> If the ```card_token``` is specified, ```payment_token``` will be ignored.<br/> If the optional ```payment_token``` and card data are specified,  ```payment_token``` will be ignored. | String | - |
| ```payer_first_name``` | Customer's name | String up to 32 characters | + |
| ```payer_last_name``` | Customer's surname | String up to 32 characters | + |
| ```payer_middle_name``` | Customer's middle name | String up to 32 characters | - |
| ```payer_birth_date``` | Customer's birthday | format yyyy-MM-dd, e.g. 1970-02-17 | - |
| ```payer_address``` | Customer's address | String up to 255 characters | + |
| ```payer_address2``` | The adjoining road or locality (if required) of the сustomer's address | String up to 255 characters | - |
| ```payer_house_number``` | Customer's house or building number 	| String up to 9 characters | - |
| ```payer_country``` | Customer's country | 2-letter code | + |
| ```payer_state``` | Customer's state | String up to 32 characters | - |
| ```payer_city``` | Customer's city | String up to 40 characters | + |
| ```payer_district``` | Customer's district of city | String up to 32 characters | - |
| ```payer_zip``` | ZIP-code of the Customer | String up to 10 characters | + |
| ```payer_email``` | Customer's email | String up to 256 characters | + |
| ```payer_phone``` | Customer's phone | String up to 32 characters | + |
| ```payer_ip``` | IP-address of the Customer<br/>Both versions, IPv4 and IPv6, can be used. If you are sending IPv6, make sure the payment provider that processes the payments supports it. | XXX.XXX.XXX.XXX | + |
| ```term_url_3ds``` | URL to which Customer should be returned after 3D-Secure | String up to 1024 characters | + |
| ```term_url_target``` | Name of, or keyword for a browsing context where Customer should be returned according to HTML specification. | String up to 1024 characters<br></br>Possible values: ```_blank```, ```_self```, ```_parent```, ```_top``` or custom iframe name (default ```_top```).<br></br>Find the result of applying the values in the HTML standard description ([Browsing context names](https://html.spec.whatwg.org/#valid-browsing-context-name)) | - |
| ```recurring_init``` | Initialization of the transaction with possible following recurring | Y or N (default N) | - |
| ```schedule_id```    | Schedule ID for recurring payments | String                                              | - |
| ```auth``` | Indicates that transaction must be only authenticated, but not captured | Y or N (default N) | - |
| ```parameters``` | Object that contains extra-parameters required by the acquirer |Format: <br/> ```parameters [param1]: value1``` <br/> ```parameters [param2]: value2``` <br/> ```parameters [paramN]: valueN``` | - |</br>See Appendix C for more details| - |
| ```custom_data``` | Array with the custom data <br/> This block duplicates the arbitrary parameters that were passed in the payment request |Format: <br/> ```custom_data [param1]: value1``` <br/> ```custom_data [param2]: value2``` <br/> ```custom_data [paramN]: valueN``` | - |
| ```hash``` | Special signature to validate your request to Payment Platform |See Appendix A, Formula 1 <br/> In case of digital wallets - Formula 8| + |

*_This field becomes optional if ```card_token``` or ```payment_token``` is specified_

** _This field becomes optional if ```payment_token``` is specified_

If the optional parameter ```card_token``` and card data are specified, ```card_token``` will be ignored.

If the optional parameters ```req_token``` and ```card_token``` are specified, ```req_token``` will be ignored.

#### Response parameters 

You will get JSON encoded string (see an example on Appendix B) with transaction result. If your account supports 3D-Secure, transaction result will be sent to your Notification URL.

#### Synchronous mode

##### Successful sale response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | SUCCESS |
| ```status``` | PENDING / PREPARE / SETTLED; only PENDING when `auth` = Y |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```recurring_token``` | Recurring token (get if account support recurring sales and was initialization transaction for following recurring) |
| ```schedule_id``` | Schedule ID for recurring payments. It is available if schedule is used for recurring sale |
| ```card_token``` | If the parameter `req_token` was enabled Payment Platform returns the token value |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |

##### Unsuccessful sale response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```decline_reason``` | The reason why the transaction was declined |
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |

##### 3D-Secure transaction response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | REDIRECT |
| ```status``` | 3DS / REDIRECT |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```redirect_url``` | URL to which the Merchant should redirect the Customer |
| ```redirect_params``` | Object of specific 3DS parameters. It is array if ```redirect_params``` have no data. The availability of the ```redirect_params``` depends on the data transmitted by the acquirer. ```redirect_params``` may be missing. It usually happens when ```redirect_method``` = GET |
| ```redirect_method``` | The method of transferring parameters (POST / GET) |
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |

##### Undefined sale response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | UNDEFINED |
| ```status``` | PENDING / PREPARE; PENDING only when `auth` = Y |
| ```order_id``` | Transaction ID in the Merchant's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |

#### Callback parameters

##### Successful sale response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | SUCCESS |
| ```status``` | PENDING/PREPARE/SETTLED |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```hash ```| Special signature, used to validate callback, see Appendix A, Formula 2 |
| ```recurring_token``` | Recurring token (get if account support recurring sales and was initialization transaction for following recurring) |
| ```schedule_id``` | It is available if schedule is used for recurring sale |
| ```card_token``` | If the parameter `req_token` was enabled Payment Platform returns the token value |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id` ** \* ** | Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
|```card```|Card mask. <br/> If a digital wallet was used, the value obtained when decrypting the wallet token will be provided in this parameter|
|```card_expiration_date```| Card expiration date|
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```exchange_rate``` | Rate used to make exchange.<br />It returns if the currency exchange has been applied for the payment. |
| ```exchange_rate_base``` | The rate used in the double conversion to convert the original currency to the base currency.<br />It returns if the currency exchange has been applied for the payment. |
| ```exchange_currency``` | Original currency.<br />It returns if the currency exchange has been applied for the payment. |
| ```exchange_amount``` | Original amount.<br />It returns if the currency exchange has been applied for the payment. |
| ```custom_data``` | Object with the custom data. <br/> This block duplicates the arbitrary parameters that were passed in the payment request|
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).

##### Unsuccessful sale response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant`s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```decline_reason``` | Description of the cancellation of the transaction |
| ```custom_data``` | Object with the custom data. <br/> This block duplicates the arbitrary parameters that were passed in the payment request|
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

##### 3D-Secure transaction response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | REDIRECT |
| ```status``` | 3DS/REDIRECT |
| ```order_id``` | Transaction ID in the Merchant`s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```redirect_url``` | URL to which the Merchant should redirect the Customer |
| ```redirect_params``` | Object with the parameters. It is array if ```redirect_params``` have no data. The availability of the ```redirect_params``` depends on the data transmitted by the acquirer. ```redirect_params``` may be missing. It usually happens when ```redirect_method``` = GET |
| ```redirect_method``` | The method of transferring parameters (POST or GET) |
| ```custom_data``` | Object with the custom data. <br/> This block duplicates the arbitrary parameters that were passed in the payment request|
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

##### Undefined sale response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```result``` | UNDEFINED |
| ```status``` | 3DS / REDIRECT / PENDING / PREPARE |
| ```order_id``` | Transaction ID in the Merchant`s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Order currency |
| ```custom_data``` | Object with the custom data. <br/> This block duplicates the arbitrary parameters that were passed in the payment request|
| ```digital_wallet``` | Wallet provider: googlepay, applepay |
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number). |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

### CAPTURE request
---
CAPTURE request is used to submit previously authorized transaction (created by SALE request with parameter ```auth``` = Y). Hold funds will be transferred to Merchants account.

This request is sent by POST in the background (e.g. through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | Capture previously authenticated transaction | CAPTURE | + |
| ```client_key``` | Unique key (client_key) | UUID format value | + |
| ```trans_id``` | Transaction ID in the Payment Platform | UUID format value | + |
| ```amount``` | The amount for capture. Only one partial capture is allowed |Format depends on currency.<br />Send Integer type value for currencies with zero-exponent. <br/> **Example:** <font color='grey'>1000</font><br />Send Float type value for currencies with exponents 2, 3, 4.<br />Format for 2-exponent currencies: <font color='grey'>XX.XX</font> <br/> **Example:** <font color='grey'>100.99</font><br />**Pay attention** that currencies 'UGX', 'JPY', 'KRW', 'CLP' must be send in the format <font color='grey'>XX.XX</font>, with the zeros after comma. <br/> **Example:** <font color='grey'>100.00</font><br />Format for 3-exponent currencies: <font color='grey'>XXX.XXX</font> <br/> **Example:** <font color='grey'>100.999.</font><br />Format for 4-exponent currencies: <font color='grey'>XXX.XXXX</font> <br/> **Example:** <font color='grey'>100.9999</font><br />| - |
| ```hash``` | Special signature to validate your request to payment platform | see Appendix A, Formula 2 | + |

#### Response parameters

#### Synchronous mode

##### Successful capture response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CAPTURE |
| ```result``` | SUCCESS |
| ```status``` | SETTLED |
| ```amount``` | Amount of capture |
| ```order_id``` | Transaction ID in the Merchants system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```currency``` | Currency |

##### Unsuccessful capture response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CAPTURE |
| ```result``` | DECLINED |
| ```status``` | PENDING |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Amount of capture |
| ```currency``` | Currency |
| ```decline_reason``` | The reason why the capture was declined |

##### Undefined capture response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CAPTURE |
| ```result``` | UNDEFINED |
| ```status``` | PENDING |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Amount of capture |
| ```currency``` | Currency |

#### Callback parameters

##### Successful capture response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CAPTURE |
| ```result``` | SUCCESS |
| ```status``` | SETTLED |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```amount``` | Amount of capture |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```currency``` | Currency |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id`**\***| Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).


##### Unsuccessful capture response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CAPTURE |
| ```result``` | DECLINED |
| ```status``` | PENDING |
| ```order_id``` | Transaction ID in the Merchant's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```decline_reason``` | The reason why the capture was declined |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

##### Undefined capture response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CAPTURE |
| ```result``` | UNDEFINED |
| ```status``` | PENDING |
| ```order_id``` | Transaction ID in the Merchant's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as cardholder will see in the bank statement |
| ```amount``` | Amount of capture |
| ```currency``` | Currency |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

### CREDITVOID request
---
CREDITVOID request is used to complete both REFUND and REVERSAL transactions.

REVERSAL transaction is used to cancel hold from funds on card account, previously authorized by AUTH transaction.

REVERSAL transaction is used to reverse completed debit transaction.

REFUND transaction is used to return funds to card account, previously submitted by SALE or CAPTURE transactions.

This request is sent by POST in the background (e.g. through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | CREDITVOID | CREDITVOID | + |
| ```client_key``` | Unique key (client_key) | UUID format value | + |
| ```trans_id``` | Transaction ID in the Payment Platform | UUID format value | + |
| ```amount``` | The amount of full or partial refund. If amount is not specified, full refund will be issued.<br /> In case of partial refund this parameter is required. Several partial refunds are allowed |Format depends on currency.<br />Send Integer type value for currencies with zero-exponent. <br/> **Example:** <font color='grey'>1000</font><br />Send Float type value for currencies with exponents 2, 3, 4.<br />Format for 2-exponent currencies: <font color='grey'>XX.XX</font> <br/> **Example:** <font color='grey'>100.99</font><br />**Pay attention** that currencies 'UGX', 'JPY', 'KRW', 'CLP' must be send in the format <font color='grey'>XX.XX</font>, with the zeros after comma. <br/> **Example:** <font color='grey'>100.00</font><br />Format for 3-exponent currencies: <font color='grey'>XXX.XXX</font> <br/> **Example:** <font color='grey'>100.999.</font><br />Format for 4-exponent currencies: <font color='grey'>XXX.XXXX</font> <br/> **Example:** <font color='grey'>100.9999</font><br />| - |
| ```hash``` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 2  | + |

#### Response parameters

##### Synchronous mode

| **Parameter** | **Description** |
| --- | -- |
| ```action``` | CREDITVOID |
| ```result``` | ACCEPTED |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |

#### Callback parameters

##### Successful refund/reversal response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDITVOID |
| ```result``` | SUCCESS |
| ```status``` | REFUND/REVERSAL - for full refund<br></br> SETTLED - for partial refund |
| ```order_id``` | Transaction ID in the Merchant&#39;s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```creditvoid_date``` | Date of the refund/reversal |
| ```amount``` | Amount of refund |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id`**\***| Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).


##### Unsuccessful refund/reversal response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDITVOID |
| ```result``` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```decline_reason``` | Description of the cancellation of the transaction |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

##### Undefined refund/reversal response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDITVOID |
| ```result``` | UNDEFINED |
| ```status``` | SETTLED |
| ```order_id``` | Transaction ID in the Merchant's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```creditvoid_date``` | Transaction date in the Payment Platform |
| ```amount``` | Order amount |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

### VOID request
---
The VOID request is used to cancel the operation which was performed the same financial day.

The cancellation is possible for the operations:

  - SALE
  - CAPTURE
  - SALE_RECURRING

The VOID request is allowed for the payments in SETTLED status only.

This request is sent by POST in the background (e.g. through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Limitations** | **Required** |
| ------------- | --- | --- | :---: |
| `action` | Action to perform  | = VOID | + |
| `client_key` | Unique client key |CLIENT_KEY  | + |
| `trans_id`| Transaction ID in the Payment Platform | String up to 255 characters | + |
| `hash`| Special signature to validate your request to Payment Platform | See Appendix A, Formula 2. | + |

#### Response parameters

You will get JSON encoded string with transaction result.

##### Successful void response

| **Parameter**   | **Description**                        |
| -------------   | -------------------------------------- |
| `action`        | VOID                             |
| `result`        | SUCCESS                               |
| `status`        | VOID  |
| `order_id`      | Transaction ID in the Client's system  |
| `trans_id`      | Transaction ID in the Payment Platform |
| `trans_date`    | Transaction date in the Payment Platform |

##### Unsuccessful void response

| **Parameter**   | **Description**                        |
| -------------   | -------------------------------------- |
| `action`        | VOID |
| `result`        | DECLINED |
| `status`        | SETTLED  |
| `order_id`      | Transaction ID in the Client's system  |
| `trans_id`      | Transaction ID in the Payment Platform |
| `trans_date`    | Transaction date in the Payment Platform |
| `decline_reason`| The reason why the transaction was declined |

##### Undefined void response

| **Parameter**   | **Description**                        |
| -------------   | -------------------------------------- |
| `action`        | VOID |
| `result`        | UNDEFINED |
| `status`        | PENDING / SETTLED  |
| `order_id`      | Transaction ID in the Client's system  |
| `trans_id`      | Transaction ID in the Payment Platform |
| `trans_date`    | Transaction date in the Payment Platform |

#### Callback parameters

##### Successful void response

| **Parameter**     | **Description**                                            |
| ---------------   | ---------------------------------------------------------- |
| `action`        | VOID                             |
| `result`        | SUCCESS                               |
| `status`        | VOID  |
| `order_id`      | Transaction ID in the Client's system  |
| `trans_id`      | Transaction ID in the Payment Platform |
| `trans_date`    | Transaction date in the Payment Platform |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id`**\***| Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
| `hash`            | Special signature, used to validate callback. See Appendix A, Void signature.|

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).


##### Unsuccessful void response

| **Parameter**    | **Description**                                            |
| --------------   | ---------------------------------------------------------- |
| `action`        | VOID                             |
| `result`        | DECLINED                               |
| `status`        | SETTLED  |
| `order_id`      | Transaction ID in the Client's system  |
| `trans_id`      | Transaction ID in the Payment Platform |
| `trans_date`    | Transaction date in the Payment Platform |
| `decline_reason`| The reason why the transaction was declined |
| `hash`           | Special signature, used to validate callback. See Appendix A, Void signature. |

##### Undefined void response

| **Parameter**    | **Description**                                            |
| --------------   | ---------------------------------------------------------- |
| `action`        | VOID |
| `result`        | UNDEFINED |
| `status`        | PENDING / SETTLED |
| `order_id`      | Transaction ID in the Client's system  |
| `trans_id`      | Transaction ID in the Payment Platform |
| `trans_date`    | Transaction date in the Payment Platform |
| `hash`          | Special signature, used to validate callback. See Appendix A, Void signature. |

### DEBIT request

Use DEBIT action to create debit transaction as a part of transfer flow.

#### Request Parameters

| **Parameter**    | **Description** | **Values**    | **Required** |
| --------------   | --------------- | -----------   | ------------ |
| ```action```   | Action that you want to perform. Fixed value. | DEBIT | + |
| ```client_key```   | Unique key<br/>(CLIENT_KEY) | UUID format value   | + |
| ```order_id```   | Transaction ID in the Merchants system | String up to 255 characters | + |
| ```order_amount```   | The amount of the transaction | Numbers in the format<br/>XXXX.XX | + |
| ```order_currency```   | Currency | Currency | + |
| ```order_description```   | Description of the transaction (product name) | String up to 1024 characters | + |
| ```term_url_3ds```   | URL to which Customer should be returned after 3D-Secure | String up to 1024 characters | + |
| ```card_number```   | Credit Card Number | Credit Card Number format | + |
| ```card_exp_month```   | Month of expiry of the credit card | Month in the form XX | + |
| ```card_exp_year```   | Year of expiry of the credit card | Year in the form XXXX | + |
| ```card_cvv2```   | CVV/CVC2 credit card verification code | 3-4 symbols | + |
| ```payer_first_name```   | Customer’s name | String up to 32 characters | - |
| ```payer_last_name```   | Customer’s surname | String up to 32 characters   | - |
| ```payer_middle_name```   | Customer’s middle name | String up to 32 characters | - |
| ```payer_birth_date```   | Customer’s birthday | format yyyy-MM-dd,<br/>e.g. 1970-02-17 | - |
| ```payer_address```   | Customer’s address | String up to 255 characters | - |
| ```payer_address2```   | The adjoining road or locality (if required) of the сustomer’s address | String up to 255 characters | - |
| ```payer_country```   | Customer’s country | 2-letter code | - |
| ```payer_state```   | Customer’s state | String up to 32 characters | - |
| ```payer_city```   | Customer’s city | String up to 32 characters | - |
| ```payer_zip```   | ZIP-code of the Customer | String up to 10 characters | - |
| ```payer_email```   | Customer’s email | String up to 256 characters | - |
| ```payer_phone```   | Customer’s phone | String up to 32 characters | - |
| ```payer_ip```   | IP-address of the Customer | XXX.XXX.XXX.XXX | + |
| ```parameters```   | Object that contains extra-parameters required by the acquirer | Format:<br/>"parameters": {"param1": "value1", "param2": "value2", "param3": "value3"}<br/>See Appendix C for more details | - |
| ```hash```   | Special signature to validate your request to Payment Platform | See Appendix A, Formula 1 | + |

#### Response Parameters

You will get JSON encoded string with transaction result. If your account supports 3D-Secure, transaction result will be sent to your Notification URL.

#### Synchronous mode

##### Successful response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | SUCCESS |
| ```status``` | 3DS / REDIRECT / SETTLED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |

##### Unsuccessful response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```decline_reason``` | The reason why the transaction was declined |

##### 3D-Secure transaction response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | REDIRECT |
| ```status``` | 3DS / REDIRECT |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```redirect_url``` | URL to which the Merchant should redirect the Customer |
| ```redirect_params``` | Object of specific 3DS parameters.<br/>It is array if redirect_params have no data. The availability of the ```redirect_params``` depends on the data transmitted by the acquirer. ```redirect_params``` may be missing.<br/>It usually happens when ```redirect_method``` = GET |
| ```redirect_method``` | The method of transferring parameters (POST / GET) |

##### Undefined response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | UNDEFINED |
| ```status``` | 3DS / REDIRECT / PREPARE |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |

#### Callback parameters

**Successful response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | SUCCESS |
| ```status``` | REDIRECT / 3DS / SETTLED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id`**\***| Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).

**Unsuccessful response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```decline_reason``` | Description of the cancellation of the transaction |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

**3D-Secure transaction response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | REDIRECT |
| ```status``` | 3DS / REDIRECT |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```redirect_url``` | URL to which the Merchant should redirect the Customer |
| ```redirect_params``` | Object with the parameters.<br/>It is array if ```redirect_params``` have no data. The availability of the ```redirect_params``` depends on the data transmitted by the acquirer. ```redirect_params``` may be missing.<br/>It usually happens when ```redirect_method``` = GET |
| ```redirect_method``` | The method of transferring parameters (POST or GET) |

**Undefined response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | DEBIT |
| ```result``` | UNDEFINED |
| ```status``` | REDIRECT / 3DS / PREPARE |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

### CREDIT2CARD request
---
CREDIT2CARD protocol implements money transfers transactions between merchant's account and credit card (Card Credit or Account-to-Card payment) with using specific API.

If you want to send a payment for the specific sub-account (channel), you need to use ```channel_id``` that specified in your Payment Platform account settings.

This request is sent by POST in the background (e.g., through PHP CURL).

#### Request Parameters

| **Parameter** | **Description** | **Values** | **Required** |
| --- | --- | --- | :---: |
| ```action``` | Action type | CREDIT2CARD | + |
| ```client_key``` | Unique client key (CLIENT_KEY) || + |
| ```channel_id``` | Payment channel (Sub-account) | String up to 16 characters | - |
| ```order_id``` | Transaction ID in the Clients system | String up to 255 characters | + |
| ```order_amount``` | The amount of the transaction |Format depends on currency.<br />Send Integer type value for currencies with zero-exponent. **Example:** <font color='grey'>1000</font><br />Send Float type value for currencies with exponents 2, 3, 4.<br />Format for 2-exponent currencies: <font color='grey'>XX.XX</font> **Example:** <font color='grey'>100.99</font><br />**Pay attention** that currencies 'UGX', 'JPY', 'KRW', 'CLP' must be send in the format <font color='grey'>XX.XX</font>, with the zeros after comma. **Example:** <font color='grey'>100.00</font><br />Format for 3-exponent currencies: <font color='grey'>XXX.XXX</font> **Example:** <font color='grey'>100.999.</font><br />Format for 4-exponent currencies: <font color='grey'>XXX.XXXX</font> **Example:** <font color='grey'>100.9999</font><br />| + |
| ```order_currency``` | Currency | 3-letter code | + |
| ```order_description``` | Description of the transaction (product name) | String up to 1024 characters | + |
| ```card_number``` | Credit Card Number || + |
| ```payee_first_name``` | Payee’s name | String up to 32 characters | - |
| ```payee_last_name``` | Payee’s surname | String up to 32 characters | - |
| ```payee_middle_name``` | Payee’s middle name | String up to 32 characters | - |
| ```payee_birth_date``` | Payee’s birthday | format yyyy-MM-dd,<br/>e.g. 1970-02-17 | - |
| ```payee_address``` | Payee’s address | String up to 255 characters | - |
| ```payee_address2``` | The adjoining road or locality (if required) of the сustomer’s address | String up to 255 characters | - |
| ```payee_country``` | Payee’s country | 2-letter code | - |
| ```payee_state``` | Payee’s state | String up to 32 characters | - |
| ```payee_city``` | Payee’s city | String up to 32 characters | - |
| ```payee_zip``` | ZIP-code of the Payee | String up to 10 characters | - |
| ```payee_email``` | Payee’s email | String up to 256 characters | - |
| ```payee_phone``` | Payee’s phone | String up to 32 characters | - |
| ```payer_first_name``` | Payer’s name | String up to 32 characters | - |
| ```payer_last_name``` | Payer’s surname | String up to 32 characters | - |
| ```payer_middle_name``` | Payer’s middle name | String up to 32 characters | - |
| ```payer_birth_date``` | Payer’s birthday | format yyyy-MM-dd,<br/>e.g. 1970-02-17 | - |
| ```payer_address``` | Payer’s address | String up to 255 characters | - |
| ```payer_address2``` | The adjoining road or locality (if required) of the Payer’s address | String up to 255 characters | - |
| ```payer_country``` | Payer’s country | 2-letter code | - |
| ```payer_state``` | Payer’s state | String up to 32 characters | - |
| ```payer_city``` | Payer’s city | String up to 32 characters | - |
| ```payer_zip``` | ZIP-code of the Customer | String up to 10 characters | - |
| ```payer_email``` | Customer’s email | String up to 256 characters | - |
| ```payer_phone``` | Customer’s phone | String up to 32 characters | - |
| ```payer_ip``` | IP-address of the Customer | XXX.XXX.XXX.XXX | - |
| ```parameters``` | Object that contains extra-parameters required by the acquirer |Format:<br/> "parameters": {"param1": "value1", "param2": "value2", "param3": "value3"}<br/>See Appendix C for more details | - |
| ```hash``` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 5 | + |

<details>
	<summary markdown="span">Example Request</summary>

```
curl -d "action=CREDIT2CARD&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&
 channel_id=test&order_id=123456789&order_amount=1.03&order_currency=USD&
 order_description=wine&card_number=4917111111111111&
 hash=a1a6de416405ada72bb47a49176471dc"[https://test.apiurl.com](https://test.apiurl.com/) -k
```
</details>

#### Response Parameters

You will get JSON encoded string with transaction result.

**Successful response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDIT2CARD |
| ```result``` | SUCCESS |
| ```status``` | SETTLED |
| ```order_id``` | Transaction ID in the Client's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | This is a string which the owner of the credit card will see in the statement from the bank. In most cases, this is the Customers support web-site. |

<details>
	<summary markdown="span">Response Example (Successful result)</summary>

```
{
 "action": "CREDIT2CARD",
 "result": "SUCCESS",
 "status": "SETTLED",
 "order_id": "1613117050",
 "trans_id": "e5098d62-6d08-11eb-9da3-0242ac120013",
 "trans_date": "2021-02-12 08:04:15"
 }
```
</details>

**Unsuccessful response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDIT2CARD |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Client's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```decline_reason``` | The reason why the transaction was declined |

<details>
	<summary markdown="span">Response Example (Unsuccessful result)</summary>

```
{
 "action": "CREDIT2CARD",
 "result": "DECLINED",
 "status": "DECLINED",
 "order_id": "1613117050",
 "trans_id": "e5098d62-6d08-11eb-9da3-0242ac120013",
 "trans_date": "2021-02-12 08:04:15",
 "decline_reason": "Declined by processing"
 }
```
</details>

**Undefined response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDIT2CARD |
| ```result``` | UNDEFINED |
| ```status``` | PREPARE |
| ```order_id``` | Transaction ID in the Client's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | This is a string which the owner of the credit card will see in the statement from the bank. In most cases, this is the Customers support web-site. |

<details>
	<summary markdown="span">Response Example (Undefined result)</summary>

```
{
 "action": "CREDIT2CARD",
 "result": "UNDEFINED",
 "status": "PREPARE",
 "order_id": "1613117050",
 "trans_id": "e5098d62-6d08-11eb-9da3-0242ac120013",
 "trans_date": "2021-02-12 08:04:15",
 "descriptor": "Some data"
 }
```
</details>

#### Callback parameters

**Successful response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDIT2CARD |
| ```result``` | SUCCESS |
| ```status``` | SETTLED |
| ```order_id``` | Transaction ID in the Client's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Date of CREDIT2CARD action |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id`**\***| Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
| ```hash``` | Special signature to validate callback. See Appendix A, Formula 6 |

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).

<details>
	<summary markdown="span">Callback Example (Successful result)</summary>

```
action=CREDIT2CARD&result=SUCCESS&status=SETTLED&order_id=123456789&trans_id=1d152122-6c86-11eb-8a49-0242ac120013&hash=84dc0713fa38f18edb85da7aa94eca2e&trans_date=2021-02-11+16%3A28%3A04
```
</details>

**Unsuccessful response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDIT2CARD |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Client's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Date of CREDIT2CARD action |
| ```decline_reason``` | Reason of transaction decline.It shows for the transactions with the "DECLINED" status |
| ```hash``` | Special signature to validate callback. See Appendix A, Formula 6|

<details>
	<summary markdown="span">Callback Example (Unsuccessful result)</summary>

```
action=CREDIT2CARD&result=DECLINED&status=DECLINED&order_id=123456789&trans_id=1d152122-6c86-11eb-8a49-0242ac120013&decline_reason=reason&hash=84dc0713fa38f18edb85da7aa94eca2e&trans_date=2021-02-11+16%3A28%3A04
```
</details>

**Undefined response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CREDIT2CARD |
| ```result``` | UNDEFINED |
| ```status``` | PREPARE |
| ```order_id``` | Transaction ID in the Client's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Date of CREDIT2CARD action |
| ```hash``` | Special signature to validate callback. See Appendix A, Formula 6|

<details>
	<summary markdown="span">Callback Example (Undefined result)</summary>

```
action=CREDIT2CARD&result=UNDEFINED&status=PREPARE&order_id=123456789&trans_id=1d152122-6c86-11eb-8a49-0242ac120013&hash=84dc0713fa38f18edb85da7aa94eca2e&trans_date=2021-02-11+16%3A28%3A04
```
</details>

### CARD2CARD request
---
Use CARD2CARD action to create transfer transaction.

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | Action that you want to perform. Fixed value. | CARD2CARD | + |
| ```client_key``` | Unique key<br/>(CLIENT_KEY) | UUID format value | + |
| ```channel_id``` | Payment channel<br/>(Sub-account) | String up to 16 characters | - |
| ```order_id``` | Transaction ID in the Merchants system | String up to 255 characters | + |
| ```order_amount``` | The amount of the transaction | Numbers in the format:<br/>XXXX.XX | + |
| ```order_currency``` | Currency | 3-letter code | + |
| ```order_description``` | Description of the transaction (product name) | String up to 1024 characters | + |
| ```payer_card_number``` | Payer credit Card Number | | + |
| ```payer_card_exp_month``` | Month of expiry of the Payer credit card | Month in the form XX | + |
| ```payer_card_exp_year``` | Year of expiry of the Payer credit card | Year in the form XXXX | + |
| ```payer_card_cvv2``` | CVV/CVC2 for Payer credit card verification code | 3-4 symbols | + |
| ```payer_first_name``` | Payer’s name | String up to 32 characters | - |
| ```payer_last_name``` | Payer’s surname | String up to 32 characters | - |
| ```payer_middle_name``` | Payer’s middle name | String up to 32 characters | - |
| ```payer_birth_date``` | Payer’s birthday | format yyyy-MM-dd,<br/>e.g. 1970-02-17 | - |
| ```payer_address``` | Payer’s address | String up to 255 characters | - |
| ```payer_address2``` | The adjoining road or locality (if required) of the Payer’s address | String up to 255 characters | - |
| ```payer_country``` | Payer’s country | 2-letter code | - |
| ```payer_state``` | Payer’s state | String up to 32 characters | - |
| ```payer_city``` | Payer’s city | String up to 32 characters | - |
| ```payer_zip``` | ZIP-code of the Customer | String up to 10 characters | - |
| ```payer_email``` | Customer’s email | String up to 256 characters | - |
| ```payer_phone``` | Customer’s phone | String up to 32 characters | - |
| ```payer_ip``` | IP-address of the Customer | XXX.XXX.XXX.XXX | + |
| ```payee_card_number``` | Payee's credit card Number | | + |
| ```payee_first_name``` | Payee’s name | String up to 32 characters | - |
| ```payee_last_name``` | Payee’s surname | String up to 32 characters | - |
| ```payee_middle_name``` | Payee’s middle name | String up to 32 characters | - |
| ```payee_birth_date``` | Payee’s birthday | format yyyy-MM-dd,<br/>e.g. 1970-02-17 | - |
| ```payee_address``` | Payee’s address | String up to 255 characters | - |
| ```payee_address2``` | The adjoining road or locality (if required) of the сustomer’s address | String up to 255 characters | - |
| ```payee_country``` | Payee’s country | 2-letter code | - |
| ```payee_state``` | Payee’s state | String up to 32 characters | - |
| ```payee_city``` | Payee’s city | String up to 32 characters | - |
| ```payee_zip``` | ZIP-code of the Payee | String up to 10 characters | - |
| ```payee_email``` | Payee’s email | String up to 256 characters | - |
| ```payee_phone``` | Payee’s phone | String up to 32 characters | - |
| ```term_url_3ds``` | URL to which Customer should be returned after 3D-Secure | String up to 1024 characters | + |
| ```parameters``` | Object that contains extra-parameters required by the acquirer | Format:<br/>"parameters": {"param1": "value1", "param2": "value2", "param3": "value3"}<br/>See Appendix C for more details |- |
| ```hash``` | Special signature to validate your request to Payment Platform | See Appendix A, Formula 1 | + |

#### Response parameters

You will get JSON encoded string with transaction result. If your account supports 3D-Secure, transaction result will be sent to your Notification URL.

#### Synchronous mode

##### Successful response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CARD2CARD |
| ```result``` | SUCCESS |
| ```status``` | SETTLED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |

##### Unsuccessful response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CARD2CARD |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```decline_reason``` | The reason why the transaction was declined |

##### 3D-Secure transaction response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | SALE |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```redirect_method``` | The method of transferring parameters (POST or GET) |
| ```redirect_params``` | Object of specific 3DS parameters.<br/>It is array if ```redirect_params``` have no data. The availability of the ```redirect_params``` depends on the data transmitted by the acquirer.<br/> ```redirect_params``` may be missing. It usually happens when ```redirect_method``` = GET |
| ```redirect_url``` | URL to which the Merchant should redirect the Customer |
| ```result``` | REDIRECT |
| ```status``` | 3DS / REDIRECT |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```trans_id``` | Transaction ID in the Payment Platform |

##### Undefined response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CARD2CARD |
| ```result``` | UNDEFINED |
| ```status``` | 3DS / REDIRECT / PREPARE |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |

#### Callback parameters

**Successful response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CARD2CARD |
| ```result``` | SUCCESS |
| ```status``` | 3DS / SETTLED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id`**\***| Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).

**Unsuccessful response**

 **Parameter** | **Description** |
| --- | --- |
| ```action``` | CARD2CARD |
| ```result``` | DECLINED |
| ```status``` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```decline_reason``` | Description of the cancellation of the transaction |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

**3D-Secure transaction response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CARD2CARD |
| ```result``` | REDIRECT |
| ```status``` | 3DS / REDIRECT |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```redirect_url``` | URL to which the Merchant should redirect the Customer |
| ```redirect_params``` | Object with the parameters.<br/>It is array if ```redirect_params``` have no data. The availability of the ```redirect_params``` depends on the data transmitted by the acquirer. ```redirect_params``` may be missing.<br/>It usually happens when ```redirect_method``` = GET |
| ```redirect_method``` | The method of transferring parameters (POST or GET) |

**Undefined response**

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CARD2CARD |
| ```result``` | UNDEFINED |
| ```status``` | 3DS / REDIRECT / PREPARE |
| ```order_id``` | Transaction ID in the Merchant’s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |
| ```trans_date``` | Transaction date in the Payment Platform |
| ```descriptor``` | Descriptor from the bank, the same as payer will see in the bank statement |
| ```amount``` | Order amount |
| ```currency``` | Currency |

### GET_TRANS_STATUS request
---
Gets order status from Payment Platform. This request is sent by POST in the background (e.g. through PHP CURL).

⚠️ **Pay attention**

>When using cascading (a functionality that allows attempting to process a payment through multiple MIDs until success is achieved), a unique ```order_id``` should be used for each payment, and the final status should primarily rely on the callback.

>In the process of cascading within a single payment request with a specific ```order_id```, multiple payments may be initiated. When attempting to check the status by ```order_id``` using the ```GET_TRANS_STATUS_BY_ORDER``` request, different statuses and ```trans_id```s may be returned in the response, as cascading could still be in progress. Using ```GET_TRANS_STATUS``` with ```trans_id``` provides the status of only a specific payment within the cascading sequence.

>Note: The response logic for a status request depends on the Cascading Context for Get Status setting in Cofiguration --> Protocol Mappings section. If enabled, the system returns the status of the most recently created payment within the cascade (i.e., the payment with the latest creation date), rather than the payment specified in the request.

>To obtain the final status, it is recommended to: <br/>
1) In the protocol mapping section, ensure the option ‘Cascading Context for Get Status’ is enabled. When enabled, a GET_TRANS_STATUS request with trans_id will return the status of the last cascaded payment.<br/>
2) Rely on the callback, as we send callbacks with the final status for the last payment in the cascading process.


>Please note, in 3DS and REDIRECT callbacks, you may receive one ```trans_id```, while in the final status callback, you might see a different ```trans_id```, as the ```trans_id``` reflects the status at a specific stage within the cascading process.

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | GET_TRANS_STATUS | GET_TRANS_STATUS | + |
| ```client_key``` | Unique key (client_key) | UUID format value | + |
| ```trans_id``` | Transaction ID in the Payment Platform | UUID format value | + |
| ```hash``` | Special signature to validate your<br/>request to Payment Platform | CREDIT2CARD - see Appendix A, Formula 6<br/> Others - see Appendix A, Formula 2 | + |

#### Response parameters

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | GET_TRANS_STATUS |
| ```result``` | SUCCESS |
| ```status``` | 3DS / REDIRECT / PENDING / PREPARE / DECLINED / SETTLED / REVERSAL / REFUND / VOID /CHARGEBACK |
| ```order_id``` | Transaction ID in the Merchant`s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```decline_reason``` | Reason of transaction decline. It shows for the transactions with the DECLINED status |
| ```recurring_token``` | Token for recurring. It shows when the next conditions are met for the SALE transaction:<br />- transaction is successful<br />- SALE request contained ```recurring_init``` parameter with the value 'Y' <br /> |
| ```schedule_id``` | Schedule ID for recurring payments  |
| ```digital_wallet``` | Walet provider: googlepay, applepay  |

<details>
	<summary markdown="span">Response Example</summary>

```
{
    "action": "GET_TRANS_DETAILS",
    "result": "SUCCESS",
    "status": "SETTLED",
    "order_id": "1646655381neural",
    "trans_id": "66624eba-9e10-11ec-aa41-0242ac130002",
    "digital_wallet": "googlepay"
}

```
</details>


### GET_TRANS_DETAILS request
---
Gets all history of transactions by the order. This request is sent by POST in the background (e.g. through PHP CURL).

⚠️ **Pay attention**
> For additional information on working with cascading, please refer to the GET_TRANS_STATUS request section

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | GET_TRANS_DETAILS | GET_TRANS_DETAILS | + |
| ```client_key``` | Unique key (client_key) | UUID format value | + |
| ```trans_id``` | Transaction ID in the Payment Platform | UUID format value | + |
| ```hash``` | Special signature to validate your<br/>request to Payment Platform | CREDIT2CARD - see Appendix A, Formula 6<br/> Others - see Appendix A, Formula 2 | + |

#### Response parameters

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | GET_TRANS_DETAILS |
| ```result``` | SUCCESS |
| ```status``` | 3DS / REDIRECT / PENDING / PREPARE / DECLINED / SETTLED / REVERSAL / REFUND / VOID / CHARGEBACK |
| ```order_id``` | Transaction ID in the Merchant`s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```name``` | Payer name |
| ```mail``` | Payer mail |
| ```ip``` | Payer IP |
| ```amount``` | Order amount |
| ```currency``` | Currency |
| ```card``` | Card in the format XXXXXX****XXXX. <br/>If a digital wallet was used, the value obtained when decrypting the wallet token will be provided in this parameter |
| ```decline_reason``` | Reason of transaction decline.It shows for the transactions with the DECLINED status |
| ```recurring_token``` | Token for recurring. It shows when the next conditions are met for the SALE transaction:<br/> - transaction is successful<br/>- SALE request contained `recurring_init` parameter with the value 'Y'<br/>- SALE request contained card data which was used for the first time|
| ```schedule_id``` | Schedule ID for recurring payments |
| ```transactions``` | Array of transactions with the parameters: <br />- date<br /> - type (sale, 3ds, auth, capture, credit, chargeback, reversal, refund)<br />- status (success, waiting, fail)<br />- amount |
| ```digital_wallet``` | Wallet provider: googlepay, applepay|
| ```pan_type``` | It refers to digital payments, such as Apple Pay and Google Pay, and the card numbers returned as a result of payment token decryption: DPAN (Digital Primary Account Number) and FPAN (Funding Primary Account Number).|

<details>
	<summary markdown="span">Response Example</summary>

```
{
    "action": "GET_TRANS_DETAILS",
    "result": "SUCCESS",
    "status": "SETTLED",
    "order_id": "1646655381neural",
    "trans_id": "66624eba-9e10-11ec-aa41-0242ac130002",
    "name": "John Rikher",
    "mail": "test@gmail.com",
    "ip": "192.169.217.106",
    "amount": "0.02",
    "currency": "USD",
    "digital_wallet": "googlepay",
    "card": "522864******0691",
    "pan_type": "dpan",
    "transactions": [
        {
            "type": "3DS",
            "status": "success",
            "date": "2022-03-07 12:16:23",
            "amount": "0.02"
        },
        {
            "type": "SALE",
            "status": "success",
            "date": "2022-03-07 12:16:31",
            "amount": "0.02"
        }
    ]
}

```
</details>

### GET_TRANS_STATUS_BY_ORDER request
---
Gets the status of the most recent transaction in the order's transaction subsequence from Payment Platform. This request is sent by POST in the background (e.g. through PHP CURL).

It is recommended to pass an unique ```order_id``` in the payment request. That way, it will be easier to uniquely identify the payment by ```order_id```. 
This is especially important if cascading is configured. In this case, several intermediate transactions could be created within one payment.

⚠️ **Pay attention**
> For additional information on working with cascading, please refer to the GET_TRANS_STATUS request section

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | GET_TRANS_STATUS_BY_ORDER | GET_TRANS_STATUS_BY_ORDER | + |
| ```client_key``` | Unique key (client_key) | UUID format value | + |
| ```order_id``` | Transaction ID in the Merchants system | UUID format value | + |
| ```hash``` | Special signature to validate your<br/>request to Payment Platform | CREDIT2CARD - see Appendix A, Formula 6 <br/> Others - see Appendix A, Formula 2 | + |

#### Response parameters

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | GET_TRANS_STATUS_BY_ORDER |
| ```result``` | SUCCESS |
| ```status``` | 3DS / REDIRECT / PENDING / PREPARE / DECLINED / SETTLED / REVERSAL / REFUND / VOID / CHARGEBACK |
| ```order_id``` | Transaction ID in the Merchant`s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```decline_reason``` | Reason of transaction decline. It shows for the transactions with the DECLINED status |
| ```recurring_token``` | Token for recurring. It shows when the next conditions are met for the SALE transaction:<br />- transaction is successful<br />- SALE request contained ```recurring_init``` parameter with the value 'Y' <br />|
| ```schedule_id``` | Schedule ID for recurring payments |
| ```digital_wallet``` | Wallet provider: googlepay, applepay |

<details>
	<summary markdown="span">Response Example</summary>

```
{
    "action": "GET_TRANS_STATUS_BY_ORDER",
    "result": "SUCCESS",
    "status": "SETTLED",
    "order_id": "1646655381neural",
    "trans_id": "66624eba-9e10-11ec-aa41-0242ac130002",
    "digital_wallet": "googlepay"
}
```
</details>


### RECURRING_SALE request
---
Recurring payments are commonly used to create new transactions based on already stored cardholder information from previous operations.

RECURRING_SALE request has same logic as SALE request, the only difference is that you need to provide primary transaction id, and this request will create a secondary transaction with previously used cardholder data from primary transaction.

This request is sent by POST in the background (e.g. through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | Recurring sale | RECURRING_SALE | + |
| ```client_key``` | Unique key (CLIENT_KEY) | UUID format value | + |
| ```order_id``` | Transaction ID in the Merchant&#39;s system | String up to 255 characters | + |
| ```order_amount``` | The amount of the transaction |Format depends on currency.<br />Send Integer type value for currencies with zero-exponent. **Example:** <font color='grey'>1000</font><br />Send Float type value for currencies with exponents 2, 3, 4.<br />Format for 2-exponent currencies: <font color='grey'>XX.XX</font> **Example:** <font color='grey'>100.99</font><br />**Pay attention** that currencies 'UGX', 'JPY', 'KRW', 'CLP' must be send in the format <font color='grey'>XX.XX</font>, with the zeros after comma. **Example:** <font color='grey'>100.00</font><br />Format for 3-exponent currencies: <font color='grey'>XXX.XXX</font> **Example:** <font color='grey'>100.999.</font><br />Format for 4-exponent currencies: <font color='grey'>XXX.XXXX</font> **Example:** <font color='grey'>100.9999</font><br />| + |
| ```order_description``` | Transaction description (product name) | String up to 1024 characters | + |
| ```recurring_first_trans_id``` | Transaction ID of the primary transaction in the Payment Platform | UUID format value | + |
| ```recurring_token``` | Value obtained during the primary transaction | UUID format value | + |
| ```schedule_id```    | Schedule ID for recurring payments | String                                              | - |
| ```auth``` | Indicates that transaction must be only authenticated, but not captured | Y or N (default N) | - |
| ```hash``` | Special signature to validate your request to payment platform | see Appendix A, Formula 1 | + |

#### Response parameters

Response from Payment Platform is the same as by SALE command, except for the value of the difference parameter<br/>`action` = RECURRING_SALE. You will receive a JSON encoded string with the result of the transaction.

### RETRY request

---

RETRY request is used to retry funds charging for secondary recurring payments in case of soft decline.

This action creates RETRY transaction and can causes payment final status changing.

This request is sent by POST in the background (e.g. through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```action``` | RETRY  | RETRY  | + |
| ```client_key``` | Unique key (client_key) | UUID format value | + |
| ```trans_id``` | Transaction ID of the softly declined recurring transaction which will be retried. | UUID format value | + |
| ```hash``` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 1 | + |

#### Response parameters

##### Synchronous mode

| **Parameter** | **Description** |
| --- | --- |
| `action` | RETRY |
| `result` | ACCEPTED |
| `order_id` | Transaction ID in the Merchant's system |
| `trans_id` | Transaction ID in the Payment Platform |

#### Callback parameters

##### Successful response

| **Parameter** | **Description** |
| --- | --- |
| `action` | RETRY |
| `result` | SUCCESS |
| `status` | SETTLED |
| `order_id` | Transaction ID in the Merchant's system |
| `trans_id` | Transaction ID in the Payment Platform |
| `amount` | Amount |
| `currency` | Currency |
| `hash` | Special signature, used to validate callback, see Appendix A, Formula 2 |


##### Unsuccessful response

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | RETRY  |
| ```result``` | DECLINED |
| `status` | DECLINED |
| ```order_id``` | Transaction ID in the Merchant's system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| `amount` | Amount |
| `currency` | Currency |
| ```decline_reason``` | Description of the cancellation of the transaction |
| ```hash``` | Special signature, used to validate callback, see Appendix A, Formula 2 |

### CHARGEBACK notification parameters

---

CHARGEBACK transactions are used to dispute already settled payment.

When processing these transactions Payment Platform sends notification to Merchant`s Notification URL. 

| **Parameter** | **Description** |
| --- | --- |
| ```action``` | CHARGEBACK |
| ```result``` | SUCCESS |
| ```status``` | CHARGEBACK |
| ```order_id``` | Transaction ID in the Merchant`s system |
| ```trans_id``` | Transaction ID in the Payment Platform |
| ```amount``` | The amount of the chargeback |
| ```chargeback_date``` | System date of the chargeback |
| ```bank_date``` | Bank date of the chargeback |
| ```reason_code``` | Reason code of the chargeback |
|`connector_name` ** \* ** | Connector's name (Payment Gateway)|
|`rrn` ** \* ** | Retrieval Reference Number value from the acquirer system|
|`approval_code` ** \* ** | Approval code value from the acquirer system|
| `gateway_id` ** \* ** | Gateway ID – transaction identifier provided by payment gateway|
| `extra_gateway_id`**\***| Extra Gateway ID – additional transaction identifier provided by payment gateway|
| `merchant_name`** \* ** | Merchant Name|
| `mid_name` ** \* ** | MID Name|
|`issuer_country` ** \* ** | Issuer Country|
|`issuer_bank` ** \* ** | Issuer Bank|
| ```hash``` | Special signature to validate callback, see Appendix A, Formula 2|

** \* ** The parameters are included if the appropriate setup is configured in the admin panel (see “Add Extended Data to Callback” block in the Configurations -> Protocol Mappings section).

## RECURRING SCHEDULE OPERATIONS
---
Protocol implements schedules for recurring payments with specific API interaction using. Schedules allow you to charge a customer on a recurring basis.

To work with the schedules you must send the server to server HTTPS request to Payment Platform URL (PAYMENT_URL) with the fields listed in "Recurring schedule actions" section. In the response Payment Platform will return the JSON (http://json.org/) encoded string.

### CREATE_SCHEDULE request
To create a new schedule you need to send the request with the parameters listed below.
This request is sent by POST in the background (e.g., through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| `action` | Action to create a new schedule - fixed value | CREATE_SCHEDULE | + |
| `client_key` | Unique key (CLIENT_KEY) | UUID format value | +|
| `name` | Name of schedule | String up to 100 characters | + |
| `interval_length` | Interval length - how often the payments occurs. Cannot be set "0". For example, to set a schedule for payments every 15 days, you need to set: `interval_length` = 15, `interval_unit` = day | Number | + |
| `interval_unit` | Interval unit | Possible values are "day" and "month" | + |
| `day_of_month` | Day of month when payment has to occur. Available only if interval_unit = month. Possible values: from 1 to 31. If day_of_month = 29, 30, or 31 and there are no days 29, 30, or 31 in the month, then the last day of the month is used. If day_of_month is not defined, then payment occurs on the day the initiating payment is created | Number from 1 to 31 | - |
| `payments_count` | Payments count in schedule | Number | +|
| `delays` | Number of skipped intervals of the scheduled before payment cycle starts | Number | - |
| `hash` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 3 | + |

#### Response parameters

You will get JSON encoded string with the request result

| **Parameter** | **Description** |
| --- | --- |
| `action` | CREATE_SCHEDULE |
| `result` | SUCCESS |
| `schedule_id` | Schedule ID in the Payment Platform |

### PAUSE_SCHEDULE request
Suspends the schedule and assigns value "Y" for "paused" parameter. This request is sent by POST in the background (e.g., through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| `action` | Action to pause a schedule - fixed value. | PAUSE_SCHEDULE | + |
| `client_key` | Unique key (CLIENT_KEY) | UUID format value | + |
| `schedule_id` | Schedule ID in the Payment Platform | UUID format value | + |
| `hash` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 4 | + |

#### Response parameters

| **Parameter** | **Description** |
| --- | --- |
| `action` | PAUSE_SCHEDULE |
| `result` | SUCCESS |


### RUN_SCHEDULE request
Releases the paused schedule and assigns value "N" for "paused" parameter. This request is sent by POST in the background (e.g., through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| `action` | Action to run a schedule - fixed value | RUN_SCHEDULE | + |
| `client_key` | Unique key (CLIENT_KEY) | UUID format value | + |
| `schedule_id` | Schedule ID in the Payment Platform | UUID format value | + |
| `hash` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 4 | + |

#### Response parameters

| **Parameter** | **Description** |
| --- | --- |
| `action` | RUN_SCHEDULE |
| `result` | SUCCESS |


### DELETE_SCHEDULE request

To delete an existing schedule you need to send the request with the parameters listed below. This request is sent by POST in the background (e.g., through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| `action` | Action to delete a schedule - fixed value | DELETE_SCHEDULE | + |
| `client_key` | Unique key (CLIENT_KEY) | UUID format value | + |
| `schedule_id` | Schedule ID in the Payment Platform | UUID format value | + |
| `hash` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 4 | + |

#### Response parameters

| **Parameter** | **Description** |
| --- | --- |
| `action` | DELETE_SCHEDULE |
| `result` | SUCCESS |

### SCHEDULE_INFO request
Gets information about an existing schedule. This request is sent by GET in the background (e.g., through PHP CURL).

#### Request parameters

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| `action` | Action to get a schedule info - fixed value | SCHEDULE_INFO | + |
| `client_key` | Unique key (CLIENT_KEY) | UUID format value | + |
| `schedule_id` | Schedule ID in the Payment Platform | UUID format value | + |
| `hash` | Special signature to validate your request to Payment Platform | see Appendix A, Formula 4 | + |

#### Response parameters

| **Parameter** | **Description** |
| --- | --- |
| `action` | SCHEDULE_INFO |
| `name` | Name of schedule |
| `interval_length` | Interval length - how often the payments occurs |
| `interval_unit` | Interval unit |
| `day_of_month` | Day of month when payment has to occur. Available only if interval_unit = month |
| `payments_count` | Payments count in schedule |
| `delays` | Number of skipped intervals of the scheduled before payment cycle starts |
| `paused` | Shows if schedule is in pause (Y or N) |

### DESCHEDULE request

To deschedule recurring and stop the payments by the schedule.

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| `action` | Action to perform | DESCHEDULE | + |
| `client_key` | Unique key (CLIENT_KEY) | UUID format value | + |
| `recurring_token` | Value obtained during the primary transaction | UUID format value | + |
| `schedule_id` | Schedule ID in the Payment Platform | UUID format value | + |
| `hash` | Special signature to validate your request to Payment Platform |see Appendix A, Formula 4 | + |

## Errors
---

In case of an error you get synchronous response from Payment Platform:

| **Parameter** | **Description** |
| --- | --- |
| ```result``` | ERROR |
| ```error_message``` | Error message |
| ```error_code``` | Error code |

The list of the error codes is shown below.

| **Code** | **Description** |
| --- | --- |
| 204002 | Enabled merchant mappings or MIDs not found. |
| 204003 | Payment type not supported. |
| 204004 | Payment method not supported. |
| 204005 | Payment action not supported. |
| 204006 | Payment system/brand not supported. |
| 204007 | Day MID limit is not set or exceeded. |
| 204008 | Day Merchant mapping limit is not set or exceeded. |
| 204009 | Payment type not found. |
| 204010 | Payment method not found. |
| 204011 | Payment system/brand not found. |
| 204012 | Payment currency not found. |
| 204013 | Payment action not found. |
| 204014 | Month MID limit is exceeded. |
| 204015 | Week Merchant mapping limit is exceeded. |
| 208001 | Payment not found. |
| 208002 | Not acceptable to request the 3ds for payment not in 3ds status. |
| 208003 | Not acceptable to request the capture for payment not in pending status. |
| 208004 | Not acceptable to request the capture for amount bigger than auth amount. |
| 208005 | Not acceptable to request the refund for payment not in settled or pending status. |
| 208006 | Not acceptable to request the refund for amount bigger than payment amount. |
| 208008 | Not acceptable to request the reversal for amount bigger than payment amount. |
| 208009 | Not acceptable to request the reversal for partial amount. |
| 208010 | Not acceptable to request the chargeback for amount bigger than payment&#39;s amount. |
| 205005 | Card token is invalid or not found. |
| 205006 | Card token is expired. |
| 205007 | Card token is not accessible. |
| 400 | Duplicate request. |
| 100000 | Previous payment not completed. |


<details>
  <summary markdown="span">Sample of error-response</summary>

```
{
"result": "ERROR",
    "error_code": 100000,
    "error_message": "Request data is invalid.",
    "errors": [
        {
            "error_code": 100000,
            "error_message": "card_number: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "card_exp_month: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "card_exp_year: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "card_cvv2: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "order_id: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "order_amount: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "order_amount: This value should be greater than 0."
        },
        {
            "error_code": 100000,
            "error_message": "order_currency: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "order_description: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_first_name: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_last_name: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_address: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_country: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_city: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_zip: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_email: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_phone: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "payer_ip: This value should not be blank."
        },
        {
            "error_code": 100000,
            "error_message": "term_url_3ds: This value should not be blank."
        }
    ]
}
```

</details>

## Testing
---

You can make test requests using data below. Please note, that all transactions will be processed using Test engine.

| **Card number** | **Card expiration date (MM/YYYY)** | **Testing / Result** |
| :---: | :---: | --- |
| 4111111111111111 | 01/2038 | This card number and card expiration date must be used for testing successful sale. <br />⚠️ Use that card data to create recurring payments and get a recurring token for the initial recurring. Testing recurring payments does not work with other test cards. <br /> Response on successful SALE request:<br /> ```{action: SALE, result: SUCCESS, status: SETTLED}``` <br />Response on successful AUTH request:<br /> ```{action: SALE, result: SUCCESS, status: PENDING}```|
| 4111111111111111 | 02/2038 | This card number and card expiration date must be used for testing unsuccessful sale<br />Response on unsuccessful SALE request:<br />```{action: SALE, result: DECLINED,  status: DECLINED}```<br />Response on unsuccessful AUTH request:<br /> ```{action: SALE, result: DECLINED, status: DECLINED}```|
| 4111111111111111 | 03/2038 | This card number and card expiration date must be used for testing unsuccessful CAPTURE after successful AUTH<br />Response on successful AUTH request: <br /> ```{action: SALE, result: SUCCESS, status: PENDING}```<br />Response on unsuccessful CAPTURE request:<br /> ```{action: CAPTURE, result: DECLINED, status: PENDING}```|
| 4111111111111111 | 05/2038 | This card number and card expiration date must be used for testing successful sale after 3DS verification<br />Response on VERIFY request:<br /> ```{action: SALE, result: REDIRECT, status: 3DS}```<br />After return from ACS:<br /> ```{action: SALE, result: SUCCESS, status: SETTLED}```|
| 4111111111111111 | 06/2038 | This card number and card expiration date must be used for testing unsuccessful sale after 3DS verification<br />Response on VERIFY request:<br /> ```{action: SALE, result: REDIRECT, status: 3DS}```<br />After return from ACS:<br /> ```{action: SALE, result: DECLINED, status: DECLINED}```|
| 4111111111111111 | 12/2038 | This card number and card expiration date must be used for testing successful sale after redirect<br />Response on SALE/AUTH request:<br /> ```{action: SALE, result: REDIRECT, status: REDIRECT}```<br />Return to the system:<br /> ```{action: SALE, result: SUCCESS, status: SETTLED}```|
| 4111111111111111 | 12/2039 | This card number and card expiration date must be used for testing unsuccessful sale after redirect<br />Response on SALE/AUTH request: <br />```{action: SALE, result: REDIRECT, status: REDIRECT}```<br />Return to the system:<br /> ```{action: SALE, result: DECLINED, status: DECLINED}```|
| 4601541833776519 | not applicable | This card number must be used for testing successful credit. <br /> Response on successful CREDIT2CARD request: <br />```{action: CREDIT2CARD, result: SUCCESS, status: SETTLED}```|

## Appendix A (Hash)
---

Hash - is signature rule used either to validate your requests to payment platform or to validate callback from payment platform to your system. It must be md5 encoded string calculated by rules below:

**Formula 1:**

```hash``` **for SALE, RECURRING_SALE, RETRY** is calculated by the formula:

**md5(strtoupper(strrev(email).PASSWORD.strrev(substr(card_number,0,6).substr(card_number,-4))))**

⚠️ **Pay attention** <br/>

> _If the formula contains optional parameters that you do not send in the request (for example,  ```payer_email``` in the DEBIT request), please ignore that parameter for the hash._


if parameter ```card_token``` is specified ```hash``` is calculated by the formula:

**md5(strtoupper(strrev(email).PASSWORD.strrev(card_token)))**

**Formula 2:**

```hash``` is calculated by the formula:

**md5(strtoupper(strrev(email).PASSWORD.trans_id.strrev(substr(card_number,0,6).substr(card_number,-4))))**

**Formula 3:**

```hash``` for **Create a schedule** is calculated by the formula:

**md5(strtoupper(strrev(PASSWORD)));**

**Formula 4:**

```hash``` for **Other schedules** is calculated by the formula:

**md5(strtoupper(strrev(schedule_id + PASSWORD)));**

**Formula 5:**

```hash``` for **CREDIT2CARD request** is calculated by the formula:

**md5(strtoupper(PASSWORD.strrev(substr(card_number,0,6).substr(card_number,-4))))**

if ```card_token``` is specified hash is calculated by the formula:

**md5(strtoupper(PASSWORD. strrev(card_token)))**

**Formula 6:**

```hash``` is calculated by the formula:

**md5(strtoupper(PASSWORD.trans_id.strrev(substr(card_number,0,6).substr(card_number,-4))))**

**Formula 7:**

```hash``` is calculated by the formula:

**md5(strtoupper(strrev(email).PASSWORD.order_id.strrev(substr(card_number,0,6).substr(card_number,-4))))**

**Formula 8:**

```hash``` is calculated by the formula:

**md5(strtoupper(strrev(email) . PASSWORD))**

## Appendix B (Examples)

Please review carefully the list of parameters before using the examples. Some parameters may be missing in the examples.

Requests examples are for reference only. If you will use them unchanged you will receive an error in the response.

You have to set your own values for parameters (`client_key` and `hash` in particular).

All requests are with Content-Type: multipart/form-data.

### SALE request sample
---

#### Sample data of the sale request

| **Parameter** | **Valid value** |
| --- | --- |
| ```action``` | SALE |
| ```client_key``` | c2b8fb04-110f-11ea-bcd3-0242c0a85004 |
| ```order_id``` | ORDER-12345 |
| ```order_amount``` | 1.99 |
| ```order_currency``` | USD |
| ```order_description``` | Product |
| ```card_number``` | 4111111111111111 |
| ```card_exp_month``` | 01 |
| ```card_exp_year``` | 2025 |
| ```card_cvv2``` | 000 |
| ```payer_first_name``` | John |
| ```payer_last_name``` | Doe |
| ```payer_address``` | Big street |
| ```payer_country``` | US |
| ```payer_state``` | CA |
| ```payer_city``` | City |
| ```payer_zip``` | 123456 |
| ```payer_email``` | doe@example.com |
| ```payer_phone``` | 199999999 |
| ```payer_ip``` | 123.123.123.123 |
| ```term_url_3ds 1``` | http://client.site.com/return.php |
| ```hash``` | 2702ae0c4f99506dc29b5615ba9ee3c0 |

The hash above was calculated for PASSWORD equal to_13a4822c5907ed235f3a068c76184fc3_.

<details>
  <summary markdown="span">Sample curl request</summary>

```
curl -d "action=SALE&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&order_id=ORDER12345&
order_amount=1.99&order_currency=USD&order_description=Product&
card_number=4111111111111111&card_exp_month=01&card_exp_year=2025&card_cvv2=000&
payer_first_name=John&payer_last_name=Doe&payer_address=BigStreet&
payer_country=US&payer_state=CA&payer_city=City&payer_zip=123456&
payer_email=doe@example.com&payer_phone=199999999&
payer_ip=123.123.123.123&term_url_3ds=http://client.site.com/return.php&
parameters[param1]=value1&parameters[param2]=value2&parameters[param3]=value3&
hash=2702ae0c4f99506dc29b5615ba9ee3c0" 
https://test.apiurl.com -k
```

</details>

#### Sample response (synchronous mode)

<details>
  <summary markdown="span">The response if the sale is successful</summary>

```
{
"action":"SALE",
"result":"SUCCESS",
"status":"SETTLED",
"order_id":"ORDER-12345",
"trans_id":"aaaff66a-904f-11ea-833e-0242ac1f0007",
"trans_date":"2012-04-03 16:02:01",
"descriptor":"test",
"amount":"0.02",
"currency":"USD"
}
```
</details>

<details>
  <summary markdown="span">The response if the sale is unsuccessful</summary>

```
{
"action":"SALE",
"result":"DECLINED",
"status":"DECLINED",
"order_id":"ORDER-12345",
"trans_id":"aaaff66a-904f-11ea-833e-0242ac1f0007",
"trans_date":"2012-04-03 16:02:01",
"decline_reason":"Declined by processing"
}
```
</details>

<details>
  <summary markdown="span">The response if the transaction supports 3D-Secure</summary>

```
{
"action":"SALE",
"result":"REDIRECT",
"status":"3DS",
"order_id":"1588856266Intelligent",
"trans_id":"595ceeea-9062-11ea-aa1b-0242ac1f0007",
"trans_date":"2012-04-03 16:02:01",
"descriptor":"Descriptor",
"amount":"0.02",
"currency":"USD",
"redirect_url":"https://some.acs.endpoint.com",
"redirect_params":
    {
	"PaReq":"M0RTIE1hc3RlciBVU0QgU1VDQ0VTUw==",
	"MD":"595ceeea-9062-11ea-aa1b-0242ac1f0007",
	"TermUrl":"https://192.168.0.1:8101/verify/3ds/595ceeea-9062-11ea-aa1b-0242ac1f0007/7d6b9b240ff2779b7209aef786f808d1"
    },
"redirect_method":"POST"
}
```
</details>


<details>
	<summary markdown="span">In case of redirect_params is empty</summary>

```
{
"action":"SALE",
"result":"REDIRECT",
"status":"3DS",
"order_id":"1588856266Intelligent",
"trans_id":"595ceeea-9062-11ea-aa1b-0242ac1f0007",
"trans_date":"2012-04-03 16:02:01",
"descriptor":"Descriptor",
"amount":"0.02",
"currency":"USD",
"redirect_url":"https://some.acs.endpoint.com",
"redirect_params":[],
"redirect_method":"POST"
}
```
</details>

<details>
	<summary markdown="span">In case of an error (sample is shown in the “Errors” section)</summary>

```
{
"result":"ERROR",
"error_message":"Error description"
}
```
</details>


#### Sample response (asynchronous mode)

<details>
	<summary markdown="span">The response if the sale is successful</summary>

```
action=SALE&result=SUCCESS&status=SETTLED&order_id=1001&trans_id=aaaff66a-904f-11ea-833e-0242ac1f0007&hash=e36d1001a7ccbfd7870de5c1eab5f86e&trans_date=2022-10-26+11%3A51%3A53&descriptor=Qwest&amount=10.00&currency=EUR&card=4111111%2A%2A%2A%2A11111&card_expiration_date=01%2F2025&exchange_rate=1.058189&exchange_currency=USD&exchange_amount=9.22
```
</details>

### RECURRING_SALE request sample

#### Sample recurring sale request

<details>
	<summary markdown="span">Request Example</summary>

```
curl -d "action=RECURRING_SALE&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&order_id=ORDER-12345&order_amount=1.99&
order_description=Product&recurring_first_trans_id=aaaff66a-904f-11ea-833e-0242ac&
recurring_token=d6dcb9e0-96b6-11ea-bbd1-0242ac120012&
hash=a1a6de416405ada72bb47a49176471dc"
https://test.apiurl.com -k
```
</details>

#### Sample response

<details>
	<summary markdown="span">Response Example</summary>

```
{
"action":"RECURRING_SALE",
"result":"SUCCESS",
"status":"SETTLED",
"order_id":"ORDER-12345",
"trans_id":"aaaff66a-904f-11ea-833e-0242ac1f0007",
"trans_date":"2012-04-03 16:02:01",
"descriptor":"test", 
"amount":"0.02",
"currency":"USD"
}
```
</details>

### CREDITVOID request sample

#### Sample request

<details>
	<summary markdown="span">Request Example</summary>

```
curl -d "action=CREDITVOID&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&trans_id=aaaff66a-904f-11ea-833e-0242ac&amount=10.00&
hash=6b957fca41c353ac344fcad47f0cbf97"
https://test.apiurl.com -k
```
</details>

#### Sample response

<details>
	<summary markdown="span">Response Example</summary>

```
{
"action":"CREDITVOID",
"result":"ACCEPTED",
"trans_id":"aaaff66a-904f-11ea-833e-0242ac",
"order_id":"ORDER-12345"
}
```
</details>

## Appendix C (Additional parameters)

When using some connector services, it is necessary to send additional parameters in the specific request. You can add specific parameters in the ```parameters``` object.
For more information, contact your manager.


### Apple Pay

To use the ```applepay``` payment method, configure the Wallets setting in the admin dashboard. Ensure that the payment provider has confirmed the Apple Pay certificates and verified your domain in the Apple Pay account.

To enable payers to make Apple Pay payments, you can either connect to the Checkout page or work directly via the S2S protocol:

**Checkout Page**: No additional development is required on your side.

**S2S Protocol**: You must be able to obtain the Apple Pay payment token and include it in the SALE request.

Regardless of the protocol you have to make settings in the admin panel and set the following configurations:

  * Merchant Identifier, Country and Shop Name – according to the merchant’s data from [<font color=''><ins>Apple Pay Developer account</ins></font>](https://idmsa.apple.com/IDMSWebAuth/signin?appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757&path=%2Faccount%2Fresources%2Fidentifiers%2Flist%2Fmerchant&rv=1)<br/>
  * Certificate and Private Key – generated Apple Pay certificate and private key<br/>
  * Merchant Capabilities and Supported Networks – configurations for Apple Pay payments<br/>
  * Processing Private Key – private key that uses for payment token decryption (requires if payment provider supports).<br/>

 > ⚠️ Pay attention <br/>
_Before using Apple Pay via S2S CARD protocol, you should review next section carefully. There is a description on how you can obtain Apple Pay payment token (it refers to the official Apple Pay documentation)_

1.	Each payment must be checked for Apple Pay accessibility
2.	Show Apple Pay button to your payers
3.	Validate the merchant identity
4.	Provide a payment request and create a session
5.	Receive Apple Pay payment token (paymentData object)

Once you have implemented Apple Pay payment token generation on your site, you need to include the following in the SALE request:
* ```digital_wallet``` = applepay 
* ```payment_token``` - Apple Pay payment token <br/>

When providing a digital wallet token, you must omit card data (```card_number```, ```card_exp_month```, ```card_exp_year```, ```card_cvv2```).

<details>
  <summary markdown="span">Request example</summary>

```
curl -d "action=SALE
&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004
&order_id=ORDER12345&
&order_amount=1.99
&order_currency=USD
&order_description=Product
&payer_first_name=John
&payer_last_name=Doe
&payer_address=BigStreet
&payer_country=US
&payer_state=CA
&payer_city=City
&payer_zip=123456
&payer_email=doe@example.com
&payer_phone=199999999
&payer_ip=123.123.123.123
&term_url_3ds=http://client.site.com/return.php
&digital_wallet=applepay
&payment_token={"paymentData":{"data":"YOUR_ENCRYPTED_DATA","signature":"YOUR_SIGNATURE","header":{"publicKeyHash":"YOUR_PUBLIC_KEY_HASH","ephemeralPublicKey":"YOUR_EPHEMERAL_PUBLIC_KEY","transactionId":"YOUR_TRANSACTION_ID"},"version":"EC_v1"},"paymentMethod":{"displayName":"Visa 6244","network":"Visa","type":"credit"},"transactionIdentifier":"YOUR_TRANSACTION_IDENTIFIER"},{"transactionId":"TRANSACTION_ID_2","version":"EC_v1"},{"paymentMethod":{"displayName":"Visa 0224","network":"Visa","type":"debit"},"transactionIdentifier":"TRANSACTION_IDENTIFIER_2"}
&parameters[param1]=value1
&parameters[param2]=value2
&parameters[param3]=value3
&hash=2702ae0c4f99506dc29b5615ba9ee3c0" https://test.apiurl.com -k
```
</details>

We also recommend checking out the demo provided by Apple for Apple Pay: https://applepaydemo.apple.com/

---


**Set up Apple Pay**

If you are using the S2S protocol for Apple Pay payments, you will need to configure your Apple Developer account. Follow these steps to set up Apple Pay in your Apple Developer account:

**1.** **Create a Merchant ID** in the "Certificates, Identifiers & Profiles" section.

**2.** **Register and verify the domains** involved in the interaction with Apple Pay (e.g., the checkout page URL where the Apple Pay button is placed) in the "Merchant Domains" section. 

**3.** **Create a Merchant Identity Certificate** in the "Merchant Identity Certificate" section:
   * Generate a pair of certificates (\*.csr and \*.key) and upload the *.csr file in the "Merchant Identity Certificate" section.
   * Create a Merchant Identity Certificate based on the generated CSR file.
   * Download the *.pem file from the portal.

⚠️ **Note**<br/>
> The \*.csr file can be obtained from the payment provider that processes Apple Pay, and the \*.pem file should be uploaded to your payment provider's dashboard, following their instructions.

**4.** **Create a Processing Private Key** in the "Apple Pay Payment Processing Certificate" section:
  * Generate a pair of certificates (\*.csr and \*.key) and upload the *.csr file.
  * Create a Payment Processing Certificate based on the generated CSR file.

For more detailed instructions on setting up Apple Pay, refer to the following resource: [<font color=''><ins>Learn more about setting up Apple Pay</ins></font>](https://developer.apple.com/documentation/passkit_apple_pay_and_wallet/apple_pay/setting_up_apple_pay)<br/>

Next, enter the data from your Apple Pay developer account into the platform's admin panel:
Go to the "Merchants" section, initiate editing, open the "Wallets" tab, navigate to the Apple Pay settings, and fill in the following fields:
  * **Merchant Identifier:** Enter the Merchant ID.
  * **Certificate:** Upload the *.pem file downloaded from the "Merchant Identity Certificate" section.
  * **Private Key:** Upload the *.key file from the certificate pair generated for the Merchant Identity Certificate.
  * **Processing Private Key (required for token decryption)**: Paste the text from the Processing Private Key file. Ensure it is a single line of text (without spaces or breaks) placed between "BEGIN" and "END."


**Apple Pay Payment Flow**

Processing payments via the S2S CARD protocol is supported by select providers. Contact support to check if your provider supports card flow.

By default, all Apple Pay payments on the platform are classified as virtual. As a result: <br/>
* Card details are not stored for these transactions.
*	Functionality is limited for DMS payments and the creation of recurring transactions. <br/>

To access the card flow for Apple Pay payments, you need to:
*	Set up the Processing Private Key in the admin panel settings ("Merchants" section → "Wallets" tab) to enable token decryption.
*	Verify that your payment provider supports card flow processing (ask your support if available).

How It Works:
*	If both requirements are met, the system will always decrypt the Apple Pay token during payment and store the decrypted card data for future transactions.
*	You can view decrypted card details in the Transaction Details section of the admin panel.
*	If any requirement is not met, the SALE request returns error.
*	If your provider supports card flow but does not accept decrypted data, platform can still store the card details for processing. However, some features (e.g., smart routing and cascading) will not be available.


### Google Pay

To provide the payers with the possibility of Google Pay™ payment you can connect to the Checkout or work directly via S2S CARD protocol.<br/>
If you are using Checkout integration to work with googlepay payment method, it requires no additional code implementation.<br/>
If you are using S2S integration to work with googlepay payment method, you must be able to obtain the Google Pay payment token and include it in the SALE request.<br/>
Before using googlepay brand in S2S CARD solution, you need to review this section carefully to meet all the Google Pay™ requirements:<br/> 

1. Overview the documentation on Google Pay Integration first:<br/>
    • for sites - [<font color=''><ins>Google Pay Web developer documentation</ins></font>](https://developers.google.com/pay/api/web)<br/>
    • for Android app - [<font color=''><ins>Google Pay Android developer documentation</ins></font>](https://developers.google.com/pay/api/android)<br/>
2. Make sure you complete all the items on the integration checklist:<br/> 
    • for sites - [<font color=''><ins>Google Pay Web integration checklist</ins></font>](https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist)<br/>
    • for Android app - [<font color=''><ins>Google Pay Android integration checklist</ins></font>](https://developers.google.com/pay/api/android/guides/test-and-deploy/integration-checklist)<br/>
3. To brand your site with Google Pay elements, you must meet the requirements: <br/>
    • for sites - [<font color=''><ins>Google Pay Web Brand Guidelines</ins></font>](https://developers.google.com/pay/api/web/guides/brand-guidelines)<br/>
    • for Android app - [<font color=''><ins>Google Pay Android brand guidelines</ins></font>](https://developers.google.com/pay/api/android/guides/brand-guidelines)<br/>
4. The merchants must adhere to the Google Pay APIs [<font color=''><ins>Acceptable Use Policy</ins></font>](https://payments.developers.google.com/terms/aup) and accept the terms that the [<font color=''><ins>Google Pay API Terms of Service</ins></font>](https://payments.developers.google.com/terms/sellertos) defines.<br/>  

To obtain Google Pay payment token you have to get the PaymentData according to the Google Pay API Integration documentation (see the links above).
Pass the following parameters to receive PaymentData:
* ```allowPaymentMethods```: CARD 
* ```tokenizationSpecification``` = { "type": "PAYMENT_GATEWAY"} 
* ```allowedCardNetworks``` = ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER', 'JCB']; 
* ```allowedCardAuthMethods``` = ['PAN_ONLY', 'CRYPTOGRAM_3DS']; 
* ```gateway``` = value provided by your support manager
* ```gatewayMerchantId``` = CLIENT_KEY (API key)

Once you have implemented Google Pay payment token generation on your site, you need to include the following in the SALE request:
* ```digital_wallet``` = applepay 
* ```payment_token``` - Google Pay payment token<br/>

When providing a digital wallet token, you must omit card data (```card_number```, ```card_exp_month```, ```card_exp_year```, ```card_cvv2```). 


<details>
  <summary markdown="span">Request example</summary>

```
curl -d "action=SALE
&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004
&order_id=ORDER12345&
&order_amount=1.99
&order_currency=USD
&order_description=Product
&payer_first_name=John
&payer_last_name=Doe
&payer_address=BigStreet
&payer_country=US
&payer_state=CA
&payer_city=City
&payer_zip=123456
&payer_email=doe@example.com
&payer_phone=199999999
&payer_ip=123.123.123.123
&term_url_3ds=http://client.site.com/return.php
&digital_wallet=googlepay
&payment_token={\"apiVersionMinor\": 0, \"apiVersion\": 2, \"paymentMethodData\": {\"description\": \"Mastercard •••• 5179\", \"tokenizationData\": {\"type\": \"PAYMENT_GATEWAY\", \"token\": {\"signature\": \"YOUR_SIGNATURE\", \"intermediateSigningKey\": {\"signedKey\": \"YOUR_SIGNED_KEY\", \"signatures\": [\"YOUR_SIGNATURE_2\"]}, \"protocolVersion\": \"ECv2\", \"signedMessage\": {\"encryptedMessage\": \"ENCRYPTED_MESSAGE\", \"ephemeralPublicKey\": \"EPHEMERAL_PUBLIC_KEY\", \"tag\": \"TAG\"}}}, \"type\": \"CARD\", \"info\": {\"cardNetwork\": \"MASTERCARD\", \"cardDetails\": \"5179\"}}}
&parameters[param1]=value1
&parameters[param2]=value2
&parameters[param3]=value3
&hash=2702ae0c4f99506dc29b5615ba9ee3c0" https://test.apiurl.com -k
```
</details>


---

** Set up Google Pay**

The admin panel settings apply to merchants integrated with the platform via the Checkout protocol.<br/><br/>
For merchants using the S2S protocol and obtaining the Google Pay payment token independently, these settings will not apply.<br/><br/>
Exceptions are "Environment" and “Private Key” configurations.<br/><br/>
The "Environment" configuration remains relevant, as it defines the environment where the token was generated and from which the platform expects to receive payment data. Ensure that the environment used to generate the payment token matches the corresponding setting in the admin panel to avoid processing issues.<br/><br/>
The “Private Key” is required for Google token decryption. If it is absent, the card flow cannot be applied to the payment.<br/><br/>
Additionally, to work with Google Pay payments, you must verify the website domains from which Google Pay is processed in the Google Business Console.

---

**Google Pay Payment Flow**

Processing payments via the S2S CARD protocol is supported by select providers. Contact support to check if your provider supports card flow.<br/>
By default, all Google Pay payments on the platform are classified as virtual. As a result:
* Card details are not stored for these transactions.
* Functionality is limited for DMS payments and the creation of recurring transactions.<br/>

To access the card flow for Google Pay payments, you need to:
* Set up the Private Key in the admin panel settings ("Merchants" section → "Wallets" tab) to enable token decryption.
* Verify that your payment provider supports card flow processing (ask your support if available).
<br/>

How It Works:
* If both requirements are met, the system will always decrypt the Google Pay token during payment and store the decrypted card data for future transactions.
* You can view decrypted card details in the Transaction Details section of the admin panel.
* If any requirement is not met, the SALE request returns error.
* If your provider supports card flow but does not accept decrypted data, platform can still store the card details for processing. However, some features (e.g., smart routing and cascading) will not be available.


### SALE request

**Additional parameters - Set 1 (BNG)**

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```bnrg_installm_def``` |Indicates the number of months that will elapse from the purchase until the total or partial charge is made to the cardholder's account (initial deferral).<br></br>Possible values:<br></br> ```01``` - one month <br></br>```00``` - no delay initial|_Numeric_ justified to 2 digits| + |
| ```bnrg_installm_months``` |Indicates the number of monthly payments in which the total amount of the transaction will be divided.<br></br>Example: ```03``` - 3 months|_Numeric_ justified to 2 digits| + |
| ```bnrg_installm_plan```|Indicates if the promotion It will be ́ with interest or without interest. <br></br>Possible values:<br></br>```03``` - no interest<br></br>```05``` - with interest<br></br>```07``` - defer only initial .| _Numeric_ justified to 2 digits | + |

<details>
  <summary markdown="span">Sample curl request</summary>

```
curl -d "action=SALE&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&order_id=ORDER12345&
order_amount=1000.99&order_currency=MXN&order_description=Product&
card_number=4111111111111111&card_exp_month=01&card_exp_year=2025&card_cvv2=000&
payer_first_name=John&payer_last_name=Doe&payer_address=BigStreet&
payer_country=US&payer_state=CA&payer_city=City&payer_zip=123456&
payer_email=doe@example.com&payer_phone=199999999&
payer_ip=123.123.123.123&term_url_3ds=http://client.site.com/return.php&
parameters[bnrg_installm_def]=00&parameters[bnrg_installm_months]=03&parameters[bnrg_installm_plan]=03&
hash=2702ae0c4f99506dc29b5615ba9ee3c0" 
https://test.apiurl.com -k
```

</details>

**Additional parameters - Set 2 (FCP)**

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```document_type``` |Type of the document number specified above. Possibe values: cpf|_String_| + |
| ```document_number``` |Client’s document number|_String_| + |
| ```social_name``` |Client's social name|_String_| + |
| ```fiscal_country``` |An alpha-2 country code of the customer’s tax country|_String_| + |

<details>
  <summary markdown="span">Sample curl request</summary>

```
curl -d "action=SALE&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&order_id=ORDER12345&
order_amount=1000.99&order_currency=BRL&order_description=Product&card_number=4111111111111111&
card_exp_month=01&card_exp_year=2025&card_cvv2=000&payer_first_name=John&payer_last_name=Doe&
payer_address=BigStreet&payer_country=US&payer_state=CA&payer_city=City&payer_zip=123456&
payer_email=doe@example.com&payer_phone=199999999&payer_ip=123.123.123.123
&term_url_3ds=http://client.site.com/return.php
&parameters[document_type]=cpf&parameters[document_number]=231.002.999-00
&parameters[social_name]=Harry Potter&parameters[fiscal_country]=BR
&parameters[toBankAccountId]=a1a1134a-32c6-442c-90c9-66b587d5be00&
hash=2702ae0c4f99506dc29b5615ba9ee3c0" https://test.apiurl.com -k
```
</details>

**Additional parameters - Set 3 (TWD)**

| **Parameter** | **Description** | **Values** | **Required field** |
| --- | --- | --- | :---: |
| ```customer_phone``` | Phone number of the customer. | _String_ | - |
| ```customer_telnocc``` | Country phone code of the customer. | _String_ | -|
| ```shipping_street1``` | Building name, and/or street name of the customer's shipping address. | _String_ | - |
| ```shipping_city``` | City of the customer's shipping address. | _String_ | - |
| ```shipping_state``` | State or region of the customer's shipping address. | _String_ | - |
| ```shipping_postcode``` | Postal code/ Zip code of the customer's shipping address.<br />Max – 9 digits. | _String_ | - |
| ```shipping_country``` | Country of the shipping address.<br />3-digits code | _String_ | - |

<details>
  <summary markdown="span">Sample curl request</summary>

```
curl -d "action=SALE&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&order_id=ORDER12345&
order_amount=1000.99&order_currency=USD&order_description=Product&
card_number=4111111111111111&card_exp_month=01&card_exp_year=2025&card_cvv2=000&
payer_first_name=John&payer_last_name=Doe&payer_address=BigStreet&
payer_country=US&payer_state=CA&payer_city=City&payer_zip=123456&
payer_email=doe@example.com&payer_phone=199999999&
payer_ip=123.123.123.123&term_url_3ds=http://client.site.com/return.php&
parameters[customer_phone]=1234567890&parameters[customer_telnocc]=123&
parameters[shipping_street1]= Moor Building 35274&parameters[shipping_city]=Los Angeles&
parameters[shipping_state]=CA&parameters[shipping_postcode]=098765432&
parameters[shipping_country]=US&hash=2702ae0c4f99506dc29b5615ba9ee3c0" 
https://test.apiurl.com -k
```
</details>

### DEBIT request

**Additional parameters - Set 1 (ERS)**

| **Parameter**|**Description**|**Values**|**Required field**|
| --- | --- | --- | :---: |
|```payer_identity_type```|The type of Sender’s identification document|*String*|-|
|```payer_identity_id```|The number of Sender’s identification document|*String*|-|
|```payer_identity_country```|The country of issuance of the Sender's identification document|*String*|-|
|```payer_identity_exp_date```|The expiration date of the Sender's identification document|*String*|-|
|```payer_nationality```|Sender’s nationality|*String*|-|
|```payer_country_of_birth```|Sender’s country of birth|*String*|-|
|```payee_first_name```|Receiver’s first name|*String*|-|
|```payer_last_name```|Receiver’s last name|*String*|-|
|```payee_middle_name```|Receiver’s middle name|*String*|-|
|```payee_address```|Receiver’s street|*String*|-|
|```payee_city```|Receiver’s city|*String*|-|
|```payee_state```|Receiver’s state|*String*|-|
|```payee_country```|Receiver’s country|*String*|-|
|```payee_zip```|Receiver’s postal code|*String*|-|
|```payee_phone```|Receiver’s phone number|*String*|-|
|```payee_birth_date```|Receiver’s date of the birth|*String*|-|
|```payee_identity_type```|The type of Receiver’s identification document|*String*|-|
|```payee_identity_id```|The number of Receiver’s identification documentt|*String*|-|
|```payee_identity_country```|The country of issuance of Receiver’s identification document|*String*|-|
|```payee_identity_exp_date```|The expiration date of Receiver’s identification document|*String*|-|
|```payee_nationality```|Receiver’s nationality|*String*|-|
|```payee_country_of_birth```|Receiver’s country of birth|*String*|-|

<details>
  <summary markdown="span">Sample curl request</summary>

```
сurl -d "action=DEBIT&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&order_id=ORDER12345&order_amount=1000.99&order_currency=USD
&order_description=Product&card_number=4111111111111111
&card_exp_month=01&card_exp_year=2025&card_cvv2=000&
payer_first_name=John&payer_last_name=Doe&payer_address=BigStreet&
payer_country=US&payer_state=CA&payer_city=City&payer_zip=123456&
payer_email=doe@example.com&payer_phone=199999999&
payer_ip=123.123.123.123&term_url_3ds=http://client.site.com/return.php&
parameters[payer_identity_type]=document type&
parameters[payer_identity_id]=03090807656&parameters[payer_identity_country]=KZ&
parameters[payer_identity_exp_date]=December 2030&
parameters[payer_nationality]=happy nation&parameters[payer_country_of_birth]=KZ&
parameters[payee_first_name]=Jane&parameters[payee_last_name]=Doe&
parameters[payee_middle_name]=middle&parameters[payee_address]=happy nation&
parameters[payee_city]=city name&parameters[payee_state]=state&
parameters[payee_country]=KZ&parameters[payee_zip]=123456&
parameters[payee_phone]=street name&parameters[payee_birth_date]=21.09.1990&
parameters[payee_identity_type]=document type&
parameters[payee_identity_id]=7573829201&parameters[payee_identity_country]=KZ&
parameters[payee_identity_exp_date]=April 2025&
parameters[payee_nationality]=happy nation&parameters[payee_country_of_birth]=KZ&
hash=2702ae0c4f99506dc29b5615ba9ee3c0" 
https://test.apiurl.com/post -k
```
</details>

### CREDIT2CARD request

**Additional parameters - Set 1 (ERS)**

|**Parameter**|**Description**|**Values**|**Required field**|
| --- | --- | --- | :---: |
|```payer_account_number```|Sender's account number. If the source of funds is for card payment, then PAN should be indicated here. If it is an independent account, which, in the event of a request, can be quickly determined and information provided - you can show #NA.|*String*|+|
|```payer_identity_type```|The type of Sender’s identification document|*String*|-|
|```payer_identity_id```|The number of Sender’s identification document|*String*|-|
|```payer_identity_country```|The country of issuance of the Sender's identification document|*String*|-|
|```payer_identity_exp_date```|The expiration date of the Sender's identification document|*String*|-|
|```payer_nationality```|Sender’s nationality|*String*|-|
|```payer_country_of_birth```|Sender’s country of birth|*String*|-|
|```payee_identity_type```|The type of Receiver’s identification document|*String*|-|
|```payee_identity_id```|The number of Receiver’s identification documentt|*String*|-|
|```payee_identity_country```|The country of issuance of Receiver’s identification document|*String*|-|
|```payee_identity_exp_date```|The expiration date of Receiver’s identification document|*String*|-|
|```payee_nationality```|Receiver’s nationality|*String*|-|
|```payee_country_of_birth```|Receiver’s country of birth|*String*|-|


<details>
  <summary markdown="span">Sample curl request</summary>

```
curl -d "action=CREDIT2CARD&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&
channel_id=test&order_id=123456789&order_amount=1.03&order_currency=USD&
order_description=wine&card_number=4917111111111111&
payee_first_name=John&payee_last_name=Doe&payee_address=BigStreet&payee_country=US&payee_state=CA&payee_city=City&payee_zip=123456&payee_email=doe@example.com&
payee_phone=199999999&payer_first_name=John&payer_last_name=Doe&
payer_address=BigStreet&payer_country=US&payer_state=CA&payer_city=City&
payer_zip=123456&payer_email=doe@example.com&payer_phone=199999999&
payer_ip=123.123.123.123&parameters[payer_account_number]= 4111111111111111&
parameters[payer_identity_type]=document type&
parameters[payer_identity_id]=03090807656&parameters[payer_identity_country]=KZ&
parameters[payer_identity_exp_date]=December 2030&
parameters[payer_nationality]=happy nation&parameters[payer_country_of_birth]=KZ&
parameters[payee_identity_type]=document type&
parameters[payee_identity_id]=7573829201&parameters[payee_identity_country]=KZ&
parameters[payee_identity_exp_date]=April 2025&
parameters[payee_nationality]=happy nation&parameters[payee_country_of_birth]=KZ&
hash=2702ae0c4f99506dc29b5615ba9ee3c0" 
https://test.apiurl.com/post -k
```
</details>

**Additional parameters - Set 2 (PWD)**

**Parameter** |**Description** |**Values** |**Required field** |
| -- | -- | -- | :---: |
| ```card_exp_month``` | Expiration month for payee’s card | _String_<br/>_2 digits_| + |
| ```card_exp_year``` | Expiration year for payee’s card | _String_<br/>_4 digits_| + |

<details>
  <summary markdown="span">Sample curl request</summary>

```
curl -d "action=CREDIT2CARD&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&
channel_id=test&order_id=123456789&order_amount=1.03&order_currency=USD&
order_description=wine&card_number=4917111111111111&
payee_first_name=John&payee_last_name=Doe&payee_address=BigStreet&payee_country=US&payee_state=CA&payee_city=City&payee_zip=123456&payee_email=doe@example.com&
payee_phone=199999999&payer_first_name=John&payer_last_name=Doe&
payer_address=BigStreet&payer_country=US&payer_state=CA&payer_city=City&
payer_zip=123456&payer_email=doe@example.com&payer_phone=199999999&
payer_ip=123.123.123.123&parameters[card_exp_month]=11&
parameters[card_exp_year]=2030&
hash=2702ae0c4f99506dc29b5615ba9ee3c0" 
https://test.apiurl.com/post -k
```
</details>

### CARD2CARD request

**Additional parameters - Set 1 (PRC)**

|**Parameter** |**Description** |**Values** |**Required field** |
| -- | -- | -- | :---: |
| ```payer_identity_type``` |Identification document type:<br/>1 – passport;<br/>2 – driver’s license;<br/>3 – social security number;<br/>4 – Taxpayer Identification Number;<br/>5 – national identifier;<br/>6 – foreign passport;<br/>7 – military ID;<br/>8 – other type of document | _String_ | - |
| ```payer_identity_id``` | Identification document number | _String_ | - |
| ```payer_type``` | Possible values:<br/>0 – unknown;<br/>1 – on-us;<br/>2 – resident;<br/>3 – foreign | _String_ | - |

<details>
  <summary markdown="span">Sample curl request</summary>

```
curl -d "action=CARD2CARD&client_key=c2b8fb04-110f-11ea-bcd3-0242c0a85004&order_id=ORDER12345&order_amount=1000.99&order_currency=USD&
order_description=Product&card_number=4111111111111111&card_exp_month=01&
card_exp_year=2025&card_cvv2=000&payer_first_name=John&payer_last_name=Doe&
payer_address=BigStreet&payer_country=US&payer_state=CA&payer_city=City&
payer_zip=123456&payer_email=doe@example.com&payer_phone=199999999&
payer_ip=123.123.123.123& payee_card_number=4444111111112222&
payee_first_name=John&payee_last_name=Doe&
payee_address=BigStreet&payee_country=US&payee_state=CA&payee_city=City&
payee_zip=123456&payee_email=doe@example.com&payee_phone=199999999&
term_url_3ds=http://client.site.com/return.php&
parameters[payer_identity_type]=document&
parameters[payer_identity_id]=234556678603&parameters[payer_type]=0&
hash=2702ae0c4f99506dc29b5615ba9ee3c0" 
https://test.apiurl.com -k
```
</details>
