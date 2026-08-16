ROLE:
You are a Senior Mobile UI/UX Engineer, Product Designer, React Architect,
TypeScript Engineer, Authentication Engineer, and PWA Specialist.

OBJECTIVE:
Build/refactor "VoiceGraph" as a strictly Mobile-First, native-feeling
Progressive Web App (PWA).

VoiceGraph is an AI-powered organizational memory platform that converts
unstructured voice notes from remote workers into structured, interconnected
company knowledge.

VoiceGraph is NOT simply a voice recorder.

The core product loop is:

VOICE
  ↓
TRANSCRIPTION
  ↓
AI UNDERSTANDING
  ↓
SUMMARY + ENTITY EXTRACTION
  ↓
RELATIONSHIP DETECTION
  ↓
HUMAN REVIEW
  ↓
KNOWLEDGE GRAPH
  ↓
COMPANY WIKI
  ↓
SEARCH / AI ASSISTANT / DISCOVERY


========================================================
1. CRITICAL MOBILE ARCHITECTURE
========================================================

Ignore previous desktop-first layout instructions.

The application MUST be designed Mobile-First.

Do NOT use a desktop sidebar as the primary navigation.

For desktop browser preview/development, wrap the main App component
inside this exact simulated phone container:

<div className="w-full max-w-[430px] h-[850px] mx-auto relative overflow-hidden bg-slate-50 shadow-2xl sm:rounded-[3rem] sm:border-[8px] sm:border-gray-900 flex flex-col">

IMPORTANT:

This container is ONLY a development/preview device frame.

When running as an actual PWA on a mobile device, VoiceGraph must use
the full available viewport.

The app must support:

- 375px
- 390px
- 430px
- Tablet
- Desktop preview

Do not simply shrink desktop layouts.


========================================================
2. TECHNOLOGY
========================================================

Use:

- React
- TypeScript
- Tailwind CSS
- lucide-react
- React Hooks
- Component-based architecture
- PWA-ready architecture

Use reusable components.

Keep mock data centralized.

Avoid unnecessary dependencies.

The application must have:

- Zero import errors
- Zero undefined components
- Zero broken navigation
- No dead primary buttons
- No broken state transitions
- No fake functionality presented as real functionality

If functionality is simulated using mock data, structure it so that it can
later be replaced by real APIs.


========================================================
3. AUTHENTICATION — REQUIRED
========================================================

Authentication is a CORE feature.

The user MUST NOT directly enter the main VoiceGraph application without
authentication.

Initial application flow:

App Launch
   ↓
Authentication Check
   ↓
Logged In?
   ├── YES → Main App
   └── NO  → Authentication


========================================================
4. AUTHENTICATION SCREENS
========================================================

Create these authentication screens:

1. Splash / Loading
2. Welcome
3. Login
4. Registration
5. Forgot Password
6. Reset Password
7. Email Verification
8. Authentication Error


========================================================
5. SPLASH SCREEN
========================================================

Display:

VoiceGraph logo

Tagline:

"Turn your voice into organizational knowledge."

Show a short loading state while checking authentication.

If authenticated:

→ Main App

If unauthenticated:

→ Welcome / Login


========================================================
6. WELCOME SCREEN
========================================================

Create a clean mobile onboarding/welcome screen.

Show:

VoiceGraph logo

Headline:

"Your team's knowledge, captured by voice."

Description:

"Record thoughts, updates, decisions, and meetings.
VoiceGraph transforms them into connected organizational knowledge."

Primary:

[Create Account]

Secondary:

[Log In]


========================================================
7. LOGIN SCREEN
========================================================

Create a professional mobile login screen.

Fields:

Email
Password

Controls:

Show/Hide password

Primary CTA:

[Log In]

Secondary:

[Forgot Password?]

Alternative authentication:

[Continue with Google]

If Google authentication is not actually implemented,
display it as a future integration rather than pretending it works.

Registration link:

"Don't have an account? Create one"


========================================================
8. LOGIN VALIDATION
========================================================

Validate:

- Empty email
- Invalid email format
- Empty password
- Incorrect credentials
- Network/authentication failure

Example:

Email:
"Please enter a valid email address."

Password:
"Password is required."

Authentication failure:

"Email or password is incorrect."

Do NOT reveal whether an account exists when security best practices
require a generic authentication error.


========================================================
9. REGISTRATION SCREEN
========================================================

Create a mobile registration screen.

Fields:

Full Name
Work Email
Password
Confirm Password

Optional:

Profile photo

Primary CTA:

[Create Account]

Secondary:

"Already have an account? Log In"


========================================================
10. REGISTRATION VALIDATION
========================================================

Validate:

- Name required
- Valid email
- Password required
- Password strength
- Confirm password
- Password matching

Password requirements should be clearly communicated.

Example:

Password must contain:

- At least 8 characters
- At least one number
- At least one uppercase/lowercase character

Do not display passwords in plain text by default.


========================================================
11. EMAIL VERIFICATION
========================================================

After successful registration:

Show:

"Verify your email"

"We sent a verification link to your email address."

Actions:

[Open Email App]
[Resend Verification Email]

Include:

"Change Email"

Prevent excessive resend requests with a cooldown state.

Example:

"Resend available in 45 seconds."


========================================================
12. FORGOT PASSWORD
========================================================

Screen:

"Forgot your password?"

Field:

Email

CTA:

[Send Reset Link]

Success:

"Check your email for instructions to reset your password."


========================================================
13. RESET PASSWORD
========================================================

Fields:

New Password
Confirm New Password

CTA:

[Reset Password]

After success:

"Your password has been updated."

[Log In]


========================================================
14. AUTHENTICATION STATE MANAGEMENT
========================================================

Maintain an authentication state.

Suggested states:

- checking
- unauthenticated
- authenticated
- loggingIn
- registering
- verifying
- resettingPassword
- authError

Protect all main application screens.

If the user is unauthenticated, they MUST NOT access:

- Home
- Inbox
- Graph
- AI
- Wiki
- Projects
- Voice Notes
- Workspace data


========================================================
15. DEMO / MOCK AUTHENTICATION
========================================================

For a frontend-only prototype, authentication may be simulated.

Use:

mockAuthUser

and a clearly separated mock authentication service.

Example demo credentials may be provided in development mode only.

Do NOT hard-code real passwords or pretend that mock authentication
provides production security.

Architecture should allow replacement with a real authentication backend.


========================================================
16. USER PROFILE
========================================================

After registration, create a user profile.

User model:

{
  id,
  name,
  email,
  avatar,
  role,
  workspaceId,
  createdAt
}

Example:

{
  name: "Pulok",
  email: "pulok@example.com",
  role: "Product Team"
}


========================================================
17. WORKSPACE ONBOARDING
========================================================

After first registration, show a short workspace onboarding flow.

Step 1:

"What should we call your workspace?"

Example:

"Acme Product Team"

Step 2:

"What is your role?"

Options:

- Software Engineer
- Product Manager
- Designer
- Executive
- Team Lead
- Other

Step 3:

"How will you use VoiceGraph?"

Options:

- Meeting notes
- Project updates
- Technical knowledge
- Decisions
- Ideas
- Team documentation

Allow:

[Skip]

Do NOT make onboarding unnecessarily long.


========================================================
18. WORKSPACE MODEL
========================================================

VoiceGraph is an organizational knowledge system.

Support conceptually:

User
 ↓
Workspace
 ↓
Team
 ↓
Knowledge

Every voice note, project, wiki page, task, and graph node belongs
to a workspace.

Do not mix data between workspaces.


========================================================
19. WORKSPACE SWITCHING
========================================================

If a user belongs to multiple workspaces:

Profile
 ↓
Workspace Switcher

Show:

- Workspace name
- Workspace icon
- Current workspace
- Other workspaces

Switching workspace must update all workspace-scoped data.


========================================================
20. USER ROLES
========================================================

Support conceptually:

- Owner
- Admin
- Member

Permissions should be considered when designing:

- Workspace settings
- Member management
- Knowledge deletion
- Workspace deletion

Do not expose administrative actions to normal members.


========================================================
21. MAIN APP STRUCTURE
========================================================

After authentication:

App
├── TopAppBar
├── MainContent
├── FloatingActionButton
└── BottomNavigation

Main tabs:

Home
Inbox
Graph
AI

Additional screens:

- Quick Capture
- Recording
- Audio Preview
- AI Processing
- Voice Note Review
- Wiki
- Project
- Search
- Notifications
- Profile
- Settings


========================================================
22. TOP APP BAR
========================================================

Left:

VoiceGraph logo / page title

Right:

Search icon
Notification icon

Do NOT use a permanent large search bar.

Search opens a dedicated mobile search experience.


========================================================
23. BOTTOM NAVIGATION
========================================================

Exactly four primary tabs:

Home
Inbox
Graph
AI

Icons:

Home
Inbox
Network
Sparkles

Minimum touch target:

44 × 44px.

No hover-dependent functionality.


========================================================
24. QUICK CAPTURE FAB
========================================================

The microphone is the primary action.

Use a large elevated circular microphone FAB.

Recommended:

Bottom-center, slightly above Bottom Navigation.

The FAB opens Quick Capture.


========================================================
25. HOME DASHBOARD
========================================================

Show:

"Hello, Pulok"

Subtext:

"Turn your thoughts into connected knowledge."

Sections:

- Quick Capture
- Recent Projects
- Recent Voice Notes
- Knowledge Updates
- Pending Reviews
- Recent Tasks


========================================================
26. QUICK CAPTURE
========================================================

The user should be able to start recording immediately.

Optional context:

- Project
- Tags
- Note type

Do NOT require context before recording.

The user can simply:

Tap Record
 ↓
Speak
 ↓
Stop


========================================================
27. RECORDING SCREEN
========================================================

Full-screen mobile recording interface.

Show:

- Large microphone
- Animated waveform
- Timer
- Pause
- Resume
- Stop
- Cancel

States:

Idle
Recording
Paused
Stopping
Saved
Failed


========================================================
28. AUDIO PREVIEW
========================================================

After recording:

Show:

- Audio waveform
- Play/Pause
- Seek
- Duration
- Playback speed
- Rename
- Project
- Tags
- Save Draft
- Delete
- Process with AI

Primary:

[Process with AI]


========================================================
29. AI PROCESSING
========================================================

Show meaningful processing stages:

Uploading
 ↓
Transcribing
 ↓
Summarizing
 ↓
Extracting Entities
 ↓
Resolving Entities
 ↓
Detecting Relationships
 ↓
Preparing Review
 ↓
Complete

The user should be able to leave the processing screen.

Processing status should remain visible in Inbox.


========================================================
30. INBOX
========================================================

Inbox contains:

- Processing
- Needs Review
- Approved
- Rejected
- Failed

Filters:

All
Needs Review
Processing
Approved
Failed


========================================================
31. VOICE NOTE REVIEW
========================================================

Show vertically:

Audio Player
Transcript
AI Summary
Entities
Relationships
Confidence
Sources
Actions

Actions:

[Approve]
[Edit]
[Reject]

Primary action:

[Commit to Knowledge]


========================================================
32. AI ENTITY EXTRACTION
========================================================

Recognize:

- People
- Projects
- Topics
- Technologies
- Tasks
- Decisions

Users can:

- Add
- Edit
- Delete


========================================================
33. ENTITY RESOLUTION
========================================================

Detect possible duplicates.

Example:

React
React.js
ReactJS

Show:

"These may refer to the same entity."

Actions:

[Merge]
[Keep Separate]
[Ignore]


========================================================
34. RELATIONSHIP DETECTION
========================================================

AI can suggest:

Project Alpha
   ↓ uses
Firebase

Users can:

- Approve relationship
- Edit relationship
- Delete relationship
- Add relationship


========================================================
35. AI CONFIDENCE
========================================================

Show:

High Confidence
Medium Confidence
Low Confidence

Example:

"Kubernetes — 96%"

Low-confidence information:

"Please verify this information."

Confidence is a review signal, NOT proof of truth.


========================================================
36. HUMAN VERIFICATION
========================================================

AI-generated knowledge must not silently become trusted knowledge.

Users must be able to:

- Approve
- Edit
- Reject

After approval:

Wiki updates
Graph updates
Search data updates
Activity updates


========================================================
37. SOURCE PROVENANCE
========================================================

Every important AI-generated fact should be traceable.

Example:

Project Alpha → uses → Stripe

Source:

Voice Note #128
Speaker: Rahim
Date: Aug 14, 2026
Timestamp: 00:42–01:08
Confidence: 94%

Source states:

- User Provided
- AI Suggested
- Human Verified
- Conflicting
- Outdated


========================================================
38. CONFLICT DETECTION
========================================================

Never silently overwrite conflicting information.

Example:

Previous:
Deadline = September 15

New:
Deadline = September 20

Show:

"Potential Conflict Detected"

Actions:

- Keep Previous
- Accept New
- Compare
- Resolve Manually

Mark unresolved data as:

"Conflicting"


========================================================
39. KNOWLEDGE GRAPH
========================================================

Graph is a core feature.

Mobile graph must NOT display a huge desktop-style graph.

Use focused exploration:

Selected Node
 ↓
Connected Nodes
 ↓
Expand

Support:

- Pan
- Zoom
- Search
- Filter
- Focus
- Expand
- Collapse
- Cluster
- Depth control


========================================================
40. GRAPH NODE TYPES
========================================================

People
Projects
Topics
Technologies
Tasks
Decisions
Voice Notes

Provide a Graph Legend.


========================================================
41. GRAPH RELATIONSHIPS
========================================================

Examples:

Works on
Uses
Related to
Depends on
Created by
Discussed in
Replaced by

Selecting an edge displays:

- Relationship
- Confidence
- Source
- Date


========================================================
42. NODE DETAIL / WIKI
========================================================

Tapping a graph node opens its knowledge page.

Show:

- Name
- Type
- AI Summary
- Key Facts
- People
- Projects
- Technologies
- Tasks
- Decisions
- Related Nodes
- Source Voice Notes
- Timeline
- Last Updated
- Last Verified


========================================================
43. KNOWLEDGE FRESHNESS
========================================================

Display:

Last Updated
Last Verified
Source Date

If potentially outdated:

"This information may be outdated."

Actions:

Review
Keep
Update


========================================================
44. VERSION HISTORY
========================================================

For important knowledge:

Show:

- Previous version
- Current version
- Changed by
- Changed date
- Source

Actions:

Compare
Restore


========================================================
45. AI ASSISTANT
========================================================

Native mobile chat experience.

Show:

- Chat history
- User messages
- AI messages
- Source cards
- Loading state
- Suggested questions
- Text input
- Send button

Input stays above Bottom Navigation.

Keyboard must not cover the input.


========================================================
46. AI ANSWER SOURCES
========================================================

Every factual AI answer should provide relevant sources where available.

Example:

"What is the current status of Project Alpha?"

AI answer:

"Project Alpha is currently in testing."

Sources:

Voice Note #128
Project Alpha Wiki
Voice Note #131

Actions:

Open Source
Open Wiki
Open Graph


========================================================
47. GLOBAL SEARCH
========================================================

Search:

- Voice Notes
- Projects
- People
- Topics
- Technologies
- Tasks
- Decisions
- Wiki

Example query:

"payment problems from last week"

Show categorized results.


========================================================
48. PROJECT VIEW
========================================================

Show:

Project Summary
Status
Team
Recent Updates
Tasks
Decisions
Technologies
Voice Notes
Related Knowledge
Graph Connections
Timeline


========================================================
49. TASKS AND DECISIONS
========================================================

AI can extract tasks.

Task:

- Title
- Owner
- Deadline
- Status
- Source

Decision:

- Decision
- Reason
- Date
- Person/team
- Source


========================================================
50. NOTIFICATIONS
========================================================

Show:

- AI processing complete
- Review required
- Task detected
- Knowledge updated
- Conflict detected
- Mention
- Sync complete
- Sync failed

Actions:

Mark Read
Mark All Read


========================================================
51. PROFILE
========================================================

Profile includes:

- Avatar
- Name
- Email
- Role
- Workspace
- Account status

Actions:

Edit Profile
Workspace
Settings
Log Out


========================================================
52. SETTINGS
========================================================

Sections:

Account
Workspace
AI
Audio
Notifications
Privacy
Security

Include:

Change Password
Email settings
Notification settings
AI preferences
Recording settings
Data controls
Log Out


========================================================
53. LOGOUT
========================================================

Logout must be a real state transition.

Show confirmation:

"Log out of VoiceGraph?"

Actions:

[Cancel]
[Log Out]

After logout:

Clear authenticated application state.

Return to Login/Welcome.

Do not delete user data when logging out.


========================================================
54. SECURITY / PRIVACY UX
========================================================

VoiceGraph stores organizational knowledge.

Design for:

- Authenticated access
- Workspace isolation
- Permission-aware UI
- Secure logout
- Password reset
- Email verification
- Privacy settings

Do NOT display private workspace information to unauthenticated users.

Do not expose passwords or authentication tokens in UI.


========================================================
55. OFFLINE / PWA
========================================================

Support appropriate states:

Online
Offline
Saving Locally
Pending Upload
Syncing
Synced
Sync Failed

Where browser support allows:

Save recordings locally and process them after reconnection.

Do not claim unsupported background behavior.


========================================================
56. RECORDING RECOVERY
========================================================

If recording is interrupted:

"Unfinished recording found."

Actions:

[Resume]
[Save Draft]
[Delete]


========================================================
57. ERROR STATES
========================================================

Create complete error states for:

- Login failure
- Registration failure
- Email verification failure
- Password reset failure
- Microphone permission
- Recording failure
- Upload failure
- Transcription failure
- AI failure
- Network failure
- Search failure
- Graph failure
- AI Assistant failure
- Sync failure


========================================================
58. EMPTY STATES
========================================================

No voice notes:

"Your organizational memory starts here."

[Record Voice Note]

No projects:

"Projects will appear as VoiceGraph learns your workspace."

No graph:

"Your knowledge graph will grow as you capture knowledge."

No search results:

"We couldn't find connected knowledge."


========================================================
59. MOBILE INTERACTION
========================================================

Use:

- Tap
- Swipe
- Long press where appropriate
- Bottom sheets
- Full-screen modals
- Pull-to-refresh where appropriate
- Haptic feedback where supported
- Smooth transitions

Do NOT use hover-dependent interactions.


========================================================
60. SAFE AREA / KEYBOARD
========================================================

Support:

- iPhone notch
- Dynamic Island
- Home indicator
- Android gesture navigation
- Mobile keyboard
- Dynamic viewport

Never allow:

- Bottom navigation to cover content
- Keyboard to cover chat input
- FAB to cover important controls


========================================================
61. ACCESSIBILITY
========================================================

Use:

- aria-labels
- Screen-reader-friendly controls
- Keyboard support where appropriate
- Visible focus
- Good contrast
- Reduced motion
- Minimum 44px touch targets

Never communicate important information through color alone.


========================================================
62. VISUAL DESIGN
========================================================

VoiceGraph should feel:

- Modern
- Calm
- Intelligent
- Professional
- Trustworthy
- Lightweight

The product should feel like:

"A voice recorder on the surface,
and an intelligent organizational memory underneath."


========================================================
63. COLOR SYSTEM
========================================================

Primary:

#111827
#374151
#64748B
#F1F5F9
#F8FAFC
#FFFFFF

Brand:

#6366F1
#4F46E5

Semantic:

Success #16A34A
Warning #F59E0B
Error #DC2626
Info #0EA5E9
AI #8B5CF6


========================================================
64. TYPOGRAPHY
========================================================

Primary:

Inter

Reading:

Source Sans 3

Technical:

JetBrains Mono


========================================================
65. COMPONENT SYSTEM
========================================================

Create reusable components:

AppBar
BottomNavigation
FAB
Button
IconButton
Card
Search
Chip
Tag
Avatar
AudioPlayer
Waveform
RecordingButton
AIStatus
ConfidenceBadge
EntityChip
RelationshipCard
GraphNode
GraphEdge
WikiSection
SourceCard
ChatBubble
ChatInput
BottomSheet
Modal
Toast
Skeleton
EmptyState
ErrorState
NotificationItem
AuthInput
PasswordInput
AuthButton
UserMenu


========================================================
66. COMPONENT STATES
========================================================

Every interactive component:

Default
Pressed
Focus
Disabled
Loading
Success
Error

AI:

Processing
Needs Review
Low Confidence
Verified
Conflicting

Authentication:

Idle
Submitting
Success
Error
Locked/Rate Limited where appropriate


========================================================
67. MOCK DATA
========================================================

Create:

mockUser
mockProjects
mockVoiceNotes
mockEntities
mockRelationships
mockWikiPages
mockTasks
mockDecisions
mockNotifications
mockGraphNodes
mockGraphEdges
mockChatHistory

Also create a mock authentication service:

mockAuthService

Functions conceptually:

login()
register()
logout()
resetPassword()
verifyEmail()
getCurrentUser()


========================================================
68. AUTHENTICATED ROUTING
========================================================

Unauthenticated routes:

/welcome
/login
/register
/forgot-password
/reset-password
/verify-email

Authenticated routes:

/home
/inbox
/graph
/ai
/search
/notifications
/profile
/settings
/wiki/:id
/project/:id
/voice-note/:id

Protect authenticated routes.

If unauthenticated:

Redirect to /login.

If authenticated:

Do not show Login/Register screens.


========================================================
69. CORE USER FLOW — NEW USER
========================================================

App Launch
 ↓
Splash
 ↓
Welcome
 ↓
Create Account
 ↓
Registration
 ↓
Email Verification
 ↓
Workspace Onboarding
 ↓
Home
 ↓
Quick Capture
 ↓
AI Processing
 ↓
Inbox
 ↓
Review
 ↓
Commit
 ↓
Knowledge Graph / Wiki


========================================================
70. CORE USER FLOW — RETURNING USER
========================================================

App Launch
 ↓
Authentication Check
 ↓
Authenticated
 ↓
Home

OR

Authentication Check
 ↓
Unauthenticated
 ↓
Login


========================================================
71. CORE USER FLOW — LOGIN
========================================================

Login
 ↓
Enter Email
 ↓
Enter Password
 ↓
Validate
 ↓
Authenticate
 ↓
Home


========================================================
72. CORE USER FLOW — FORGOT PASSWORD
========================================================

Login
 ↓
Forgot Password
 ↓
Email
 ↓
Send Reset Link
 ↓
Reset Password
 ↓
Login


========================================================
73. CORE USER FLOW — FRICTIONLESS CAPTURE
========================================================

Home
 ↓
FAB
 ↓
Record
 ↓
Stop
 ↓
Audio Preview
 ↓
Process with AI
 ↓
AI Processing
 ↓
Inbox
 ↓
Review
 ↓
Approve
 ↓
Knowledge Updated


========================================================
74. CORE USER FLOW — DISCOVERY
========================================================

Search
 ↓
Project Alpha
 ↓
Wiki
 ↓
Related Knowledge
 ↓
Graph
 ↓
Connected Node
 ↓
Source Voice Note


========================================================
75. CORE USER FLOW — AI ASSISTANT
========================================================

AI
 ↓
Ask Question
 ↓
AI Answer
 ↓
Sources
 ↓
Wiki
 ↓
Graph
 ↓
Source Voice Note


========================================================
76. MVP PRIORITY
========================================================

The following are CORE MVP features:

1. Registration
2. Login
3. Logout
4. Forgot Password UI
5. User Profile
6. Workspace onboarding
7. Home
8. Voice Capture
9. Audio Preview
10. AI Processing simulation
11. Transcription
12. AI Summary
13. Entity Extraction
14. Relationship Suggestions
15. Human Review
16. Knowledge Graph
17. Wiki / Node Detail
18. Source Provenance
19. Search
20. AI Assistant
21. Notifications
22. PWA-ready structure


========================================================
77. ADVANCED FEATURES
========================================================

Prepare architecture for:

- Entity resolution
- Conflict detection
- Version history
- Knowledge freshness
- Multi-speaker transcription
- Offline synchronization
- Semantic search


========================================================
78. FUTURE INTEGRATIONS
========================================================

Do NOT pretend these are implemented.

Future:

- Slack
- Microsoft Teams
- Google Drive
- Notion
- Jira
- GitHub

Display:

"Coming Soon"

if shown in the UI.


========================================================
79. FIGMA DESIGN STRUCTURE
========================================================

Create:

01 Cover
02 Authentication UX
03 Onboarding
04 User Flows
05 Design System
06 Components
07 Home
08 Quick Capture
09 Inbox
10 Voice Review
11 Knowledge Graph
12 Wiki
13 Search
14 AI Assistant
15 Projects
16 Notifications
17 Profile & Settings
18 Edge Cases
19 Responsive States
20 Prototype


========================================================
80. FINAL UX PRINCIPLE
========================================================

The user should NOT feel that they are manually maintaining a database.

The experience must be:

🎙️ Speak
 ↓
🧠 VoiceGraph Understands
 ↓
🔍 User Reviews
 ↓
✅ User Verifies
 ↓
🕸️ Knowledge Connects
 ↓
📚 Wiki Updates
 ↓
🤖 AI Answers
 ↓
🔎 User Discovers


FINAL PRODUCT STATEMENT:

"VoiceGraph turns the things your team says
into the knowledge your organization remembers."


========================================================
81. FINAL IMPLEMENTATION RULES
========================================================

Prioritize:

1. Correct navigation
2. Correct authentication state
3. Correct mobile layout
4. Correct recording flow
5. Correct AI review flow
6. Correct graph/wiki relationship
7. Correct source provenance
8. Correct error handling
9. Correct responsive behavior
10. Clean reusable code

Do not add unnecessary screens.

Do not create duplicate functionality.

Do not create desktop UI patterns inside the mobile application.

Do not make the user manually create graph nodes after every recording.

Do not silently commit AI-generated knowledge.

Do not silently overwrite conflicting information.

Do not lose recordings because of navigation or temporary errors.

Do not allow unauthenticated users to access private workspace data.

The application should be polished, coherent, mobile-first, accessible,
PWA-ready, and architected so that mock services can later be replaced
with real backend APIs.