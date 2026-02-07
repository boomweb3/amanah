# Amānah – Ethical Trust & Ledger Management

**Amānah** is a privacy-first, community-centric web application designed to help individuals record, manage, and honor debts and trusts in line with ethical principles. Inspired by the principle of *Amanah* (Trust), the platform emphasizes clarity, transparency, and the moral responsibility of financial obligations.

## 🧠 The Philosophy
In many informal settings, verbal agreements regarding debts or safekeeping are common but often lead to misunderstandings or forgotten obligations. Amānah provides a dignified digital space to "write it down," as encouraged by ancient wisdom, ensuring that relationships remain protected through clear, mutually verified records.

## ✅ Core Features & Functionalities

### 1. The Ethical Ledger (Bi-Directional Sync)
- **Shared Commitment**: Records created by one party are linked to the partner's account via a unique ID. Once verified, the record exists in both ledgers simultaneously.
- **Role Awareness**: The UI automatically mirrors the perspective—what appears as "I Owe" for the Debtor appears as "Owed to Me" for the Creditor.
- **Monetary & Physical Trusts**: Track financial debts (localized to **Naira ₦**) or physical items (Amānah) held for safekeeping.
- **Partial Fulfillment**: Record partial payments for monetary debts with an automated progress bar and payment history log.

### 2. Handshake Verification Workflow
- **Pending State**: Records stay "Pending" until the partner performs a digital handshake (verification).
- **Guest Support**: Partners can verify terms through shared links and a simulated secure OTP process without a full account.

### 3. Act of Grace (Debt Forgiveness)
- **Forgiveness Workflow**: Creditors can choose to forgive a debt permanently.
- **Private Notifications**: Upon forgiveness, the debtor receives a private, dignified in-app notification informing them the debt has been cleared.
- **Dignified Logic**: The process avoids celebratory animations, focusing instead on the ethical beauty of the act.

### 4. AI-Driven Ethical Wisdom
- **Ethical Beacon**: Powered by **Gemini 2.5/3 Flash**, the dashboard features a rotating card providing profound reminders on integrity and trust.
- **Contextual Reminders**: System-generated "Gentle Reminders" alert users of approaching due dates to help them honor their word proactively.

### 5. Privacy & Management
- **History Deletion**: Users have full control over their records and can delete items from their Amānah History.
- **Zero Public Feeds**: Financial interactions are strictly private between the two involved parties.
- **Secure Persistence**: Data is persisted via LocalStorage, ensuring immediate privacy and offline availability.

## 🎨 Visual Identity
- **Minimalist Aesthetic**: Uses a clean, high-contrast design with a focus on typography (Inter & Playfair Display).
- **Universal Dark Mode**: A seamless transition between Light and Dark themes.
- **Generated Identifiers**: Every user is assigned a unique, deterministic geometric avatar based on their ID, ensuring a professional and consistent visual identity.

## 🛠 Tech Stack
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/)
- **Charts**: [Recharts](https://recharts.org/) for Trust Health visualization.
- **Icons**: [FontAwesome 6](https://fontawesome.com/)
- **State Management**: React Hooks & LocalStorage.

## 🚀 Future Roadmap
- **Blockchain Integration**: For immutable, cryptographic proofs of commitment.
- **Backend Migration**: Transitioning from LocalStorage to a secure PostgreSQL/Supabase backend for cross-device sync.
- **Multi-Party Trusts**: Supporting group debts (e.g., shared rentals or community funds).

---
*Amānah — Protect your relationships with clarity.*