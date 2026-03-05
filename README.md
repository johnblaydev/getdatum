# Get Datum - VTU Data Automation

A professional VTU (Virtual Top-Up) automation system built with HTML, CSS, and JavaScript. This platform allows users to purchase data bundles across major networks (MTN, Telecel, AirtelTigo) with automated processing via the MapTech API and secure payments through Paystack.

## 🚀 Features

- **Automated Data Purchase**: Direct integration with MapTech API for instant data delivery.
- **Secure Payments**: Integrated with Paystack for seamless GHS transactions.
- **User Management**: Authentication and user profiles powered by Supabase.
- **Tiered Pricing**: Different price points for Client, Silver, Gold, and Agent roles.
- **Bulk Purchase**: Support for sending data to multiple recipients at once.
- **Notifications**: Automated WhatsApp and Email notifications for transactions.
- **Admin Dashboard**: Comprehensive views for managing transactions and users.

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) (Auth & Database).
- **Payment Gateway**: [Paystack](https://paystack.com/).
- **Automation API**: [MapTech](https://encartastores.com/api).
- **Messaging**: [CallMeBot](https://www.callmebot.com/) (WhatsApp) & [EmailJS](https://www.emailjs.com/).

## 📋 Project Structure

```text
get-datum/
├── .env                # Environment variables (Sensitive)
├── .env.example        # Template for environment variables
├── .gitignore          # Git exclusion rules
├── config.js           # Client-side configuration (Sensitive)
├── index.html          # Main application structure
├── script.js           # Application logic and UI rendering
└── styles.css          # Styling and layout
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- A web browser.
- Accounts and API keys for:
    - Supabase (URL and Anon/Public Key)
    - Paystack (Public Key)
    - MapTech (API Key)
    - (Optional) EmailJS & CallMeBot

### 2. Configuration
The project uses a `config.js` file for browser-side configuration.

1.  Copy `.env.example` to a new file named `config.js`.
2.  Fill in your API keys in the `window.CONFIG` object:

```javascript
window.CONFIG = {
    SUPABASE_URL: 'your_supabase_url',
    SUPABASE_ANON_KEY: 'your_supabase_anon_key',
    PAYSTACK_PUBLIC_KEY: 'your_paystack_public_key',
    MAPTECH_API_KEY: 'your_maptech_api_key',
    ADMIN_WHATSAPP_NUMBER: 'your_whatsapp_number',
    // ... other keys
};
```

### 3. Usage
Simply open `index.html` in your web browser.

> [!IMPORTANT]
> **Security Note**: Never commit `config.js` or `.env` to a public repository. These files are already included in the `.gitignore`.

## 🔒 Security

- **Environment Isolation**: Sensitive keys are kept in `config.js` and `.env` files.
- **Git Protection**: A `.gitignore` file is provided to prevent accidental leaks of configuration data.
- **Auth**: User authentication is handled securely via Supabase Auth.

## 📄 License

This project is for private use by Get Datum. All rights reserved.
