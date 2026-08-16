import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Bell, Home, Inbox, Network, Sparkles, X, Play, Square, 
  Folder, ChevronRight, Clock, CheckCircle2, ChevronLeft, 
  User as UserIcon, Check, FileText, Database, Cpu, Send, Tag,
  Moon, Sun
} from 'lucide-react';

// --- MOCK DATA ENGINE ---
const mockUser = {
  id: "u_1", name: "Mahmudul Hasan Pulok", email: "pulok@voicegraph.app", role: "Product Team"
};

const mockProjects = [
  { id: 'p_1', name: 'Project Alpha', status: 'Active', updates: 12, color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700', iconColor: 'text-indigo-600' },
  { id: 'p_2', name: 'Mobile App Redesign', status: 'Planning', updates: 5, color: 'bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 text-fuchsia-700', iconColor: 'text-fuchsia-600' },
  { id: 'p_3', name: 'Q3 Marketing', status: 'Review', updates: 8, color: 'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700', iconColor: 'text-rose-600' }
];

const initialVoiceNotes = [
  { 
    id: 'vn_1', title: 'Weekly Sync Summary', duration: '04:12', date: 'Today, 10:30 AM', status: 'review', project: 'Project Alpha',
    transcript: "So for Project Alpha, we are migrating the database to Postgres next week. Pulok is leading the schema design. We need to ensure zero downtime.",
    summary: "Database migration to Postgres planned for next week under Pulok's leadership. Requirement: zero downtime.",
    entities: [{ type: 'Project', name: 'Project Alpha' }, { type: 'Person', name: 'Pulok' }, { type: 'Tech', name: 'Postgres' }],
    confidence: 94
  },
  { 
    id: 'vn_2', title: 'Design Feedback', duration: '01:45', date: 'Yesterday', status: 'processed', project: 'Mobile App Redesign',
    transcript: "The new mobile designs look great, but the bottom navigation touch targets are too small. Let's increase them to 44px.",
    summary: "Bottom navigation touch targets need to be increased to 44px for better accessibility.",
    entities: [{ type: 'Project', name: 'Mobile App Redesign' }, { type: 'Topic', name: 'Accessibility' }],
    confidence: 98
  }
];

const getNodeColors = (isDark: boolean): Record<string, {bg: string, text: string, border: string, iconBg: string, ring: string}> => ({
  'Project': { bg: isDark ? 'bg-fuchsia-900/30' : 'bg-fuchsia-50', text: isDark ? 'text-fuchsia-300' : 'text-fuchsia-700', border: isDark ? 'border-fuchsia-700/50' : 'border-fuchsia-500', iconBg: isDark ? 'bg-fuchsia-800/50' : 'bg-fuchsia-100', ring: isDark ? 'ring-fuchsia-400' : 'ring-fuchsia-500' },
  'Person': { bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50', text: isDark ? 'text-amber-300' : 'text-amber-700', border: isDark ? 'border-amber-700/50' : 'border-amber-500', iconBg: isDark ? 'bg-amber-800/50' : 'bg-amber-100', ring: isDark ? 'ring-amber-400' : 'ring-amber-500' },
  'Topic': { bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50', text: isDark ? 'text-emerald-300' : 'text-emerald-700', border: isDark ? 'border-emerald-700/50' : 'border-emerald-500', iconBg: isDark ? 'bg-emerald-800/50' : 'bg-emerald-100', ring: isDark ? 'ring-emerald-400' : 'ring-emerald-500' },
  'Technology': { bg: isDark ? 'bg-cyan-900/30' : 'bg-cyan-50', text: isDark ? 'text-cyan-300' : 'text-cyan-700', border: isDark ? 'border-cyan-700/50' : 'border-cyan-500', iconBg: isDark ? 'bg-cyan-800/50' : 'bg-cyan-100', ring: isDark ? 'ring-cyan-400' : 'ring-cyan-500' },
  'Default': { bg: isDark ? 'bg-indigo-900/30' : 'bg-indigo-50', text: isDark ? 'text-indigo-300' : 'text-indigo-700', border: isDark ? 'border-indigo-700/50' : 'border-indigo-500', iconBg: isDark ? 'bg-indigo-800/50' : 'bg-indigo-100', ring: isDark ? 'ring-indigo-400' : 'ring-indigo-500' }
});

const mockGraphNodes = [
  { id: 'n_1', name: 'Project Alpha', type: 'Project', summary: 'A critical backend initiative focused on migrating the core database to Postgres with a strict zero-downtime requirement.', connections: ['Postgres', 'Pulok'], source: 'vn_1' },
  { id: 'n_2', name: 'Postgres', type: 'Technology', summary: 'The selected relational database technology for the Project Alpha backend migration.', connections: ['Project Alpha'], source: 'vn_1' },
  { id: 'n_3', name: 'Mobile App Redesign', type: 'Project', summary: 'An ongoing UI/UX initiative to overhaul the mobile experience, currently focusing on improving accessibility and touch targets.', connections: ['Accessibility'], source: 'vn_2' },
  { id: 'n_4', name: 'Pulok', type: 'Person', summary: 'Lead Engineer responsible for the database schema design and execution of the Postgres migration for Project Alpha.', connections: ['Project Alpha', 'Postgres'], source: 'vn_1' },
  { id: 'n_5', name: 'Accessibility', type: 'Topic', summary: 'Design standards and implementation guidelines focusing on inclusive UX, specifically ensuring minimum 44px touch targets on mobile devices.', connections: ['Mobile App Redesign'], source: 'vn_2' }
];

const nodePositions: Record<string, {x: number, y: number}> = {
  'Project Alpha': { x: 50, y: 25 },
  'Postgres': { x: 20, y: 55 },
  'Pulok': { x: 80, y: 55 },
  'Mobile App Redesign': { x: 30, y: 85 },
  'Accessibility': { x: 70, y: 85 }
};

const graphEdges = [
  { source: 'Project Alpha', target: 'Pulok', label: 'LEAD BY' },
  { source: 'Project Alpha', target: 'Postgres', label: 'USES' },
  { source: 'Mobile App Redesign', target: 'Accessibility', label: 'IMPROVES' }
];

type AppView = 'splash' | 'home' | 'inbox' | 'graph' | 'ai' | 'notifications' | 'profile';
type RecordingState = 'idle' | 'recording' | 'saving';

export default function VoiceGraphApp() {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [authEmail, setAuthEmail] = useState('pulok@gmail.com');
  const [authPassword, setAuthPassword] = useState('12345678');
  const [authName, setAuthName] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const activeNodeColors = getNodeColors(isDarkMode);

  const [view, setView] = useState<AppView>('home');
  const [user, setUser] = useState<typeof mockUser | null>(null);
  
  const [voiceNotes, setVoiceNotes] = useState(initialVoiceNotes);
  const [selectedNote, setSelectedNote] = useState<typeof initialVoiceNotes[0] | null>(null);
  const [selectedNode, setSelectedNode] = useState<typeof mockGraphNodes[0] | null>(null);
  
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', text: string, source?: string}[]>([
    { role: 'ai', text: "Hello! I'm your VoiceGraph assistant. Ask me anything about your organization's knowledge." }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState === 'recording') {
      interval = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  useEffect(() => {
    if (view === 'ai') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, view]);

  // --- HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail === 'pulok@gmail.com' && authPassword === '12345678') {
      setIsAuthenticated(true);
      setUser(mockUser);
      setAuthError('');
    } else {
      setAuthError('Invalid email or password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setUser({ ...mockUser, name: authName || mockUser.name, email: authEmail || mockUser.email });
    setAuthError('');
  };

  const handleStopRecording = () => {
    setRecordingState('saving');
    setTimeout(() => {
      const newNote = {
        id: `vn_${Date.now()}`, title: 'New Voice Note', duration: `00:${recordingTime.toString().padStart(2, '0')}`,
        date: 'Just now', status: 'review', project: null,
        transcript: "Simulated transcription of the new voice note about the upcoming marketing changes.",
        summary: "Upcoming marketing changes discussed.",
        entities: [{ type: 'Topic', name: 'Marketing' }], confidence: 85
      };
      setVoiceNotes([newNote, ...voiceNotes]);
      setRecordingState('idle'); setIsCapturing(false); setView('inbox');
    }, 1500);
  };

  const handleApproveNote = (id: string) => {
    setVoiceNotes(notes => notes.map(n => n.id === id ? { ...n, status: 'processed' } : n));
    setSelectedNote(null);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    
    setTimeout(() => {
      let reply = "I found some information in your knowledge graph.";
      let source = undefined;
      
      if (query.includes('alpha') || query.includes('database')) {
        reply = "Project Alpha is migrating the database to Postgres next week. Pulok is leading the schema design.";
        source = "Weekly Sync Summary (Voice Note)";
      } else if (query.includes('design') || query.includes('mobile')) {
        reply = "The bottom navigation touch targets are being increased to 44px for better accessibility.";
        source = "Design Feedback (Voice Note)";
      }
      
      setChatMessages(prev => [...prev, { role: 'ai', text: reply, source }]);
    }, 1000);
  };

  // --- RENDERERS ---
  if (showSplash) {
    return (
      <div className={`w-full max-w-[430px] h-screen max-h-[850px] mx-auto relative overflow-hidden shadow-2xl flex flex-col font-sans ${isDarkMode ? 'dark-theme bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white p-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(168,85,247,0.5)] animate-pulse">
            <Mic size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">VoiceGraph</h1>
          <p className="text-indigo-200 text-center text-lg font-medium">Turn your voice into organizational knowledge.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`w-full max-w-[430px] h-screen max-h-[850px] mx-auto relative overflow-hidden shadow-2xl flex flex-col font-sans ${isDarkMode ? 'dark-theme bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
        <div className="flex-1 flex flex-col p-8 bg-white justify-center">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-[28px] flex items-center justify-center mb-6 shadow-xl shadow-fuchsia-500/30 transform rotate-3">
              <Mic size={40} className="text-white transform -rotate-3" />
            </div>
            <h1 className="text-3xl font-black text-[#111827] mb-2">{authScreen === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-slate-500 text-center text-sm font-medium">
              {authScreen === 'login' ? 'Log in to continue to VoiceGraph' : 'Join VoiceGraph to start capturing knowledge'}
            </p>
          </div>
          
          <form onSubmit={authScreen === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-200">
                {authError}
              </div>
            )}
            
            {authScreen === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" required
                  value={authName} onChange={e => setAuthName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium"
                  placeholder="Mahmudul Hasan Pulok"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" required
                value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium"
                placeholder={authScreen === 'login' ? "pulok@gmail.com" : "you@example.com"}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" required
                value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 active:scale-95 transition-all mt-4 hover:shadow-indigo-500/50">
              {authScreen === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => {
                setAuthScreen(authScreen === 'login' ? 'register' : 'login');
                setAuthError('');
              }} 
              className="text-sm font-medium text-slate-500 hover:text-[#111827] transition-colors"
            >
              {authScreen === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-[430px] h-screen max-h-[850px] mx-auto relative overflow-hidden shadow-2xl flex flex-col font-sans ${isDarkMode ? 'dark-theme bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
        
        {/* MAIN SHELL */}
        {user && (
          <>
            <header className="flex-none h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-md">
                  <Mic size={18} className="text-white" />
                </div>
                <span className="font-black text-[#111827] tracking-tight text-lg">VoiceGraph</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setView('notifications')} className="text-slate-500 hover:text-indigo-600 transition-colors">
                  <Bell size={22} />
                </button>
                <button onClick={() => setView('profile')} className="w-8 h-8 bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-rose-500 rounded-full flex items-center justify-center shadow-md shadow-fuchsia-500/30 hover:scale-105 active:scale-95 transition-all">
                  <span className="text-sm font-bold text-white drop-shadow-sm">{user.name.charAt(0)}</span>
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto relative pb-24 hide-scrollbar">
              
              {/* HOME */}
              {view === 'home' && (
                <div className="flex flex-col pb-8">
                  <div className="px-6 pt-6 pb-4">
                    <h2 className="text-2xl font-bold text-[#111827] mb-1">Hello, {user.name.split(' ')[0]}</h2>
                    <p className="text-slate-500 text-sm">Turn your thoughts into connected knowledge.</p>
                  </div>
                  
                  <div className="mt-2">
                    <div className="px-6 flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-[#111827]">Recent Projects</h3>
                      <button className="text-xs font-bold text-indigo-500 hover:text-indigo-400">View All</button>
                    </div>
                    <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x hide-scrollbar">
                      {mockProjects.map(p => {
                        let dynamicColor, dynamicIconColor;
                        if (p.id === 'p_1') {
                          dynamicColor = isDarkMode ? 'bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 text-indigo-300 border-indigo-800' : 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700';
                          dynamicIconColor = isDarkMode ? 'text-indigo-400' : 'text-indigo-600';
                        } else if (p.id === 'p_2') {
                          dynamicColor = isDarkMode ? 'bg-gradient-to-br from-fuchsia-900/40 to-fuchsia-800/40 text-fuchsia-300 border-fuchsia-800' : 'bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 text-fuchsia-700';
                          dynamicIconColor = isDarkMode ? 'text-fuchsia-400' : 'text-fuchsia-600';
                        } else {
                          dynamicColor = isDarkMode ? 'bg-gradient-to-br from-rose-900/40 to-rose-800/40 text-rose-300 border-rose-800' : 'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700';
                          dynamicIconColor = isDarkMode ? 'text-rose-400' : 'text-rose-600';
                        }
                        
                        return (
                          <div key={p.id} className={`snap-start shrink-0 w-[240px] bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="flex justify-between mb-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${dynamicColor}`}><Folder size={24} className={dynamicIconColor} /></div>
                              <span className={`text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} px-3 py-1.5 rounded-full h-7 flex items-center`}>{p.status}</span>
                            </div>
                            <h4 className="font-bold text-[#111827] text-base">{p.name}</h4>
                            <p className="text-xs font-medium text-slate-500 mt-1">{p.updates} new updates</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="px-6 mt-2 mb-6">
                    <div onClick={() => setView('inbox')} className={`border rounded-3xl p-5 flex justify-between items-center cursor-pointer active:scale-95 transition-all hover:shadow-md ${isDarkMode ? 'bg-gradient-to-r from-orange-900/40 to-amber-900/40 border-orange-900/50' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 text-white rounded-full flex items-center justify-center shadow-md shadow-orange-500/30"><Clock size={24} /></div>
                        <div>
                          <h4 className={`font-bold text-base ${isDarkMode ? 'text-orange-300' : 'text-orange-950'}`}>{voiceNotes.filter(n=>n.status==='review').length} notes need review</h4>
                          <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-orange-400/80' : 'text-orange-700/80'}`}>Approve AI extracted knowledge</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-orange-400" />
                    </div>
                  </div>

                  <div className="px-6">
                    <h3 className="font-semibold text-[#111827] mb-4">Recent Notes</h3>
                    <div className="flex flex-col gap-3">
                      {voiceNotes.slice(0,3).map(note => (
                        <div key={note.id} onClick={() => {setSelectedNote(note); setView('inbox');}} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md active:scale-95 transition-all">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${note.status==='review' ? (isDarkMode ? 'bg-gradient-to-br from-orange-900/50 to-amber-900/50' : 'bg-gradient-to-br from-orange-100 to-amber-100') : (isDarkMode ? 'bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/50' : 'bg-gradient-to-br from-indigo-50 to-fuchsia-50')}`}>
                            {note.status === 'review' ? <Clock size={20} className="text-orange-500" /> : <Play size={20} className="text-indigo-500 ml-1" />}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-bold text-[#111827] text-sm truncate">{note.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-slate-500">
                              <span>{note.duration}</span><span className="w-1 h-1 bg-slate-300 rounded-full"></span><span>{note.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* INBOX & REVIEW */}
              {view === 'inbox' && !selectedNote && (
                <div className="p-6">
                  <h2 className="text-2xl font-black text-[#111827] mb-6 tracking-tight">Inbox</h2>
                  <div className="flex flex-col gap-3">
                    {voiceNotes.map(note => (
                      <div key={note.id} onClick={() => setSelectedNote(note)} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4 items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${note.status==='review' ? (isDarkMode ? 'bg-gradient-to-br from-orange-900/50 to-amber-900/50 text-orange-400' : 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600') : (isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-teal-900/50 text-emerald-400' : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600')}`}>
                              {note.status === 'review' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#111827] text-sm">{note.title}</h4>
                              <p className="text-xs font-medium text-slate-500 mt-1">{note.duration} • {note.date}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${note.status==='review' ? (isDarkMode ? 'bg-orange-900/40 text-orange-300 border-orange-800' : 'bg-orange-50 text-orange-600 border-orange-200') : (isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-600 border-emerald-200')}`}>
                            {note.status === 'review' ? 'Needs Review' : 'Committed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INBOX DETAIL (Voice Note Review) */}
              {view === 'inbox' && selectedNote && (
                <div className="bg-white min-h-full flex flex-col absolute inset-0 z-20 animate-in slide-in-from-right-8">
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <button onClick={() => setSelectedNote(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-100"><ChevronLeft size={24} /></button>
                    <h3 className="font-bold text-lg truncate">Review Note</h3>
                  </div>
                  <div className="p-6 flex-1 overflow-y-auto pb-32">
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-slate-100 shadow-sm">
                      <button className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"><Play size={20} className="ml-1" /></button>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" /></div>
                        <div className="flex justify-between text-xs font-medium text-slate-500 mt-2"><span>01:24</span><span>{selectedNote.duration}</span></div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Summary</h4>
                      <p className="text-sm text-[#111827] leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">{selectedNote.summary}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Entities</h4>
                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{selectedNote.confidence}% Confidence</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.entities?.map((e, i) => {
                          const colors = activeNodeColors[e.type] || activeNodeColors['Default'];
                          return (
                            <div key={i} className={`flex items-center gap-1.5 ${colors.bg} border ${colors.border} px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium`}>
                              <Tag size={12} className={colors.text} /> <span className={colors.text}>{e.name}</span> <span className={`${colors.text} opacity-70 font-normal ml-1`}>({e.type})</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transcript</h4>
                      <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-4">{selectedNote.transcript}</p>
                    </div>
                  </div>

                  {selectedNote.status === 'review' && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-30">
                      <button onClick={() => setSelectedNote(null)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">Reject</button>
                      <button onClick={() => handleApproveNote(selectedNote.id)} className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 transition-all">
                        <Check size={18} /> Commit to Knowledge
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* GRAPH & WIKI */}
              {view === 'graph' && !selectedNode && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#111827] mb-6">Knowledge Graph</h2>
                  
                  {/* Graphical Visualization */}
                  <div className={`relative w-full h-[280px] border rounded-3xl mb-8 overflow-hidden shadow-inner ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-indigo-950/30 border-slate-700' : 'bg-gradient-to-br from-slate-50 to-indigo-50/30 border-slate-200'}`}>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker id="arrow" markerWidth="12" markerHeight="12" refX="34" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                          <path d="M 0 0 L 12 6 L 0 12 z" fill={isDarkMode ? '#475569' : '#94a3b8'} />
                        </marker>
                      </defs>
                      {graphEdges.map((edge, i) => {
                        const source = nodePositions[edge.source];
                        const target = nodePositions[edge.target];
                        if (source && target) {
                          return (
                            <line 
                              key={`edge-${i}`} 
                              x1={`${source.x}%`} y1={`${source.y}%`} 
                              x2={`${target.x}%`} y2={`${target.y}%`} 
                              stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="2.5" strokeDasharray="4 4"
                              markerEnd="url(#arrow)"
                              className="animate-pulse"
                            />
                          );
                        }
                        return null;
                      })}
                    </svg>
                    {graphEdges.map((edge, i) => {
                      const source = nodePositions[edge.source];
                      const target = nodePositions[edge.target];
                      if (!source || !target) return null;
                      return (
                        <div 
                          key={`label-${i}`}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border text-[9px] font-bold uppercase tracking-widest z-10 pointer-events-none ${isDarkMode ? 'bg-slate-800/90 border-slate-700 text-slate-400' : 'bg-white/90 border-slate-200 text-slate-500'}`}
                          style={{ left: `${(source.x + target.x) / 2}%`, top: `${(source.y + target.y) / 2}%` }}
                        >
                          {edge.label}
                        </div>
                      );
                    })}
                    {mockGraphNodes.map(node => {
                      const pos = nodePositions[node.name];
                      if (!pos) return null;
                      const colors = activeNodeColors[node.type] || activeNodeColors['Default'];
                      return (
                        <div 
                          key={`vis-${node.id}`} 
                          onClick={() => setSelectedNode(node)} 
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center group z-20" 
                          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                          <div className={`w-12 h-12 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center ${colors.text} shadow-md group-hover:scale-110 transition-transform group-hover:ring-4 group-hover:${colors.ring} group-hover:ring-opacity-50`}>
                            {node.type === 'Project' ? <Folder size={18} /> : node.type === 'Person' ? <UserIcon size={18} /> : node.type === 'Topic' ? <Tag size={18} /> : <Database size={18} />}
                          </div>
                          <span className={`mt-1.5 text-[10px] font-bold ${colors.text} ${isDarkMode ? 'bg-slate-800' : 'bg-white/95'} px-2 py-0.5 rounded-md shadow-sm border ${colors.border}`}>{node.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  <h3 className="font-bold text-[#111827] mb-3">All Nodes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mockGraphNodes.map(node => {
                      const colors = activeNodeColors[node.type] || activeNodeColors['Default'];
                      return (
                        <div key={node.id} onClick={() => setSelectedNode(node)} className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm cursor-pointer hover:${colors.border} hover:shadow-md transition-all`}>
                          <div className={`w-8 h-8 rounded-lg ${colors.iconBg} ${colors.text} flex items-center justify-center mb-3`}>
                            {node.type === 'Project' ? <Folder size={16} /> : node.type === 'Person' ? <UserIcon size={16} /> : node.type === 'Topic' ? <Tag size={16} /> : <Database size={16} />}
                          </div>
                          <h4 className="font-bold text-sm text-[#111827] truncate">{node.name}</h4>
                          <p className={`text-[10px] font-medium mt-1 ${colors.text}`}>{node.type}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WIKI DETAIL */}
              {view === 'graph' && selectedNode && (
                <div className="bg-[#F8FAFC] min-h-full flex flex-col absolute inset-0 z-20 animate-in slide-in-from-right-8">
                  <div className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center gap-3 sticky top-0 z-30">
                    <button onClick={() => setSelectedNode(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"><ChevronLeft size={24} /></button>
                    <h3 className="font-black text-lg tracking-tight">Wiki</h3>
                  </div>
                  <div className="p-6 overflow-y-auto pb-32">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${activeNodeColors[selectedNode.type]?.iconBg || activeNodeColors['Default'].iconBg} ${activeNodeColors[selectedNode.type]?.text || activeNodeColors['Default'].text} flex items-center justify-center shadow-sm`}><Network size={28} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-[#111827] tracking-tight">{selectedNode.name}</h2>
                        <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${activeNodeColors[selectedNode.type]?.bg || activeNodeColors['Default'].bg} ${activeNodeColors[selectedNode.type]?.text || activeNodeColors['Default'].text} ${activeNodeColors[selectedNode.type]?.border || activeNodeColors['Default'].border}`}>{selectedNode.type}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Knowledge Summary</h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{selectedNode.summary}</p>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Connected Nodes</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedNode.connections.map(c => {
                          const connectedNode = mockGraphNodes.find(n => n.name === c);
                          const colors = connectedNode ? (activeNodeColors[connectedNode.type] || activeNodeColors['Default']) : { bg: isDarkMode ? 'bg-slate-800' : 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
                          
                          return (
                            <button 
                              key={c}
                              onClick={() => connectedNode && setSelectedNode(connectedNode)}
                              className={`text-xs border px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${connectedNode ? `${colors.bg} ${colors.text} ${colors.border} cursor-pointer hover:shadow-md active:scale-95` : `border-slate-200 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} text-slate-500`}`}
                            >
                              <Network size={14} className={connectedNode ? colors.text : 'text-slate-500'} />
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`rounded-3xl p-5 border shadow-sm ${isDarkMode ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}>
                      <h4 className={`text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}><FileText size={14}/> Source Provenance</h4>
                      <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>This knowledge was extracted from: <br/><strong className={`font-bold underline cursor-pointer mt-1 inline-block ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{voiceNotes.find(v=>v.id===selectedNode.source)?.title || 'Voice Note'}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI ASSISTANT */}
              {view === 'ai' && (
                <div className="flex flex-col h-full absolute inset-0 z-10 bg-white">
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white/90 backdrop-blur-sm z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-purple-500 rounded-full flex items-center justify-center text-white"><Sparkles size={16} /></div>
                    <div>
                      <h3 className="font-bold text-sm text-[#111827]">VoiceGraph AI</h3>
                      <p className="text-[10px] text-slate-500">Connected to your workspace</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-32">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                        {msg.source && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 shadow-sm">
                            <FileText size={10} /> Source: {msg.source}
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="absolute bottom-20 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-10">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1.5 pl-5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-inner">
                      <input 
                        type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                        placeholder="Ask about your knowledge..." 
                        className="flex-1 bg-transparent text-sm outline-none placeholder-slate-400 font-medium"
                      />
                      <button onClick={handleSendChat} className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all hover:shadow-lg hover:shadow-fuchsia-500/30">
                        <Send size={16} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {view === 'notifications' && (
                <div className="p-6 flex flex-col h-full bg-[#F8FAFC]">
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setView('home')} className="p-2 -ml-2 rounded-full hover:bg-slate-200"><ChevronLeft size={24} /></button>
                    <h2 className="text-2xl font-bold text-[#111827]">Notifications</h2>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <Bell size={48} className="mb-4 text-slate-300" />
                    <p className="text-sm">You have no new notifications.</p>
                  </div>
                </div>
              )}

              {/* PROFILE */}
              {view === 'profile' && (
                <div className="p-6 flex flex-col h-full bg-[#F8FAFC]">
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setView('home')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors"><ChevronLeft size={24} /></button>
                    <h2 className="text-2xl font-black text-[#111827] tracking-tight">Profile</h2>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-fuchsia-50/50 pointer-events-none" />
                    <div className="w-24 h-24 bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-[0_0_30px_rgba(217,70,239,0.4)] relative z-10 border-2 border-white/20">
                      {user.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-[#111827] relative z-10">{user.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium relative z-10">{user.email}</p>
                    <div className="mt-5 relative z-10">
                      <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-xs font-bold rounded-full shadow-sm">{user.role}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                        {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                      </div>
                      <span className="font-bold text-[#111827] text-base">Dark Mode</span>
                    </div>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors shadow-inner ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  
                  <div className="mt-auto">
                    <button onClick={() => { setIsAuthenticated(false); setAuthEmail(''); setAuthPassword(''); setView('home'); }} className="w-full py-4 bg-gradient-to-r from-rose-50 to-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-50 active:scale-95 transition-all shadow-sm">
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </main>

            {/* QUICK CAPTURE OVERLAY */}
            {isCapturing && (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-fuchsia-950 z-50 flex flex-col text-white animate-in slide-in-from-bottom-full duration-300">
                <div className="flex justify-end p-6">
                  <button onClick={() => {setRecordingState('idle'); setIsCapturing(false);}} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center pb-20">
                  {recordingState === 'idle' && (
                    <><h3 className="text-2xl font-black mb-12 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Ready to record</h3>
                      <button onClick={() => setRecordingState('recording')} className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all"><Mic size={56} /></button>
                      <p className="mt-8 text-indigo-200 font-medium text-sm">Tap to start</p></>
                  )}
                  {recordingState === 'recording' && (
                    <><h3 className="text-5xl font-black mb-12 tabular-nums tracking-tight">00:{recordingTime.toString().padStart(2, '0')}</h3>
                      <div className="flex gap-1 mb-16 h-16 items-center">
                        {[...Array(15)].map((_, i) => <div key={i} className="w-2 bg-gradient-to-t from-indigo-400 to-fuchsia-400 rounded-full animate-pulse" style={{ height: `${Math.max(20, Math.random()*100)}%`, animationDuration: `${0.5 + Math.random()*0.5}s`}}/>)}
                      </div>
                      <button onClick={handleStopRecording} className="w-24 h-24 bg-gradient-to-tr from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all"><Square size={32} className="text-white fill-current" /></button>
                      <p className="mt-8 text-indigo-200 font-medium text-sm">Tap to stop</p></>
                  )}
                  {recordingState === 'saving' && (
                    <div className="flex flex-col items-center"><div className="w-20 h-20 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-8" /><h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Processing Voice Note...</h3></div>
                  )}
                </div>
              </div>
            )}

            {/* FAB */}
            {view !== 'ai' && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40">
                <button onClick={() => setIsCapturing(true)} className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(168,85,247,0.4)] hover:scale-105 hover:shadow-[0_8px_40px_rgba(168,85,247,0.6)] active:scale-95 transition-all"><Mic size={28} /></button>
              </div>
            )}

            {/* BOTTOM NAV */}
            <nav className="flex-none h-20 bg-white border-t border-slate-200 flex justify-around items-center px-2 pb-4 z-30">
              <NavButton icon={<Home size={24}/>} label="Home" isActive={view === 'home'} onClick={() => {setView('home'); setSelectedNote(null); setSelectedNode(null);}} />
              <NavButton icon={<Inbox size={24}/>} label="Inbox" isActive={view === 'inbox'} onClick={() => {setView('inbox'); setSelectedNode(null);}} />
              <div className="w-16" /> {/* FAB Spacer */}
              <NavButton icon={<Network size={24}/>} label="Graph" isActive={view === 'graph'} onClick={() => {setView('graph'); setSelectedNote(null);}} />
              <NavButton icon={<Sparkles size={24}/>} label="AI" isActive={view === 'ai'} onClick={() => {setView('ai'); setSelectedNote(null); setSelectedNode(null);}} />
            </nav>
          </>
        )}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; } 
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ${isDarkMode ? `
          .dark-theme { background-color: #0f172a !important; color: #f8fafc !important; }
          .dark-theme .bg-white { background-color: #1e293b !important; }
          .dark-theme .bg-slate-50, .dark-theme .bg-\\[\\#F8FAFC\\] { background-color: #0f172a !important; }
          .dark-theme .text-\\[\\#111827\\] { color: #f8fafc !important; }
          .dark-theme .text-slate-800 { color: #f1f5f9 !important; }
          .dark-theme .text-slate-700 { color: #e2e8f0 !important; }
          .dark-theme .text-slate-600 { color: #cbd5e1 !important; }
          .dark-theme .text-slate-500 { color: #94a3b8 !important; }
          .dark-theme .border-slate-200 { border-color: #334155 !important; }
          .dark-theme .border-slate-100 { border-color: #1e293b !important; }
          .dark-theme .bg-white\\/90 { background-color: rgba(30, 41, 59, 0.9) !important; }
          .dark-theme .bg-slate-100 { background-color: #334155 !important; }
        ` : ''}
      `}</style>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 h-full transition-all ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
      <div className={`mb-1 transition-transform ${isActive ? 'scale-110 drop-shadow-md' : 'scale-100'}`}>{icon}</div>
      <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}