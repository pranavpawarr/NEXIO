Here is a professional, comprehensive README.md for your project. You can copy-paste this directly into your repository.

✦ Nexio

The connected workspace where better, faster work happens.

Nexio is a full-stack, production-grade productivity application inspired by Notion. It goes beyond simple note-taking by integrating Artificial Intelligence, Geo-Location, and Google Calendar sync to transform how you manage your life and work.

![alt text](https://github.com/user-attachments/assets/placeholder-image)
<!-- You can replace this with a screenshot of your app later -->

🚀 Features
📝 Core Workspace

Block-Based Editor: A rich text editor (powered by BlockNote) supporting slash commands, nested blocks, and real-time state management.

Recursive Sidebar: Infinite nesting of pages with a file-tree structure.

Cover Images: Drag-and-drop image uploads via EdgeStore.

Dark Mode: Fully responsive light and dark themes.

Global Search: Cmd + K interface to instantly jump between documents.

Trash & Archive: Soft delete system with restore functionality.

🧠 AI Intelligence (Powered by Gemini)

Context-Aware Chat: Chat with your document. Ask questions like "Summarize this" or "What are the deadlines?" and get answers based on what you wrote.

Task Extraction: One-click AI extraction that reads your document and generates a prioritized To-Do list automatically.

📍 Smart Task Management

Geo-Location Sorting: Sort your tasks based on where you are physically standing (e.g., prioritizing "Buy Milk" when you are near a grocery store).

Google Calendar Sync: Push tasks directly to your Google Calendar with a single click.

Priority System: High/Medium/Low priority tagging.

🛠️ Tech Stack

Framework: Next.js 14+ (App Router)

Language: TypeScript

Styling: Tailwind CSS + Shadcn UI

Database: PostgreSQL (hosted on Supabase)

ORM: Prisma

Authentication: Clerk

File Storage: EdgeStore

AI Model: Google Gemini 2.0 Flash

State Management: Zustand + Tanstack Query

⚙️ Environment Variables

To run this project locally, you need to configure the following environment variables in a .env file at the root of your project.

code
Env
download
content_copy
expand_less
# 1. Database (Supabase Connection)
DATABASE_URL="postgresql://postgres.[user]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[user]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# 2. Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# 3. File Storage (EdgeStore)
EDGE_STORE_ACCESS_KEY="es_access_..."
EDGE_STORE_SECRET_KEY="es_secret_..."

# 4. Artificial Intelligence (Google Gemini)
GEMINI_API_KEY="AIzaSy..."

Note on Google Calendar: To enable Calendar sync, you must configure Google as a Social Connection in Clerk and add the scope: https://www.googleapis.com/auth/calendar.

🏃‍♂️ Getting Started
1. Clone the repository
code
Bash
download
content_copy
expand_less
git clone https://github.com/your-username/nexio.git
cd nexio
2. Install dependencies
code
Bash
download
content_copy
expand_less
npm install
3. Setup Database

Ensure your .env file is set up with your Supabase credentials, then run:

code
Bash
download
content_copy
expand_less
# Generate Prisma Client
npx prisma generate

# Push Schema to Database
npx prisma db push
4. Run the development server
code
Bash
download
content_copy
expand_less
npm run dev

Open http://localhost:3000 in your browser.

📂 Project Structure
code
Text
download
content_copy
expand_less
app/
├── (marketing)/      # Landing page routes
├── (main)/           # Dashboard & App routes (Protected)
│   ├── _components/  # Sidebar, Item, TrashBox
│   └── (routes)/     # Documents, Tasks, Home
├── api/              # Backend API Routes
│   ├── ai/           # Chat & Task Extraction Logic
│   ├── documents/    # CRUD for Pages
│   ├── tasks/        # Task Management & Calendar Sync
│   └── edgestore/    # File Upload Handler
components/           # Shared UI Components (Editor, Modals, Providers)
hooks/                # Custom React Hooks (use-scroll, use-origin)
lib/                  # Utilities (Prisma, Edgestore config)
prisma/               # Database Schema
🚀 Deployment

The app is optimized for deployment on Vercel.

Push your code to GitHub.

Import the project into Vercel.

Critical: Add all Environment Variables from your .env file into Vercel Settings.

Deploy!

Note: The package.json includes a postinstall script to generate the Prisma client automatically during deployment.

🤝 Contributing

Contributions are welcome!

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License

Distributed under the MIT License. See LICENSE for more information.
