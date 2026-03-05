// --- Configuration (from config.js) ---
const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    PAYSTACK_PUBLIC_KEY,
    MAPTECH_API_KEY,
    ADMIN_WHATSAPP_NUMBER,
    CALLMEBOT_API_KEY,
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY
} = window.CONFIG || {};

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Global Sign Out (Moved to top for reliability) ---

// --- State Management ---
let state = {
    user: null, // User profile data
    session: null, // Supabase session
    view: 'landing',
    message: null,
    loading: true, // Start with loading to check session
    purchaseForm: { planId: '', phoneNumber: '', network: 'MTN', isBulk: false, guestEmail: '' },
    authForm: { username: '', password: '', email: '', loginRole: 'USER', rememberMe: false },
    smsForm: { message: '', manualNumbers: '', target: 'all' },
    showMorePlans: false,
    showActiveUsersModal: false,
    confirmedOrders: [], // Track which orders have been confirmed via WhatsApp
    data: {
        transactions: [],
        allTransactions: [] // For admin
    }
};

const INITIAL_PLANS = [
    {
        "id": "1",
        "network": "MTN",
        "name": "MTN 1GB",
        "price_client": 4.5,
        "price_silver": 4.3,
        "price_gold": 4.1,
        "price_agent": 3.8,
        "validity": "Non-expiry"
    },
    {
        "id": "2",
        "network": "MTN",
        "name": "MTN 2GB",
        "price_client": 8.5,
        "price_silver": 8.1,
        "price_gold": 7.7,
        "price_agent": 7.2,
        "validity": "Non-expiry"
    },
    {
        "id": "3",
        "network": "MTN",
        "name": "MTN 3GB",
        "price_client": 12.5,
        "price_silver": 11.9,
        "price_gold": 11.3,
        "price_agent": 10.6,
        "validity": "Non-expiry"
    },
    {
        "id": "4",
        "network": "MTN",
        "name": "MTN 4GB",
        "price_client": 20,
        "price_silver": 19,
        "price_gold": 18,
        "price_agent": 17,
        "validity": "Non-expiry"
    },
    {
        "id": "5",
        "network": "MTN",
        "name": "MTN 5GB",
        "price_client": 23.5,
        "price_silver": 22.3,
        "price_gold": 21.2,
        "price_agent": 20,
        "validity": "Non-expiry"
    },
    {
        "id": "6",
        "network": "MTN",
        "name": "MTN 6GB",
        "price_client": 28.5,
        "price_silver": 27.1,
        "price_gold": 25.7,
        "price_agent": 24.2,
        "validity": "Non-expiry"
    },
    {
        "id": "7",
        "network": "MTN",
        "name": "MTN 7GB",
        "price_client": 32,
        "price_silver": 30.4,
        "price_gold": 28.8,
        "price_agent": 27.2,
        "validity": "Non-expiry"
    },
    {
        "id": "8",
        "network": "MTN",
        "name": "MTN 8GB",
        "price_client": 39,
        "price_silver": 37.1,
        "price_gold": 35.1,
        "price_agent": 33.2,
        "validity": "Non-expiry"
    },
    {
        "id": "9",
        "network": "MTN",
        "name": "MTN 10GB",
        "price_client": 47,
        "price_silver": 44.7,
        "price_gold": 42.3,
        "price_agent": 39.9,
        "validity": "Non-expiry"
    },
    {
        "id": "10",
        "network": "MTN",
        "name": "MTN 12GB",
        "price_client": 59,
        "price_silver": 56.1,
        "price_gold": 53.1,
        "price_agent": 50.2,
        "validity": "Non-expiry"
    },
    {
        "id": "11",
        "network": "MTN",
        "name": "MTN 15GB",
        "price_client": 79,
        "price_silver": 75.1,
        "price_gold": 71.1,
        "price_agent": 67.1,
        "validity": "Non-expiry"
    },
    {
        "id": "12",
        "network": "MTN",
        "name": "MTN 20GB",
        "price_client": 99,
        "price_silver": 94.1,
        "price_gold": 89.1,
        "price_agent": 84.1,
        "validity": "Non-expiry"
    },
    {
        "id": "13",
        "network": "MTN",
        "name": "MTN 25GB",
        "price_client": 117,
        "price_silver": 111.2,
        "price_gold": 105.3,
        "price_agent": 99.5,
        "validity": "Non-expiry"
    },
    {
        "id": "14",
        "network": "MTN",
        "name": "MTN 30GB",
        "price_client": 154,
        "price_silver": 146.3,
        "price_gold": 138.6,
        "price_agent": 130.9,
        "validity": "Non-expiry"
    },
    {
        "id": "15",
        "network": "MTN",
        "name": "MTN 40GB",
        "price_client": 195,
        "price_silver": 185.3,
        "price_gold": 175.5,
        "price_agent": 165.8,
        "validity": "Non-expiry"
    },
    {
        "id": "16",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 1GB",
        "price_client": 6,
        "price_silver": 5.7,
        "price_gold": 5.4,
        "price_agent": 5.1,
        "validity": "Non-expiry"
    },
    {
        "id": "17",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 2GB",
        "price_client": 11,
        "price_silver": 10.5,
        "price_gold": 9.9,
        "price_agent": 9.4,
        "validity": "Non-expiry"
    },
    {
        "id": "18",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 3GB",
        "price_client": 15,
        "price_silver": 14.3,
        "price_gold": 13.5,
        "price_agent": 12.8,
        "validity": "Non-expiry"
    },
    {
        "id": "19",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 4GB",
        "price_client": 20,
        "price_silver": 19,
        "price_gold": 18,
        "price_agent": 17,
        "validity": "Non-expiry"
    },
    {
        "id": "20",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 5GB",
        "price_client": 24,
        "price_silver": 22.8,
        "price_gold": 21.6,
        "price_agent": 20.4,
        "validity": "Non-expiry"
    },
    {
        "id": "21",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 6GB",
        "price_client": 28,
        "price_silver": 26.6,
        "price_gold": 25.2,
        "price_agent": 23.8,
        "validity": "Non-expiry"
    },
    {
        "id": "22",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 7GB",
        "price_client": 32,
        "price_silver": 30.4,
        "price_gold": 28.8,
        "price_agent": 27.2,
        "validity": "Non-expiry"
    },
    {
        "id": "23",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 8GB",
        "price_client": 35,
        "price_silver": 33.3,
        "price_gold": 31.5,
        "price_agent": 29.8,
        "validity": "Non-expiry"
    },
    {
        "id": "24",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 10GB",
        "price_client": 43,
        "price_silver": 40.9,
        "price_gold": 38.7,
        "price_agent": 36.6,
        "validity": "Non-expiry"
    },
    {
        "id": "25",
        "network": "AIRTELTIGO",
        "name": "AIRTELTIGO 15GB",
        "price_client": 58,
        "price_silver": 55.1,
        "price_gold": 52.2,
        "price_agent": 49.3,
        "validity": "Non-expiry"
    },
    {
        "id": "26",
        "network": "TELECEL",
        "name": "TELECEL 5GB",
        "price_client": 25,
        "price_silver": 23.8,
        "price_gold": 22.5,
        "price_agent": 21.3,
        "validity": "Non-expiry"
    },
    {
        "id": "27",
        "network": "TELECEL",
        "name": "TELECEL 10GB",
        "price_client": 42,
        "price_silver": 39.9,
        "price_gold": 37.8,
        "price_agent": 35.7,
        "validity": "Non-expiry"
    },
    {
        "id": "28",
        "network": "TELECEL",
        "name": "TELECEL 15GB",
        "price_client": 60,
        "price_silver": 57,
        "price_gold": 54,
        "price_agent": 51,
        "validity": "Non-expiry"
    },
    {
        "id": "29",
        "network": "TELECEL",
        "name": "TELECEL 20GB",
        "price_client": 80,
        "price_silver": 76,
        "price_gold": 72,
        "price_agent": 68,
        "validity": "Non-expiry"
    },
    {
        "id": "30",
        "network": "TELECEL",
        "name": "TELECEL 25GB",
        "price_client": 95,
        "price_silver": 90.3,
        "price_gold": 85.5,
        "price_agent": 80.8,
        "validity": "Non-expiry"
    },
    {
        "id": "31",
        "network": "TELECEL",
        "name": "TELECEL 30GB",
        "price_client": 115,
        "price_silver": 109.3,
        "price_gold": 103.5,
        "price_agent": 97.8,
        "validity": "Non-expiry"
    },
    {
        "id": "32",
        "network": "TELECEL",
        "name": "TELECEL 40GB",
        "price_client": 150,
        "price_silver": 142.5,
        "price_gold": 135,
        "price_agent": 127.5,
        "validity": "Non-expiry"
    },
    {
        "id": "33",
        "network": "TELECEL",
        "name": "TELECEL 50GB",
        "price_client": 185,
        "price_silver": 175.8,
        "price_gold": 166.5,
        "price_agent": 157.3,
        "validity": "Non-expiry"
    }
];

const NETWORKS = ['MTN', 'TELECEL', 'AIRTELTIGO'];

// --- Storage & Sync Helpers ---
const fetchUserProfile = async (userId) => {
    const { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
};

const getStoredTransactions = async () => {
    if (!state.session) return [];
    const { data, error } = await sb
        .from('transactions')
        .select('*')
        .eq('user_id', state.session.user.id)
        .order('created_at', { ascending: false });
    return error ? [] : data;
};

// For Admin: Get all transactions
const getAllTransactions = async () => {
    const { data, error } = await sb
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
    return error ? [] : data;
};

// --- MapTech API Helpers ---
async function purchaseDataFromAPI(network, capacity, recipient) {
    const networkKey = MAPTECH_NETWORK_KEYS[network];
    if (!networkKey) {
        console.error(`Invalid network: ${network}`);
        return { success: false, message: `Invalid network: ${network}` };
    }

    try {
        const response = await fetch(`${MAPTECH_BASE_URL}/purchase`, {
            method: 'POST',
            headers: {
                'X-API-Key': MAPTECH_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                networkKey: networkKey,
                recipient: recipient,
                capacity: capacity
            })
        });

        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.message || 'API Error' };
        }
    } catch (error) {
        console.error('MapTech API Error:', error);
        return { success: false, message: 'Network or Connection Error' };
    }
}

async function notifyAdminOnWhatsapp(details) {
    const { customer, plan, recipients, amount, status } = details;
    const cleanStatus = status || 'Success';
    const message = `New Order Received
---------------------
Customer: ${customer}
Plan: ${plan}
Amount: GHS ${amount}
Recipients: ${recipients.join(', ')}
Delivery Status: ${cleanStatus}
---------------------
Get Datum Automation`;

    // 1. Try CallMeBot (Background Bot)
    if (CALLMEBOT_API_KEY) {
        try {
            const url = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_WHATSAPP_NUMBER.replace('+', '')}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_API_KEY}`;
            await fetch(url, { mode: 'no-cors' });
            console.log('WhatsApp Bot Notification sent.');
            return;
        } catch (e) {
            console.error('CallMeBot Error:', e);
        }
    }

    // 2. Fallback: Direct WhatsApp Link (Requires manual click if bot fails)
    console.log('WhatsApp Bot key missing. Use this link if needed:');
    console.log(`https://wa.me/${ADMIN_WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`);
}

async function sendAdminEmail(details) {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        console.log('EmailJS keys missing. Skipping email notification.');
        return;
    }

    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        const templateParams = {
            customer_name: details.customer,
            plan_name: details.plan,
            amount: details.amount,
            recipients: details.recipients.join(', '),
            status: details.status,
            to_email: 'getdatum.org@gmail.com'
        };

        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log('Admin Email sent successfully!', response.status, response.text);
    } catch (error) {
        console.error('EmailJS Error:', error);
    }
}

function generateAdminWhatsAppLink(phone, planName, amount, status) {
    const cleanStatus = status || 'Success';
    const message = `Manual Order Notification
---------------------
Plan: ${planName}
Amount: GHS ${amount}
Recipient: ${phone}
Status: ${cleanStatus}
---------------------`;
    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
}

function generateCustomerConfirmationLink(description, status) {
    const message = `Hello Admin, I have successfully paid for my order:
---------------------
${description}
Status: ${status || 'Paid'}
---------------------
Please confirm and process. Thank you!`;
    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
}

function handleConfirmOrder(txId, description, status) {
    const url = generateCustomerConfirmationLink(description, status);
    window.open(url, '_blank');

    // Mark as confirmed in local state
    if (!state.confirmedOrders.includes(txId)) {
        setState({ confirmedOrders: [...state.confirmedOrders, txId] });
    }
}
window.handleConfirmOrder = handleConfirmOrder;

async function initSession() {
    // Load remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        state.authForm.email = rememberedEmail;
        state.authForm.rememberMe = true;
    }

    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        const profile = await fetchUserProfile(session.user.id);
        const txs = await getStoredTransactions();
        setState({
            session,
            user: profile,
            data: { ...state.data, transactions: txs },
            view: state.view === 'landing' || state.view === 'login' || state.view === 'register' ? 'dashboard' : state.view,
            loading: false
        });
    } else {
        setState({ loading: false });
    }

    // Listen for auth changes
    sb.auth.onAuthStateChange(async (event, session) => {
        if (session) {
            const profile = await fetchUserProfile(session.user.id);
            const txs = await getStoredTransactions();
            const newState = { session, user: profile, data: { ...state.data, transactions: txs } };
            if (event === 'SIGNED_IN' && (state.view === 'landing' || state.view === 'login' || state.view === 'register')) {
                newState.view = 'dashboard';
            }
            setState(newState);
        } else {
            setState({ session: null, user: null, view: 'landing', data: { transactions: [], allTransactions: [] } });
        }
    });

    // Final render to insure UI is ready
    render();

    // Hide splash screen after initialization
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 500);
        }, 400); // 400ms buffer for smoother transition
    }
}

// --- Core Logic ---
function setState(newState) {
    state = { ...state, ...newState };
    render();
}

function showMessage(text, type = 'success') {
    setState({ message: { text, type } });
    setTimeout(() => setState({ message: null }), 3000);
}

function getPrice(plan) {
    if (!state.user) return plan.price_client;
    switch (state.user.role) {
        case 'SILVER': return plan.price_silver;
        case 'GOLD': return plan.price_gold;
        case 'AGENT': return plan.price_agent;
        default: return plan.price_client;
    }
}

// --- Actions ---
async function handleLogin(e) {
    e.preventDefault();
    setState({ loading: true });

    const { data, error } = await sb.auth.signInWithPassword({
        email: state.authForm.email,
        password: state.authForm.password,
    });

    if (error) {
        showMessage(error.message, 'error');
        setState({ loading: false });
        return;
    }

    if (state.authForm.rememberMe) {
        localStorage.setItem('rememberedEmail', state.authForm.email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    const profile = await fetchUserProfile(data.user.id);
    setState({ session: data.session, user: profile, view: 'dashboard', loading: false });
    showMessage(`Welcome back, ${profile.username}!`);
}


async function handleRegister(e) {
    e.preventDefault();
    setState({ loading: true });

    const { data, error } = await sb.auth.signUp({
        email: state.authForm.email,
        password: state.authForm.password,
        options: {
            data: {
                username: state.authForm.username,
            }
        }
    });

    if (error) {
        showMessage(error.message, 'error');
        setState({ loading: false });
        return;
    }

    showMessage('Registered! Please check email or login.');
    setState({ view: 'login', loading: false });
}

async function payWithPaystack(email, amount, metadata, onCancel) {
    return new Promise((resolve) => {
        if (PAYSTACK_PUBLIC_KEY === 'YOUR_PAYSTACK_PUBLIC_KEY') {
            showMessage('Please configure Paystack Public Key first', 'error');
            resolve(null);
            return;
        }

        const handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: Math.round(amount * 100), // convert to pesewas/cents
            currency: 'GHS',
            metadata: metadata,
            callback: (response) => {
                resolve(response);
            },
            onClose: () => {
                if (onCancel) onCancel();
                resolve(null);
            }
        });
        handler.openIframe();
    });
}

async function handlePurchase(e) {
    e.preventDefault();
    const isGuest = !state.session;

    const usePaystack = e.submitter && e.submitter.getAttribute('data-method') === 'paystack';
    setState({ loading: true });
    const plan = INITIAL_PLANS.find(p => p.id === state.purchaseForm.planId);
    if (!plan) {
        showMessage('Please select a plan', 'error');
        setState({ loading: false });
        return;
    }

    const phoneNumbers = state.purchaseForm.isBulk
        ? [...new Set(state.purchaseForm.phoneNumber.split(/[\s,]+/).filter(num => num.trim() !== ''))]
        : [state.purchaseForm.phoneNumber.trim()];

    if (phoneNumbers.length === 0) {
        showMessage('Please enter at least one phone number', 'error');
        setState({ loading: false });
        return;
    }

    const pricePerUnit = getPrice(plan);
    const totalCost = pricePerUnit * phoneNumbers.length;

    let paymentComplete = false;
    const userEmail = isGuest ? state.purchaseForm.guestEmail : state.session.user.email;

    if (isGuest) {
        if (!userEmail || !userEmail.includes('@')) {
            showMessage('Please enter a valid guest email', 'error');
            setState({ loading: false });
            return;
        }
    }

    if (isGuest || usePaystack || state.user.wallet_balance < totalCost) {
        if (!isGuest && state.user.wallet_balance < totalCost && !usePaystack) {
            const confirmed = confirm(`Insufficient wallet balance. Pay GH₵${totalCost.toLocaleString()} with Paystack?`);
            if (!confirmed) {
                setState({ loading: false });
                return;
            }
        }

        const payment = await payWithPaystack(
            userEmail,
            totalCost,
            { plan_id: plan.id, type: 'PURCHASE', phone_numbers: phoneNumbers.join(','), is_guest: isGuest },
            () => setState({ loading: false })
        );

        if (!payment || !payment.reference) {
            setState({ loading: false });
            return;
        }

        paymentComplete = true;
        showMessage('Payment Successful!', 'success');
    } else {
        // Use wallet balance (Regular Users Only)
        const { error: profileError } = await sb
            .from('profiles')
            .update({ wallet_balance: state.user.wallet_balance - totalCost })
            .eq('id', state.user.id);

        if (profileError) {
            showMessage('Error updating balance', 'error');
            setState({ loading: false });
            return;
        }
        paymentComplete = true;
    }

    if (paymentComplete) {
        // Automation: Purchase data via MapTech API for each phone number
        const apiResults = [];
        const capacityInGB = parseFloat(plan.name.match(/(\d+)GB/)?.[1] || "1");

        for (const phone of phoneNumbers) {
            const apiResult = await purchaseDataFromAPI(plan.network, capacityInGB, phone);
            apiResults.push({ phone, ...apiResult });
        }

        const allSuccessful = apiResults.every(r => r.success);
        const descriptionSuffix = apiResults.map(r => `${r.phone}: ${r.success ? 'Success' : 'Failed (' + r.message + ')'}`).join(', ');

        const { error: txError } = await sb
            .from('transactions')
            .insert([{
                user_id: isGuest ? null : state.user.id,
                amount: -totalCost,
                type: 'PURCHASE',
                description: `Data: ${plan.network} ${plan.name} to ${phoneNumbers.join(', ')} ${isGuest ? '(Guest)' : ''} | Status: ${descriptionSuffix}`,
                status: allSuccessful ? 'COMPLETED' : 'PARTIAL_FAILURE'
            }]);

        if (txError) {
            showMessage('Error saving transactions', 'error');
            setState({ loading: false });
            return;
        }

        // 3. Refresh State
        if (!isGuest) {
            const profile = await fetchUserProfile(state.user.id);
            const txs = await getStoredTransactions();
            setState({ user: profile, data: { ...state.data, transactions: txs }, loading: false, view: 'dashboard' });
        } else {
            setState({ loading: false, view: 'landing', purchaseForm: { ...state.purchaseForm, phoneNumber: '', guestEmail: '' } });
        }

        if (allSuccessful) {
            showMessage('Order processed! Your data has been sent.', 'success');
        } else {
            showMessage('Order processed with some errors. Check transaction log.', 'warning');
        }

        // WhatsApp Notification to Admin
        notifyAdminOnWhatsapp({
            customer: isGuest ? `Guest (${userEmail})` : state.user.username,
            plan: `${plan.network} ${plan.name}`,
            recipients: phoneNumbers,
            amount: totalCost,
            status: allSuccessful ? 'Success' : 'Partial/Failed'
        });

        // Email Notification to Admin
        sendAdminEmail({
            customer: isGuest ? `Guest (${userEmail})` : state.user.username,
            plan: `${plan.network} ${plan.name}`,
            recipients: phoneNumbers,
            amount: totalCost,
            status: allSuccessful ? 'Success' : 'Partial/Failed'
        });
    }
}

async function handleTopup() {
    const amt = prompt("Enter amount to top up (GH₵):");
    if (!amt || isNaN(amt)) return;
    const amount = parseFloat(amt);

    setState({ loading: true });

    const payment = await payWithPaystack(
        state.session.user.email,
        amount,
        { type: 'TOPUP' },
        () => setState({ loading: false })
    );

    if (!payment || !payment.reference) {
        setState({ loading: false });
        return;
    }

    const { error: profileError } = await sb
        .from('profiles')
        .update({ wallet_balance: state.user.wallet_balance + amount })
        .eq('id', state.user.id);

    if (profileError) {
        showMessage('Error updating wallet', 'error');
        setState({ loading: false });
        return;
    }

    const { error: txError } = await sb.from('transactions').insert({
        user_id: state.user.id,
        type: 'TOPUP',
        amount,
        description: 'Wallet Top-up via Paystack'
    });

    if (txError) {
        console.error('Error recording top-up:', txError);
    }

    const profile = await fetchUserProfile(state.user.id);
    const txs = await getStoredTransactions();
    setState({ user: profile, data: { ...state.data, transactions: txs }, loading: false });
    showMessage('Wallet topped up!');
}

function sendConfirmationSMS(phone, planName) {
    const message = `Hello, your ${planName} data bundle has been successfully processed. Thank you for choosing us!`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const bodySymbol = isIOS ? '&' : '?';
    const smsUrl = `sms:${phone}${bodySymbol}body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
}

// --- UI Components ---
async function handleSendSMS(e) {
    e.preventDefault();
    if (!state.smsForm.message.trim()) {
        showMessage('Please enter a message', 'error');
        return;
    }

    setState({ loading: true });

    let recipients = [];
    if (state.smsForm.target === 'all') {
        const txs = state.data.allTransactions || await getAllTransactions();
        txs.forEach(tx => {
            const match = tx.description.match(/to\s+(\d+)/);
            if (match && match[1]) {
                recipients.push(match[1]);
            }
        });
        recipients = [...new Set(recipients)];
    } else {
        recipients = [...new Set(state.smsForm.manualNumbers.split(/[\s,]+/).filter(num => num.trim() !== ''))];
    }

    if (recipients.length === 0) {
        showMessage('No recipients found', 'error');
        setState({ loading: false });
        return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const separator = isIOS ? ',' : ',';
    const bodySymbol = isIOS ? '&' : '?';
    const smsUrl = `sms:${recipients.join(separator)}${bodySymbol}body=${encodeURIComponent(state.smsForm.message)}`;

    try {
        window.location.href = smsUrl;
        showMessage(`Opening SMS app for ${recipients.length} recipients...`);
        setState({
            smsForm: { ...state.smsForm, message: '', manualNumbers: '' },
            loading: false
        });
    } catch (err) {
        console.error('SMS Redirect Error:', err);
        showMessage('Could not open SMS app', 'error');
        setState({ loading: false });
    }
}

function render() {
    const app = document.getElementById('app');
    const transactions = (state.data.transactions || []);
    const isGuest = !state.session;

    let content = '';

    if (state.view === 'landing' && !state.user) {
        content = `
            <div class="max-w-md mx-auto px-6 pt-20 flex flex-col items-center text-center animate-slide-up">
                <div class="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 mb-8">
                    <i data-lucide="zap" class="text-white w-10 h-10"></i>
                </div>
                <h1 class="text-4xl font-bold tracking-tight mb-4">Get Datum</h1>
                <p class="text-slate-500 mb-12 leading-relaxed">Fast, reliable data top-ups. Purchase instantly as a guest or join for discounts.</p>
                <div class="w-full space-y-4">
                    <button onclick="setState({view: 'buy-data'})" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                        <i data-lucide="smartphone" class="w-5 h-5"></i> Buy Data Now
                    </button>
                    <div class="grid grid-cols-2 gap-4">
                        <button onclick="setState({view: 'register'})" class="py-4 bg-white text-indigo-600 border border-indigo-100 rounded-2xl font-semibold">Register</button>
                        <button onclick="setState({view: 'login'})" class="py-4 bg-white text-indigo-600 border border-indigo-100 rounded-2xl font-semibold">Sign In</button>
                    </div>
                </div>

                <div class="w-full mt-16 space-y-6 text-left">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Why Sign Up?</h3>
                    <div class="grid grid-cols-1 gap-4">
                        <div class="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex items-start gap-4">
                            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                <i data-lucide="tag" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-slate-800">Exclusive Discounts</h4>
                                <p class="text-[10px] text-slate-500 mt-1">Save more on every data purchase with our silver and gold member rates.</p>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex items-start gap-4">
                            <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                                <i data-lucide="heart-handshake" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-slate-800">24/7 Support Center</h4>
                                <p class="text-[10px] text-slate-500 mt-1">Get instant help from our team directly through your dashboard chat.</p>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex items-start gap-4">
                            <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                                <i data-lucide="history" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-slate-800">Track Your Orders</h4>
                                <p class="text-[10px] text-slate-500 mt-1">Keep a digital record of all your transactions and data usage history.</p>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex items-start gap-4">
                            <div class="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                                <i data-lucide="wallet" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-slate-800">Easy Wallet Top-ups</h4>
                                <p class="text-[10px] text-slate-500 mt-1">Fund your wallet once and make instant purchases without entering bank details every time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (state.view === 'login' || state.view === 'register') {
        content = `
            <div class="max-w-md mx-auto px-6 pt-12 animate-slide-up">
                <button onclick="setState({view: 'landing'})" class="mb-8 text-slate-400 flex items-center gap-2">
                    <i data-lucide="chevron-left"></i> <span class="font-medium">Back</span>
                </button>
                <h2 class="text-3xl font-bold mb-2">${state.view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                ${state.view === 'login' ? `
                    <div class="flex p-1 bg-slate-100 rounded-xl mt-6">
                        <button onclick="state.authForm.loginRole = 'USER'; render();" class="flex-1 py-2 rounded-lg text-sm font-bold transition ${state.authForm.loginRole === 'USER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">Sign in as User</button>
                        <button onclick="state.authForm.loginRole = 'ADMIN'; render();" class="flex-1 py-2 rounded-lg text-sm font-bold transition ${state.authForm.loginRole === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">Sign in as Admin</button>
                    </div>
                ` : ''}
                <form id="loginForm" onsubmit="${state.view === 'login' ? 'handleLogin(event)' : 'handleRegister(event)'}" class="space-y-4 mt-8">
                    <input type="${state.view === 'login' ? 'email' : 'text'}" 
                           name="${state.view === 'login' ? 'email' : 'username'}"
                           id="${state.view === 'login' ? 'loginEmail' : 'registerUsername'}"
                           placeholder="${state.view === 'login' ? 'Email' : 'Username'}" 
                           value="${state.view === 'login' ? (state.authForm.email || '') : (state.authForm.username || '')}"
                           required 
                           class="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none" 
                           oninput="state.authForm.${state.view === 'login' ? 'email' : 'username'} = this.value">
                    
                    ${state.view === 'register' ? '<input type="email" name="email" id="registerEmail" placeholder="Email" required class="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none" oninput="state.authForm.email = this.value">' : ''}
                    
                    <input type="password" 
                           name="password"
                           id="${state.view === 'login' ? 'loginPassword' : 'registerPassword'}"
                           placeholder="Password" 
                           required 
                           class="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none" 
                           oninput="state.authForm.password = this.value">
                    
                    ${state.view === 'login' ? `
                        <div class="flex items-center justify-between px-2">
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" 
                                       class="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                                       ${state.authForm.rememberMe ? 'checked' : ''} 
                                       onchange="state.authForm.rememberMe = this.checked">
                                <span class="text-sm text-slate-500 group-hover:text-slate-700 transition-colors font-medium">Remember me</span>
                            </label>
                        </div>
                    ` : ''}

                    <button type="submit" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold shadow-xl shadow-indigo-100 mt-4">
                        ${state.loading ? '...' : (state.view === 'login' ? `Sign In as ${state.authForm.loginRole === 'ADMIN' ? 'Admin' : 'User'}` : 'Register')}
                    </button>
                </form>
                
                <p class="mt-8 text-center text-sm text-slate-500">
                    ${state.view === 'login' ? "Don't have an account?" : "Already have an account?"} 
                    <button onclick="setState({view: '${state.view === 'login' ? 'register' : 'login'}'})" class="text-indigo-600 font-bold ml-1">${state.view === 'login' ? 'Register' : 'Sign In'}</button>
                </p>
            </div>
        `;
    } else if (state.user && state.view === 'dashboard') {
        if (state.user.role === 'ADMIN') {
            // Re-fetch admin data if needed
            if (!state.data.allTransactions || state.data.allTransactions.length === 0) {
                getAllTransactions().then(txs => {
                    if (txs.length !== state.data.allTransactions?.length) {
                        setState({ data: { ...state.data, allTransactions: txs } });
                    }
                });
            }
            content = `
                <div class="max-w-2xl mx-auto px-6 pt-8 animate-slide-up space-y-8">
                    <div class="flex items-center justify-between">
                        <div><h3 class="text-slate-400 text-sm">System Admin,</h3><h2 class="text-2xl font-bold">${state.user.username}</h2></div>
                        <div class="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold">ADMIN PANEL</div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4"><i data-lucide="trending-up" class="w-5 h-5"></i></div>
                            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Sales</h3>
                            <p class="text-2xl font-bold">GH₵${(state.data.allTransactions || []).filter(t => t.type === 'PURCHASE').reduce((acc, t) => acc + Math.abs(t.amount), 0).toLocaleString()}</p>
                        </div>
                        <div onclick="setState({showActiveUsersModal: true})" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><i data-lucide="users" class="w-5 h-5"></i></div>
                            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Users</h3>
                            <p class="text-2xl font-bold">
                                ${(() => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    const activeTx = (state.data.allTransactions || []).filter(t => t.type === 'PURCHASE' && new Date(t.created_at) > thirtyDaysAgo);
                    const uniqueUsers = new Set(activeTx.map(t => {
                        // Try to find phone number in description "Data: ... to 0549189470"
                        const match = t.description.match(/to\s+(\d+)/);
                        return match ? match[1] : (t.user_id || t.id);
                    }));
                    return uniqueUsers.size.toLocaleString();
                })()}
                            </p>
                        </div>
                    </div>

                    <div class="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200">
                        <h3 class="text-sm font-medium opacity-80 mb-4">Network Status</h3>
                        <div class="space-y-4">
                            ${NETWORKS.map(nw => `
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-bold">${nw}</span>
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <span class="text-[10px] font-bold opacity-80 uppercase">Active</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <h3 class="font-bold mb-4">Recent Data Purchases</h3>
                        <div class="bg-white rounded-[32px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                            ${(() => {
                    const purchases = (state.data.allTransactions || [])
                        .filter(t => t.type === 'PURCHASE')
                        .slice(0, 10);

                    if (purchases.length === 0) {
                        return `<div class="p-8 text-center text-slate-400 text-sm italic">No recent purchases found</div>`;
                    }

                    return purchases.map(tx => {
                        // Extract phone: "Data: MTN 1GB to 0549189470"
                        const phoneMatch = tx.description.match(/to\s+(\d+)/);
                        const planMatch = tx.description.match(/Data:\s+(.*?)\s+to/);
                        const phone = phoneMatch ? phoneMatch[1] : '';
                        const planName = planMatch ? planMatch[1] : 'Data Bundle';

                        return `
                                        <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                    ${phone.slice(-2)}
                                                </div>
                                                <div>
                                                    <h4 class="text-sm font-bold">${phone || 'Unknown'}</h4>
                                                    <p class="text-[10px] text-slate-400">${planName} • ${new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <div class="flex gap-2">
                                                <button onclick="sendConfirmationSMS('${phone}', '${planName}')" class="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1">
                                                    <i data-lucide="check-circle" class="w-3 h-3"></i> SMS
                                                </button>
                                                <a href="${generateAdminWhatsAppLink(phone, planName, Math.abs(tx.amount), tx.status || 'Success')}" target="_blank" class="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                                    <i data-lucide="message-circle" class="w-3 h-3"></i> WhatsApp
                                                </a>
                                            </div>
                                        </div>
                                    `;
                    }).join('');
                })()}
                        </div>
                    </div>
                </div>
            `;
        } else {
            content = `
                <div class="max-w-2xl mx-auto px-6 pt-8 animate-slide-up space-y-8">
                    <div class="flex items-center justify-between">
                        <div><h3 class="text-slate-400 text-sm">Good day,</h3><h2 class="text-2xl font-bold">${state.user.username}</h2></div>
                        <div class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">${state.user.role}</div>
                    </div>
                    <div class="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                        <div class="relative z-10">
                            <div class="flex items-center gap-2 opacity-80 mb-2"><i data-lucide="wallet" class="w-4 h-4"></i><span class="text-sm font-medium uppercase tracking-widest">Wallet Balance</span></div>
                            <h1 class="text-4xl font-bold mb-8">GH₵${state.user.wallet_balance.toLocaleString()}</h1>
                            <div class="flex gap-4">
                                <button onclick="handleTopup()" class="flex-1 bg-white/20 backdrop-blur-md py-3 rounded-2xl font-bold">Top Up</button>
                                <button onclick="setState({view: 'buy-data'})" class="flex-1 bg-white text-indigo-600 py-3 rounded-2xl font-bold">Buy Data</button>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Support Section -->
                    <div class="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <i data-lucide="message-circle" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-slate-800">Support Center</h3>
                                <p class="text-[10px] text-slate-500">Need help? Chat with us instantly.</p>
                            </div>
                        </div>
                        <a href="https://wa.me/${ADMIN_WHATSAPP_NUMBER.replace('+', '')}?text=Hello%2C%20I%20need%20help%20with%20my%20Get%20Datum%20account." target="_blank" class="px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-emerald-100 flex items-center gap-1 transition-transform active:scale-95">
                            <i data-lucide="send" class="w-3 h-3"></i> Chat Now
                        </a>
                    </div>
                    <div>
                        <h3 class="font-bold mb-4">Recent Transactions</h3>
                        <div class="space-y-3">
                            ${transactions.slice(0, 3).map(tx => `
                                <div class="bg-white p-4 rounded-2xl border border-slate-50 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                                            <i data-lucide="${tx.amount > 0 ? 'arrow-down-left' : 'arrow-up-right'}"></i>
                                        </div>
                                        <div><h4 class="text-sm font-bold">${tx.type}</h4><p class="text-[10px] text-slate-400">${new Date(tx.created_at).toLocaleDateString()}</p></div>
                                    </div>
                                    <div class="flex flex-col items-end gap-1">
                                        <div class="text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : ''}">${tx.amount > 0 ? '+' : ''}GH₵${Math.abs(tx.amount).toLocaleString()}</div>
                                        
                                        ${tx.status === 'COMPLETED' ? `
                                            <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 mb-1">
                                                <i data-lucide="zap" class="w-2.5 h-2.5"></i> Order Received
                                            </span>
                                        ` : ''}

                                        ${tx.type === 'PURCHASE' ? `
                                            ${state.confirmedOrders.includes(tx.id) ? `
                                                <span class="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                    <i data-lucide="check" class="w-3 h-3"></i> Order Confirmed
                                                </span>
                                            ` : `
                                                <button onclick="handleConfirmOrder('${tx.id}', '${tx.description}', '${tx.status}')" class="px-3 py-1 bg-emerald-600 text-white text-[9px] font-bold rounded-lg flex items-center gap-1">
                                                    Confirm Order
                                                </button>
                                            `}
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    } else if (state.user && state.user.role === 'ADMIN' && state.view === 'admin-sms') {
        content = `
            <div class="max-w-2xl mx-auto px-6 pt-8 animate-slide-up space-y-6">
                <div class="flex items-center gap-4 mb-2">
                    <button onclick="setState({view: 'dashboard'})" class="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                        <i data-lucide="chevron-left"></i>
                    </button>
                    <h2 class="text-2xl font-bold">Bulk SMS Portal</h2>
                </div>

                <div class="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div class="flex p-1 bg-slate-100 rounded-2xl">
                        <button onclick="state.smsForm.target = 'all'; render();" class="flex-1 py-3 rounded-xl text-xs font-bold transition ${state.smsForm.target === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">Past Purchasers</button>
                        <button onclick="state.smsForm.target = 'manual'; render();" class="flex-1 py-3 rounded-xl text-xs font-bold transition ${state.smsForm.target === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">Manual Entry</button>
                    </div>

                    <form onsubmit="handleSendSMS(event)" class="space-y-4">
                        ${state.smsForm.target === 'manual' ? `
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Phone Numbers</label>
                                <textarea placeholder="Enter numbers separated by comma or newline" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm min-h-[100px]" oninput="state.smsForm.manualNumbers = this.value">${state.smsForm.manualNumbers}</textarea>
                            </div>
                        ` : `
                            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                                <span class="text-xs font-bold text-indigo-600">Recipients Detected</span>
                                <span class="px-3 py-1 bg-white text-indigo-600 rounded-full text-xs font-bold shadow-sm">
                                    ${[...new Set((state.data.allTransactions || []).map(tx => tx.description.match(/to\s+(\d+)/)?.[1]).filter(Boolean))].length} Recipients
                                </span>
                            </div>
                        `}

                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Message Content</label>
                            <textarea placeholder="Type your broadcast message here..." required class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm min-h-[150px]" oninput="state.smsForm.message = this.value">${state.smsForm.message}</textarea>
                        </div>

                        <button class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                            ${state.loading ? 'Sending...' : '<i data-lucide="send" class="w-4 h-4"></i> Send Broadcast'}
                        </button>
                    </form>
                </div>
            </div>
        `;
    } else if (state.view === 'buy-data') {
        content = `
            <div class="max-w-2xl mx-auto px-6 pt-8 animate-slide-up space-y-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <button onclick="setState({view: '${state.user ? 'dashboard' : 'landing'}'})" class="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                            <i data-lucide="chevron-left"></i>
                        </button>
                        <h2 class="text-2xl font-bold">Buy Data Bundle</h2>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-slate-500">Bulk Mode</span>
                        <div class="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="bulkToggle" class="switch-input hidden" ${state.purchaseForm.isBulk ? 'checked' : ''} onchange="state.purchaseForm.isBulk = this.checked; render();">
                            <label for="bulkToggle" class="switch-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer relative"></label>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    ${NETWORKS.map(nw => {
            const isActive = state.purchaseForm.network === nw;
            let brandClass = '';
            if (isActive) {
                brandClass = nw === 'MTN' ? 'btn-mtn' : (nw === 'TELECEL' ? 'btn-telecel' : 'btn-airteltigo');
            } else {
                brandClass = 'bg-white text-slate-400 border border-slate-100';
            }
            return `<button onclick="state.purchaseForm.network = '${nw}'; state.showMorePlans = false; render();" class="px-6 py-2 rounded-full text-xs font-bold transition-all ${brandClass}">${nw}</button>`;
        }).join('')}
                </div>
                
                <form onsubmit="handlePurchase(event)" class="space-y-6">
                    ${state.purchaseForm.isBulk ? `
                        <div class="space-y-2">
                            <textarea placeholder="Enter phone numbers (separated by commas or fresh lines)" required class="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none h-32 resize-none" oninput="state.purchaseForm.phoneNumber = this.value">${state.purchaseForm.phoneNumber}</textarea>
                            <p class="text-[10px] text-slate-400 px-1">Example: 08012345678, 09087654321</p>
                        </div>
                    ` : `
                        <input type="tel" placeholder="Phone Number" required class="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none" oninput="state.purchaseForm.phoneNumber = this.value" value="${state.purchaseForm.phoneNumber || ''}">
                    `}

                    ${isGuest ? `
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Guest Email (For Receipt)</label>
                            <input type="email" placeholder="your@email.com" required class="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none" oninput="state.purchaseForm.guestEmail = this.value" value="${state.purchaseForm.guestEmail || ''}">
                        </div>
                    ` : ''}
                    
                    <div class="grid grid-cols-1 gap-3">
                        ${(() => {
                const networkPlans = INITIAL_PLANS.filter(p => p.network === state.purchaseForm.network);
                const displayedPlans = state.showMorePlans ? networkPlans : networkPlans.slice(0, 3);
                return displayedPlans.map(plan => `
                                <button type="button" onclick="state.purchaseForm.planId = '${plan.id}'; render();" class="p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${state.purchaseForm.planId === plan.id ? `border-${state.purchaseForm.network.toLowerCase()} active-${state.purchaseForm.network.toLowerCase()}` : 'border-slate-100 bg-white'}">
                                    <div><h4 class="font-bold">${plan.name}</h4><p class="text-xs text-slate-400">${plan.validity}</p></div>
                                    <div class="font-bold">GH₵${getPrice(plan)}</div>
                                </button>
                            `).join('');
            })()}
                    </div>
                    
                    ${INITIAL_PLANS.filter(p => p.network === state.purchaseForm.network).length > 3 ? `
                        <button type="button" onclick="state.showMorePlans = !state.showMorePlans; render();" class="w-full py-3 bg-white text-slate-600 border border-slate-100 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                            <i data-lucide="${state.showMorePlans ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4"></i>
                            ${state.showMorePlans ? 'Show Less Plans' : 'View More Plans'}
                        </button>
                    ` : ''}
                    <div class="grid grid-cols-2 gap-3 mt-4">
                        <button type="submit" data-method="wallet" class="py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold transition-all hover:bg-slate-200">
                             Wallet
                        </button>
                        <button type="submit" data-method="paystack" class="py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 btn-${state.purchaseForm.network.toLowerCase()}">
                            ${state.loading ? '...' : 'Paystack'}
                        </button>
                    </div>
                </form>
            </div>
        `;
    } else if (state.view === 'transactions' && state.user) {
        content = `
            <div class="max-w-2xl mx-auto px-6 pt-8 animate-slide-up space-y-6">
                <h2 class="text-2xl font-bold">History</h2>
                <div class="space-y-3">
                    ${transactions.map(tx => `
                        <div class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div><h4 class="font-bold">${tx.description}</h4><p class="text-xs text-slate-400">${new Date(tx.created_at).toLocaleString()}</p></div>
                            <div class="flex flex-col items-end gap-1 shrink-0">
                                <div class="font-bold ${tx.amount > 0 ? 'text-emerald-600' : ''}">${tx.amount > 0 ? '+' : ''}GH₵${Math.abs(tx.amount).toLocaleString()}</div>
                                
                                ${tx.status === 'COMPLETED' ? `
                                    <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 mb-1">
                                        <i data-lucide="zap" class="w-2.5 h-2.5"></i> Order Received
                                    </span>
                                ` : ''}

                                ${tx.type === 'PURCHASE' ? `
                                    ${state.confirmedOrders.includes(tx.id) ? `
                                        <span class="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                            <i data-lucide="check" class="w-3 h-3"></i> Order Confirmed
                                        </span>
                                    ` : `
                                        <button onclick="handleConfirmOrder('${tx.id}', '${tx.description}', '${tx.status}')" class="px-3 py-1 bg-emerald-600 text-white text-[9px] font-bold rounded-lg flex items-center gap-1">
                                            Confirm
                                        </button>
                                    `}
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Navigation
    const nav = `
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
            <button onclick="setState({view: state.user ? 'dashboard' : 'landing'})" class="flex flex-col items-center gap-1 ${state.view === 'dashboard' || (state.view === 'landing' && !state.user) ? 'text-indigo-600' : 'text-gray-400'}">
                <i data-lucide="${state.user?.role === 'ADMIN' ? 'layout-dashboard' : 'zap'}"></i><span class="text-[10px] font-medium uppercase">Home</span>
            </button>
            
            ${state.user?.role === 'ADMIN' ? `
                <button onclick="setState({view: 'transactions'})" class="flex flex-col items-center gap-1 ${state.view === 'transactions' ? 'text-indigo-600' : 'text-gray-400'}">
                    <i data-lucide="users"></i><span class="text-[10px] font-medium uppercase">Users</span>
                </button>
                <button onclick="setState({view: 'buy-data'})" class="flex flex-col items-center gap-1 ${state.view === 'buy-data' ? 'text-indigo-600' : 'text-gray-400'}">
                    <i data-lucide="smartphone"></i><span class="text-[10px] font-medium uppercase">Buy Data</span>
                </button>
                <button onclick="setState({view: 'admin-sms'})" class="flex flex-col items-center gap-1 ${state.view === 'admin-sms' ? 'text-indigo-600' : 'text-gray-400'}">
                    <i data-lucide="message-square"></i><span class="text-[10px] font-medium uppercase">SMS</span>
                </button>
            ` : `
                <button onclick="setState({view: 'buy-data'})" class="flex flex-col items-center gap-1 ${state.view === 'buy-data' ? 'text-indigo-600' : 'text-gray-400'}">
                    <i data-lucide="smartphone"></i><span class="text-[10px] font-medium uppercase">Buy Data</span>
                </button>
                ${state.user ? `
                    <button onclick="setState({view: 'transactions'})" class="flex flex-col items-center gap-1 ${state.view === 'transactions' ? 'text-indigo-600' : 'text-gray-400'}">
                        <i data-lucide="history"></i><span class="text-[10px] font-medium uppercase">History</span>
                    </button>
                ` : `
                    <button onclick="setState({view: 'login'})" class="flex flex-col items-center gap-1 ${state.view === 'login' ? 'text-indigo-600' : 'text-gray-400'}">
                        <i data-lucide="user"></i><span class="text-[10px] font-medium uppercase">Login</span>
                    </button>
                `}
            `}

            ${state.user ? `
                <button onclick="handleSignOut();" class="flex flex-col items-center gap-1 text-gray-400">
                    <i data-lucide="log-out"></i><span class="text-[10px] font-medium uppercase">Exit</span>
                </button>
            ` : ''}
        </nav>
    `;

    // Message Toast
    const toast = state.message ? `
        <div class="fixed top-4 left-4 right-4 z-[100] p-4 rounded-xl shadow-lg border ${state.message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'} animate-slide-up">
            <p class="font-medium">${state.message.text}</p>
        </div>
    ` : '';

    app.innerHTML = toast + content + (state.view !== 'login' && state.view !== 'register' ? nav : '');

    // Active Users Modal
    if (state.showActiveUsersModal && state.user?.role === 'ADMIN') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const transactions = (state.data.allTransactions || []).filter(t => t.type === 'PURCHASE' && new Date(t.created_at) > thirtyDaysAgo);

        // Group by user/phone
        const userMap = {};
        transactions.forEach(t => {
            const match = t.description.match(/to\s+(\d+)/);
            const key = match ? match[1] : (t.user_id || 'Unknown');
            if (!userMap[key] || new Date(t.created_at) > new Date(userMap[key].date)) {
                userMap[key] = { id: key, date: t.created_at, desc: t.description };
            }
        });

        const activeUsersList = Object.values(userMap).sort((a, b) => new Date(b.date) - new Date(a.date));

        const modalHtml = `
            <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                <div class="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-slide-up">
                    <div class="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 class="text-xl font-bold">Active Users (30d)</h3>
                        <button onclick="setState({showActiveUsersModal: false})" class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="max-h-[60vh] overflow-y-auto p-6 space-y-4">
                        ${activeUsersList.length === 0 ? '<p class="text-center text-slate-400 py-8">No active users in the last 30 days.</p>' : `
                            <div class="space-y-3">
                                ${activeUsersList.map(u => `
                                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                                ${u.id.slice(-2)}
                                            </div>
                                            <div>
                                                <h4 class="text-sm font-bold">${u.id}</h4>
                                                <p class="text-[10px] text-slate-400">Last: ${new Date(u.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div class="text-[10px] bg-white px-2 py-1 rounded-full border border-slate-100 font-bold text-slate-500 uppercase">Active</div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                    <div class="p-6 bg-slate-50">
                        <p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing ${activeUsersList.length} Unique Active Recipients</p>
                    </div>
                </div>
            </div>
        `;
        app.insertAdjacentHTML('beforeend', modalHtml);
    }

    lucide.createIcons();
}

// Initial Render & Session Check
initSession();

// Global access for onclick and oninput handlers
window.sb = sb;
window.state = state;
window.render = render;
window.setState = setState;
window.getPrice = getPrice;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handlePurchase = handlePurchase;
window.handleTopup = handleTopup;
window.handleSendSMS = handleSendSMS;
window.sendConfirmationSMS = sendConfirmationSMS;
