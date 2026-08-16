**Role:** Senior Mobile UI/UX Engineer, Product Designer, React Architect, TypeScript Engineer, and PWA Specialist.

**Objective:** Build/refactor "VoiceGraph" as a strictly Mobile-First, native-feeling Progressive Web App (PWA). 

**CRITICAL EXECUTION PROTOCOL (STEP-BY-STEP):**
Do NOT attempt to build this entire application in one single response. You will run out of tokens and the code will break. 
Your first task is ONLY to read this master blueprint, acknowledge you understand the architecture, and wait for me to say: "Begin Phase 1". 
I will ask you to build the application modularly (e.g., "Build the Mobile Shell", "Build the Capture Flow").

---

========================================================
1. CRITICAL MOBILE ARCHITECTURE
========================================================
The application MUST be designed Mobile-First. Do NOT use a desktop sidebar as the primary navigation.
For desktop browser preview/development, wrap the main App component inside this exact simulated phone container:
`<div className="w-full max-w-[430px] h-[850px] mx-auto relative overflow-hidden bg-slate-50 shadow-2xl sm:rounded-[3rem] sm:border-[8px] sm:border-gray-900 flex flex-col">`

IMPORTANT: This container is ONLY a development/preview device frame. 

========================================================
2. TECHNOLOGY & CONSTRAINTS
========================================================
Use: React, TypeScript, Tailwind CSS, lucide-react.
The application must have: Zero import errors, zero broken navigation, and functional state transitions using React state.

========================================================
3. AUTO-LOGIN / AUTHENTICATION BYPASS (PROTOTYPE MODE)
========================================================
For this prototype, we are using a FRICTIONLESS AUTO-LOGIN architecture.
DO NOT create complex email/password validation forms. DO NOT require the user to type credentials.

Initial application flow:
App Launch 
   ↓
Splash Screen (1.5 seconds)
   ↓
Auto-Authenticates via `mockAuthUser`
   ↓
Redirects immediately to Home Dashboard

========================================================
4. MOCK USER PROFILE (AUTO-LOGIN STATE)
========================================================
When the app launches, automatically set the global state `isAuthenticated = true` and populate the user state with:
{
  id: "u_1",
  name: "Pulok",
  email: "pulok@voicegraph.app",
  role: "Product Team",
  workspaceId: "w_alpha"
}

========================================================
5. MAIN APP STRUCTURE
========================================================
App
├── TopAppBar (Logo left, Profile/Notifications right)
├── MainContent (Dynamic Router rendering active view)
├── FloatingActionButton (Quick Capture)
└── BottomNavigation (Fixed at bottom)

========================================================
6. BOTTOM NAVIGATION
========================================================
Exactly four primary tabs: Home, Inbox, Graph, AI (lucide-react icons: Home, Inbox, Network, Sparkles).
Minimum touch target: 44 × 44px. Clicking these updates the `activeView` state to swap out the MainContent.

========================================================
7. QUICK CAPTURE FAB
========================================================
Use a large, elevated circular microphone FAB (Indigo color). Place it bottom-center, slightly floating above the Bottom Navigation. Tapping this opens the Quick Capture overlay.

========================================================
8. HOME DASHBOARD
========================================================
Show a welcoming header: "Hello, Pulok". 
Subtext: "Turn your thoughts into connected knowledge."
Display vertical scrollable sections mapping over mock data: Recent Projects (horizontal scroll), Recent Voice Notes (cards), and Pending Reviews.

========================================================
9. QUICK CAPTURE & RECORDING SCREEN
========================================================
Full-screen mobile bottom-sheet interface.
Show: Large microphone, simulated animated waveform, and a timer counting up.
Actions: Stop, Cancel.
When "Stop" is clicked, show a brief "Saving..." state, push the mock recording to the `mockVoiceNotes` state array, and navigate to the Inbox.

========================================================
10. AI PROCESSING SIMULATION
========================================================
In the Inbox, a newly captured note should show a simulated processing state for 3 seconds before displaying results.
Stages: Transcribing → Extracting Entities → Complete.

========================================================
11. VOICE NOTE REVIEW (INBOX ITEM)
========================================================
When a note is tapped in the Inbox, expand it to show stacked mobile elements:
1. Audio Player (mocked)
2. Transcript
3. AI Summary
4. Entities (Chips representing People, Projects, Technologies)
5. AI Confidence Badge (e.g., "94% - High")
Include full-width [Approve] and [Reject] buttons.

========================================================
12. KNOWLEDGE GRAPH EXPLORER
========================================================
Mobile graph must NOT display a huge desktop-style node web. 
Use a list-based or simplified clustered view. 
Show the selected Node, and a list of "Connected Nodes". Support tapping a node to drill down into its Wiki/Detail page.

========================================================
13. NODE DETAIL / WIKI
========================================================
Tapping a graph node opens its knowledge page.
Show: Name, Type, AI Summary, Key Facts, Related People/Projects, and the "Source Voice Notes" that generated this page.

========================================================
14. SOURCE PROVENANCE (CRITICAL UX)
========================================================
Every important AI-generated fact must show its source to build trust.
Example layout on a Wiki fact:
"Project Alpha uses Stripe" -> [Source: Voice Note #128 • Pulok]

========================================================
15. AI ASSISTANT (CHAT)
========================================================
Native mobile chat experience (similar to iMessage). 
Chat history takes up the vertical space. 
Text input is pinned directly above the Bottom Navigation.
When user asks a question, simulate a response that cites specific voice notes as sources.

========================================================
16. SETTINGS & PROFILE
========================================================
Accessible from the Top App Bar. 
Show standard UI toggles for AI preferences, notifications, and an option to "Clear Local Data".

========================================================
17. MOCK DATA ENGINE
========================================================
You must generate robust mock data arrays at the top of the app to populate these views: `mockProjects`, `mockVoiceNotes`, `mockGraphNodes`. Without this, the app will look empty.

========================================================
18. VISUAL DESIGN & COLOR SYSTEM
========================================================
Brand Colors: VoiceGraph Indigo (#6366F1).
Backgrounds: Canvas (#F8FAFC), White (#FFFFFF).
Text: Graphite (#374151), Deep Ink (#111827).
Typography: Inter for UI, sans-serif.

---

**YOUR INSTRUCTIONS FOR THIS PROMPT:**
Do not write the application code yet. Reply ONLY with:
1. A confirmation that you understand the Mobile-First architecture and the Auto-Login bypass.
2. The message: "Ready to build. Please reply with 'Begin Phase 1' to generate the Mobile Shell and Auto-Login logic."