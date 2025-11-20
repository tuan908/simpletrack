### 🛠 Phase 0: Project Setup & Foundation
**Goal:** A running "Hello World" environment with database connectivity.

*   **[TASK-01] Initialize Project Repository**
    *   **Action:** Set up Next.js (App Router), TypeScript, and Tailwind CSS.
    *   **Config:** Set up `inter` font family as default. Configure Tailwind colors to match the high-contrast requirement (mostly Slate/Gray scale + one Primary Blue).
    *   **DoD:** `npm run dev` loads a clean homepage with the correct font.

*   **[TASK-02] Database & ORM Setup**
    *   **Action:** Set up SQLite (for local dev) and an ORM (recommend Prisma or Drizzle).
    *   **Action:** Create the initial connection string.
    *   **DoD:** Database connects without errors.

---

### 💀 Phase 1: The Skeleton (Contacts CRUD)
**Goal:** User can see a list of people and add a new one.

*   **[TASK-03] Backend: Contacts Schema & Migration**
    *   **Action:** Define `Contact` model: `id` (UUID), `name` (String), `email` (String, nullable), `phone` (String, nullable), `company` (String, nullable), `status` (Enum: New, Talking, Won, Lost).
    *   **DoD:** Migration runs successfully. `npx prisma studio` (or equivalent) allows manual row creation.

*   **[TASK-04] UI: Contact List Component**
    *   **Action:** Create a responsive card (mobile) / row (desktop) component.
    *   **Details:** Show Name (Bold, Lg), Company (Gray, Sm), and Status Badge.
    *   **Constraint:** No complex grids. Keep it simple.
    *   **DoD:** Component renders correctly with hardcoded props.

*   **[TASK-05] Feature: Contact List Page (Read)**
    *   **Action:** Fetch contacts from DB on `/contacts` (or home `/`).
    *   **Action:** Implement the "Empty State" (Illustration + "Add your first contact" text) if array length is 0.
    *   **DoD:** Page displays DB data. Empty state appears when DB is empty.

*   **[TASK-06] Feature: Add Contact Form (Create)**
    *   **Action:** Create a Modal or dedicated page `/contacts/new`.
    *   **Validation:** `Name` is required. All others optional.
    *   **UX:** Focus on the "Name" input on load.
    *   **DoD:** Submitting form adds a row to DB and redirects/refreshes the List View.

*   **[TASK-07] Feature: Search Bar (Client-Side)**
    *   **Action:** Add text input above Contact List.
    *   **Logic:** Filter the displayed array by `name` OR `company`.
    *   **DoD:** Typing "John" hides "Mary".

---

### 🧠 Phase 2: The Brain (Contact Details)
**Goal:** User can view and edit a specific person.

*   **[TASK-08] Feature: Contact Detail Page Routing**
    *   **Action:** Create `/contact/[id]` page.
    *   **Action:** Fetch specific contact data.
    *   **DoD:** Clicking a person on the List Page opens this Detail Page.

*   **[TASK-09] UI/Feature: Profile Section & Quick Actions**
    *   **Action:** Render Name, Company, Status.
    *   **Action:** Render "Call" button (`href="tel:..."`) and "Email" button (`href="mailto:..."`).
    *   **Logic:** Hide buttons if phone/email is null.
    *   **DoD:** Clicking "Call" opens the phone dialer.

*   **[TASK-10] Feature: Edit Contact Details**
    *   **Action:** Allow inline editing or a "Edit Profile" modal.
    *   **Action:** Allow updating `Status` (New -> Won).
    *   **DoD:** Changing name/status persists after page reload. Success Toast appears.

*   **[TASK-11] Feature: Delete Contact**
    *   **Action:** Add a red "Delete" button (bottom of profile or top-right menu).
    *   **UX:** **Must** have a confirmation browser alert or modal ("Are you sure?").
    *   **DoD:** Contact is removed from DB and user redirected to Home.

---

### 📝 Phase 3: The Memory (Notes)
**Goal:** User can log history.

*   **[TASK-12] Backend: Notes Schema & Migration**
    *   **Action:** Define `Note` model: `id`, `content`, `type` (Call, Email, Meeting, Note), `created_at`, `contact_id` (FK).
    *   **DoD:** Schema relation established (One Contact -> Many Notes).

*   **[TASK-13] Feature: Add Note Component**
    *   **Action:** Add Textarea + "Save Note" button on Detail Page.
    *   **Action:** Add simple selector for "Type" (Call vs Meeting).
    *   **DoD:** User can type text, hit save, and input clears.

*   **[TASK-14] Feature: Activity Timeline**
    *   **Action:** Fetch notes for the current contact.
    *   **UI:** Render list below the Add Note form (Newest on top).
    *   **Format:** `[Icon/Type] - [Date] - [Content]`.
    *   **DoD:** Note added in TASK-13 appears immediately in this list (Optimistic UI or Revalidation).

---

### 🤖 Phase 4: The Assistant (Reminders & Dashboard)
**Goal:** User knows what to do next.

*   **[TASK-15] Backend: Reminders Schema & Migration**
    *   **Action:** Define `Reminder` model: `id`, `task`, `due_date`, `is_complete` (Bool), `contact_id` (FK).
    *   **DoD:** Migration successful.

*   **[TASK-16] Feature: Set Reminder Form**
    *   **Action:** Add to Contact Detail page (Next to Notes).
    *   **Inputs:** Task Description (Text), Due Date (Native HTML Date picker).
    *   **DoD:** Saves a reminder linked to the user.

*   **[TASK-17] Feature: Dashboard (Work View)**
    *   **Action:** Create `/dashboard` (or update Home `/` to split view).
    *   **Query:** Fetch all reminders where `is_complete` is FALSE, sorted by `due_date` ASC.
    *   **UI:** List view. Group by "Overdue", "Today", "Upcoming".
    *   **DoD:** Reminders created in TASK-16 show up here.

*   **[TASK-18] Feature: Complete Reminder**
    *   **Action:** Add a checkbox next to the reminder in Dashboard.
    *   **Logic:** Clicking check updates `is_complete = true`.
    *   **UI:** Item disappears from list (or fades out).
    *   **DoD:** Reminder is removed from "Work View" but remains in database.

---

### 💅 Phase 5: Polish & "Grandma Rule" Audit
**Goal:** Make it feel like a finished product, not a prototype.

*   **[TASK-19] UI: Loading Skeletons**
    *   **Action:** Create a "Pulse" loading state for the Contact List and Detail Profile.
    *   **DoD:** No content layout shift (CLS) when data loads.

*   **[TASK-20] UI: Toast Notifications System**
    *   **Action:** Implement a global Toast provider (e.g., `sonner` or `react-hot-toast`).
    *   **Triggers:** Add toasts to: Create Contact, Update Contact, Save Note, Complete Task.
    *   **DoD:** Green "Saved!" pop-up appears on actions.

*   **[TASK-21] Mobile Audit**
    *   **Action:** Open app in Chrome DevTools "Mobile View".
    *   **Check:** Are buttons tap targets large enough (44px+)? Is text readable without zooming?
    *   **Fix:** Adjust padding/font-sizes where necessary.

*   **[TASK-22] Deployment**
    *   **Action:** Deploy to Vercel/Netlify.
    *   **Action:** Run final smoke test on a real mobile device.