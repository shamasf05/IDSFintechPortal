USE IDSFintechPortal;

INSERT INTO Roles (Name)
VALUES
    ('CEO'),
    ('Manager'),
    ('Employee');

   NSERT INTO Products
(
    Name,
    Description,
    BusinessPurpose,
    LifecycleStatus,
    CurrentVersion,
    SupportedMarkets,
    Criticality,
    Technologies,
    Notes
)
VALUES

(
    'Stripe Payments',
    'Online payment processing platform for businesses.',
    'Process online payments, subscriptions, refunds and other payment transactions.',
    'Active',
    '2026',
    'Global',
    'High',
    'REST API, Webhooks, JavaScript, SDKs',
    'Reference product used for portal demonstration.'
),

(
    'Adyen Payments',
    'Global payment platform for online and in-person payments.',
    'Provide businesses with payment processing and financial transaction capabilities.',
    'Active',
    '2026',
    'Global',
    'Critical',
    'REST API, Webhooks, SDKs',
    'Reference product used for portal demonstration.'
),

(
    'PayPal Checkout',
    'Digital payment solution allowing customers to pay online using PayPal and other payment methods.',
    'Enable secure online checkout and digital payments.',
    'Active',
    '2026',
    'Global',
    'High',
    'REST API, JavaScript SDK, Webhooks',
    'Reference product used for portal demonstration.'
),

(
    'Plaid API',
    'Financial data connectivity platform that allows applications to connect with financial institutions.',
    'Enable secure access to financial account and transaction information.',
    'Active',
    '2026',
    'North America',
    'High',
    'REST API, OAuth, Webhooks',
    'Reference product used for portal demonstration.'
);


-- =========================================================
-- 2. CLIENTS
-- =========================================================

INSERT INTO Clients
(
    CompanyName,
    Country,
    ContactInformation,
    Status,
    Notes
)
VALUES

(
    'Shopify',
    'Canada',
    'https://www.shopify.com',
    'Active',
    'Reference client used for portal demonstration.'
),

(
    'Revolut',
    'United Kingdom',
    'https://www.revolut.com',
    'Active',
    'Reference client used for portal demonstration.'
),

(
    'HSBC',
    'United Kingdom',
    'https://www.hsbc.com',
    'Active',
    'Reference client used for portal demonstration.'
),

(
    'Bank of America',
    'United States',
    'https://www.bankofamerica.com',
    'Active',
    'Reference client used for portal demonstration.'
);


-- =========================================================
-- 3. DEPLOYMENTS
-- =========================================================
-- Product IDs:
-- 1 = Stripe Payments
-- 2 = Adyen Payments
-- 3 = PayPal Checkout
-- 4 = Plaid API
--
-- Client IDs:
-- 1 = Shopify
-- 2 = Revolut
-- 3 = HSBC
-- 4 = Bank of America
-- =========================================================

INSERT INTO Deployments
(
    ClientId,
    ProductId,
    ProductVersion,
    GoLiveDate,
    DeploymentStatus,
    SupportTier,
    ClientSpecificNotes
)
VALUES

(
    1,
    1,
    '2026',
    '2026-01-15',
    'Active',
    'Premium',
    'Demo deployment representing a production payment integration.'
),

(
    2,
    4,
    '2026',
    '2026-02-10',
    'Active',
    'Premium',
    'Demo deployment representing a financial data integration.'
),

(
    3,
    2,
    '2026',
    '2026-03-05',
    'Active',
    'Enterprise',
    'Demo deployment representing a payment processing integration.'
),

(
    4,
    3,
    '2026',
    '2026-04-20',
    'Active',
    'Enterprise',
    'Demo deployment representing an online checkout integration.'
);


-- =========================================================
-- 4. ENVIRONMENTS
-- =========================================================
-- Deployment IDs:
-- 1 = Shopify + Stripe
-- 2 = Revolut + Plaid
-- 3 = HSBC + Adyen
-- 4 = Bank of America + PayPal
-- =========================================================

INSERT INTO Environments
(
    DeploymentId,
    Name,
    EnvironmentType,
    Purpose,
    ServerName,
    OperatingSystem,
    ApplicationUrl,
    DatabaseInformation,
    MonitoringLink,
    AccessInstructions,
    Notes
)
VALUES

(
    1,
    'Production',
    'Production',
    'Live payment processing environment.',
    'prod-stripe-01',
    'Linux',
    'https://api.shopify.example/payments',
    'MySQL - Production Payment Database',
    'https://monitoring.example.com/stripe',
    'Restricted production access.',
    'Demo environment for portal testing.'
),

(
    2,
    'Production',
    'Production',
    'Live financial data connectivity environment.',
    'prod-plaid-01',
    'Linux',
    'https://api.revolut.example/plaid',
    'MySQL - Production Financial Database',
    'https://monitoring.example.com/plaid',
    'Restricted production access.',
    'Demo environment for portal testing.'
),

(
    3,
    'Staging',
    'Staging',
    'Pre-production payment processing validation.',
    'staging-adyen-01',
    'Linux',
    'https://staging.hsbc.example/payments',
    'MySQL - Staging Payment Database',
    'https://monitoring.example.com/adyen',
    'Staging credentials required.',
    'Demo staging environment for portal testing.'
),

(
    4,
    'Testing',
    'Testing',
    'Integration and checkout testing environment.',
    'test-paypal-01',
    'Linux',
    'https://test.bofa.example/checkout',
    'MySQL - Testing Checkout Database',
    'https://monitoring.example.com/paypal',
    'Testing access only.',
    'Demo testing environment for portal testing.'
);

INSERT INTO Modules
(
    ProductId,
    Name,
    Description,
    Status
)
VALUES

-- =====================================================
-- STRIPE PAYMENTS
-- ProductId = 1
-- =====================================================

(
    1,
    'Payment Processing',
    'Handles payment authorization, capture and transaction processing.',
    'Active'
),

(
    1,
    'Refund Management',
    'Handles customer refunds and payment reversals.',
    'Active'
),

(
    1,
    'Webhooks',
    'Receives and processes real-time payment and transaction events.',
    'Active'
),


-- =====================================================
-- ADYEN PAYMENTS
-- ProductId = 2
-- =====================================================

(
    2,
    'Payment Processing',
    'Processes online and in-person payment transactions.',
    'Active'
),

(
    2,
    'Risk Management',
    'Provides transaction risk assessment and fraud prevention capabilities.',
    'Active'
),

(
    2,
    'Transaction Reporting',
    'Provides transaction monitoring, reporting and reconciliation information.',
    'Active'
),


-- =====================================================
-- PAYPAL CHECKOUT
-- ProductId = 3
-- =====================================================

(
    3,
    'Checkout',
    'Provides the customer-facing online payment checkout experience.',
    'Active'
),

(
    3,
    'Payment Authorization',
    'Handles payment authorization and transaction confirmation.',
    'Active'
),

(
    3,
    'Refund Management',
    'Handles refunds and payment reversals for completed transactions.',
    'Active'
),


-- =====================================================
-- PLAID API
-- ProductId = 4
-- =====================================================

(
    4,
    'Account Linking',
    'Connects applications securely with supported financial accounts.',
    'Active'
),

(
    4,
    'Transaction Data',
    'Provides access to financial transaction information.',
    'Active'
),

(
    4,
    'Identity Verification',
    'Supports verification of customer identity and account information.',
    'Active'
);