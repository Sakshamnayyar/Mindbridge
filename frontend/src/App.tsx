import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useVoiceRecorder } from './hooks/use-voice-recorder';
import TherapistsPage from './components/TherapistsPage';

const API_URL = import.meta.env.VITE_API_URL || '';
const SESSION_ID = 'voice_' + Date.now();

type Stage =
  | 'greeting'
  | 'check_in'
  | 'understanding'
  | 'exploring'
  | 'context'
  | 'assessment'
  | 'privacy'
  | 'specialist_selection'
  | 'time_slots'
  | 'matching'
  | 'matched'
  | 'post_match'
  | 'habit_tracker'
  | 'experience'
  | 'ended';

type PrivacyTier = 'full_support' | 'assisted_handoff' | 'your_private_notes' | 'no_records';
type ActiveTab = 'chat' | 'habits' | 'schedule';

type HabitEntry = {
  id: number;
  title: string;
  description: string;
  streak: number;
  completedToday: boolean;
};

type SessionEntry = {
  id: number;
  therapist: string;
  specialization: string;
  datetime: string;
  status: 'scheduled' | 'pending';
  notes?: string;
};

type AgentActivity = {
  id: string;
  agent: string;
  label: string;
  status: 'thinking' | 'tool' | 'done';
};

const STAGE_BADGES: Record<Stage, { label: string; emoji: string }> = {
  greeting: { emoji: '👋', label: 'Greeting' },
  check_in: { emoji: '💭', label: 'Check-in' },
  understanding: { emoji: '🗨️', label: 'Understanding' },
  exploring: { emoji: '🔍', label: 'Exploring' },
  context: { emoji: '📋', label: 'Context' },
  assessment: { emoji: '🎯', label: 'Assessment' },
  privacy: { emoji: '🔒', label: 'Privacy Selection' },
  specialist_selection: { emoji: '🧑‍⚕️', label: 'Meet the Right Specialist' },
  time_slots: { emoji: '🗓️', label: 'Pick a Time' },
  matching: { emoji: '🔍', label: 'Matching Therapist' },
  matched: { emoji: '✅', label: 'Invite Sent' },
  post_match: { emoji: '➡️', label: 'Next Steps' },
  habit_tracker: { emoji: '📋', label: 'Habit Ideas' },
  experience: { emoji: '💬', label: 'Share Experience' },
  ended: { emoji: '💙', label: 'Session Ended' },
};

const PRIVACY_OPTIONS: Record<PrivacyTier, { label: string; description: string }> = {
  full_support: {
    label: 'Full Support',
    description: 'AI can stay with you the whole way, keeping helpful notes and reminders.',
  },
  assisted_handoff: {
    label: 'Assisted Handoff',
    description: 'We’ll help connect you to a therapist and smooth the transitions.',
  },
  your_private_notes: {
    label: 'Your Private Notes',
    description: 'We keep high-level notes while you stay in control of the details.',
  },
  no_records: {
    label: 'No Records',
    description: 'Totally private—nothing saved, just this conversation.',
  },
};

const SPECIALIST_OPTIONS = [
  {
    key: 'career',
    title: 'Career Counselor',
    description: 'Great for balancing work, school, and long-term goals.',
  },
  {
    key: 'marriage',
    title: 'Marriage & Relationship Counselor',
    description: 'Supports communication, family dynamics, and emotional connection.',
  },
  {
    key: 'adhd',
    title: 'ADHD Specialist',
    description: 'Helps with focus, routines, and executive function strategies.',
  },
  {
    key: 'depression',
    title: 'Depression Therapist',
    description: 'Guides you through low mood, burnout, and feeling stuck.',
  },
] as const;

type SpecialistKey = (typeof SPECIALIST_OPTIONS)[number]['key'];

const AVAILABLE_TIME_SLOTS = [
  'Tuesday • 6:30 PM',
  'Wednesday • 7:15 PM',
  'Thursday • 8:00 PM',
  'Saturday • 10:30 AM',
] as const;

const DEFAULT_HABITS: HabitEntry[] = [
  {
    id: 1,
    title: 'Two-minute breathing reset',
    description: 'Pause mid-day to release tension from stacked commitments.',
    streak: 3,
    completedToday: false,
  },
  {
    id: 2,
    title: 'Evening brain dump',
    description: 'Clear your mind before bed by jotting down tasks and worries.',
    streak: 2,
    completedToday: false,
  },
  {
    id: 3,
    title: 'Walk-and-reset',
    description: 'Take a 15-minute walk after work to transition into study mode.',
    streak: 4,
    completedToday: false,
  },
  {
    id: 4,
    title: 'Next-day micro plan',
    description: 'Set three priority actions for tomorrow before you log off.',
    streak: 1,
    completedToday: false,
  },
];

const DEFAULT_SESSIONS: SessionEntry[] = [
  {
    id: 1,
    therapist: 'Dr. Sarah Johnson',
    specialization: 'Anxiety & Career Balance',
    datetime: 'Tue • Oct 29, 7:00 PM ET',
    status: 'pending',
    notes: 'Waiting for therapist confirmation',
  },
  {
    id: 2,
    therapist: 'MindBridge Support Circle',
    specialization: 'Peer Support Drop-In',
    datetime: 'Thu • Nov 7, 6:30 PM ET',
    status: 'scheduled',
    notes: 'Virtual session link arrives 24 hours before',
  },
];

const LANDING_FEATURES = [
  {
    title: 'Warm, stage-aware intake',
    description: 'NIMA builds trust with six gentle conversation stages so vulnerable users never feel rushed.',
    icon: '💬',
  },
  {
    title: 'Real-time crisis intelligence',
    description: 'Nemotron-powered reasoning detects risk phrases, escalates, and preps the right response in seconds.',
    icon: '🚨',
  },
  {
    title: 'Autonomous resource matching',
    description: 'When therapists are scarce, NIMA searches, outreaches, and onboards new volunteers automatically.',
    icon: '🤝',
  },
  {
    title: 'Habit loops that stick',
    description: 'Actionable micro-habits and streak tracking keep users progressing between sessions.',
    icon: '📈',
  },
];

const ARCHITECTURE_FLOW = [
  {
    step: '01',
    title: 'Intake Agent',
    description: 'Nemotron-9B runs a stage-aware prompt stack that collects context empathetically while honoring privacy tiers.',
  },
  {
    step: '02',
    title: 'Crisis Agent',
    description: 'Tool-augmented reasoning scores risk, surfaces crisis resources, and flags when NIMA should intervene immediately.',
  },
  {
    step: '03',
    title: 'Resource Agent',
    description: 'LangGraph orchestrates database lookups, Tavily searches, and outreach workflows to secure human support.',
  },
  {
    step: '04',
    title: 'Habit Agent',
    description: 'Continuous follow-through with adaptive habits, streaks, and therapist feedback keeps change sustainable.',
  },
];

const NEMOTRON_PILLARS = [
  {
    title: 'Multi-model orchestration',
    copy: 'Nemotron 49B supervises the graph, while 9B specialists execute domain-specific reasoning for intake, crisis triage, and resource searches.',
  },
  {
    title: 'Safety and controls',
    copy: 'Structured prompts, tool-verified actions, and privacy tiers keep user data safe while ensuring crisis signals never go unnoticed.',
  },
  {
    title: 'Human-in-the-loop readiness',
    copy: 'Every decision is logged for clinicians, and the platform can hand off seamlessly to volunteer therapists or emergency teams.',
  },
];

function VoicePage() {
  const [statusText, setStatusText] = useState('Tap the microphone to start');
  const [showAssistant, setShowAssistant] = useState(false);
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [stage, setStage] = useState<Stage>('greeting');
  const [transcript, setTranscript] = useState<{ type: 'user' | 'agent'; content: string }[]>([]);
  const [isPrivacySelectionNeeded, setIsPrivacySelectionNeeded] = useState(false);
  const [hasPromptedPrivacy, setHasPromptedPrivacy] = useState(false);
  const [selectedPrivacyTier, setSelectedPrivacyTier] = useState<PrivacyTier | null>(null);
  const [isSpecialistSelectionOpen, setIsSpecialistSelectionOpen] = useState(false);
  const [recommendedSpecialistKey, setRecommendedSpecialistKey] = useState<SpecialistKey | null>(null);
  const [selectedSpecialistKey, setSelectedSpecialistKey] = useState<SpecialistKey | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [postMatchChoice, setPostMatchChoice] = useState<'experience' | 'habit' | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>(DEFAULT_HABITS);
  const [sessions, setSessions] = useState<SessionEntry[]>(DEFAULT_SESSIONS);
  const [sessionEditChoice, setSessionEditChoice] = useState<Record<number, string>>({});
  const [agentTimeline, setAgentTimeline] = useState<AgentActivity[]>([]);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'chat') {
      setStatusText(prev => (stage === 'ended' ? prev : 'Tap the microphone to respond'));
    } else if (tab === 'habits') {
      setStatusText('Track the habits you’ll review with your specialist.');
    } else {
      setStatusText('Review, update, or reschedule your upcoming sessions.');
    }
  };

  const handleOpenAssistant = () => {
    setShowAssistant(true);
    setActiveTab('chat');
    setStatusText('Tap the microphone to respond');
    setAgentTimeline([]);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleBackToLanding = () => {
    setShowAssistant(false);
    setActiveTab('chat');
    setStatusText('Tap the microphone to start');
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const scrollToArchitecture = () => {
    if (typeof document === 'undefined') return;
    const section = document.getElementById('architecture');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHabitCompletion = (id: number) => {
    setHabitEntries(prev =>
      prev.map(habit =>
        habit.id === id
          ? {
              ...habit,
              completedToday: !habit.completedToday,
              streak: !habit.completedToday ? habit.streak + 1 : habit.streak,
            }
          : habit
      )
    );
  };

  const resetHabitCompletions = () => {
    setHabitEntries(prev => prev.map(habit => ({ ...habit, completedToday: false })));
  };

  const handleSessionSelect = (id: number, value: string) => {
    setSessionEditChoice(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const confirmReschedule = (id: number) => {
    const newSlot = sessionEditChoice[id];
    if (!newSlot) {
      return;
    }

    setSessions(prev =>
      prev.map(session =>
        session.id === id
          ? {
              ...session,
              datetime: newSlot,
              status: 'pending',
              notes: 'Reschedule requested — awaiting therapist confirmation',
            }
          : session
      )
    );

    setSessionEditChoice(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    addMessage('agent', `Got it — I’ve asked the therapist to move your session to ${newSlot}.`);
    speakResponse(`Reschedule request sent for ${newSlot}. I'll confirm once they respond.`);
  };

  const markSessionConfirmed = (id: number) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === id
          ? {
              ...session,
              status: 'scheduled',
              notes: 'Confirmed — reminder will arrive 24 hours before the session',
            }
          : session
      )
    );
  };

  const handleVoiceResult = async (userMessage: string) => {
    addMessage('user', userMessage);
    await processWithNemotron(userMessage);
  };

  const { isListening, error, startListening, stopListening } = useVoiceRecorder(handleVoiceResult);
  const greetedRef = useRef(false);
  const statusRef = useRef(statusText);
  const speechQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    statusRef.current = statusText;
  }, [statusText]);

  const activeStage = STAGE_BADGES[stage] ?? STAGE_BADGES.greeting;

  useEffect(() => {
    const node = transcriptRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    if (!error) return;
    const friendlyMessage =
      error === 'not-allowed'
        ? 'Please allow microphone access to continue.'
        : error === 'no-speech'
          ? "I didn't catch anything. Tap the microphone and try again."
          : error === 'audio-capture'
            ? 'Microphone not detected. Please check your input device.'
            : 'Something went wrong capturing audio. Tap the microphone to try again.';

    setStatusText(friendlyMessage);
  }, [error]);

  useEffect(() => {
    if (isListening) {
      setOrbState('listening');
      setStatusText('Listening... Tap the microphone again when you are done.');
    } else if (orbState === 'listening') {
      setOrbState('idle');
      if (stage !== 'ended') {
        setStatusText('Processing your message...');
      }
    }
  }, [isListening, orbState, stage]);

  useEffect(() => {
    if (!greetedRef.current) {
      greetedRef.current = true;
      const greeting =
        "Welcome to MindBridge. I'm here to listen and support you. Tap the microphone when you're ready to talk.";
      addMessage('agent', greeting);
    }
  }, []);

  const addMessage = (type: 'user' | 'agent', content: string) => {
    setTranscript(prev => [...prev, { type, content }]);
  };

  const determineRecommendedSpecialist = (): SpecialistKey => {
    const allUserMessages = transcript
      .filter(msg => msg.type === 'user')
      .map(msg => msg.content.toLowerCase());

    const combined = allUserMessages.join(' ');
    const normalized = combined.replace(/[^\w\s]/g, ' ');

    const crisisIndicators = ['kill myself', 'suicid', 'end it all', 'hurt myself', 'hopeless'];
    if (crisisIndicators.some(term => combined.includes(term))) {
      return 'depression';
    }

    const keywordBuckets: Record<SpecialistKey, { terms: string[]; weight: number }[]> = {
      career: [
        { terms: ['career', 'job', 'work', 'manager', 'boss', 'promotion', 'deadline', 'project'], weight: 1.6 },
        {
          terms: ['balance', 'burnout', 'time management', 'full-time', 'grad school', 'graduate', 'university', 'masters', 'class', 'studies'],
          weight: 1.4,
        },
        { terms: ['schedule', 'shift', 'meeting', 'presentation'], weight: 1.1 },
      ],
      marriage: [
        {
          terms: ['relationship', 'marriage', 'partner', 'spouse', 'husband', 'wife', 'fiancé', 'girlfriend', 'boyfriend'],
          weight: 1.8,
        },
        { terms: ['arguing', 'fight', 'distance', 'communication', 'tension', 'trust issue', 'family conflict'], weight: 1.3 },
      ],
      adhd: [
        {
          terms: ['adhd', 'attention', 'focus', 'distracted', 'forgetting', 'impulsive', 'executive function', 'procrastinate', 'scattered'],
          weight: 2.0,
        },
        { terms: ['hyper', 'restless', 'task switching', 'overstimulated', 'cant sit still'], weight: 1.2 },
      ],
      depression: [
        {
          terms: ['depression', 'depressed', 'worthless', 'numb', 'empty', 'no energy', 'burned out', 'exhausted'],
          weight: 2.1,
        },
        { terms: ['crying', 'stuck', 'overwhelmed', 'lonely', 'sad', 'panic', 'anxious', 'motivation'], weight: 1.3 },
      ],
    };

    const scores = SPECIALIST_OPTIONS.map(option => {
      const buckets = keywordBuckets[option.key];
      let score = 0;
      buckets.forEach(({ terms, weight }) => {
        terms.forEach(term => {
          const token = term.toLowerCase();
          if (token.includes(' ')) {
            if (normalized.includes(token)) {
              score += weight;
            }
          } else {
            const pattern = new RegExp(`\\b${token}\\b`, 'g');
            const matches = normalized.match(pattern);
            if (matches) {
              score += matches.length * weight;
            }
          }
        });
      });
      return { key: option.key, score };
    });

    const best = scores.reduce(
      (prev, current) => (current.score > prev.score ? current : prev),
      { key: 'career' as SpecialistKey, score: 0 }
    );

    if (best.score === 0) {
      if (normalized.includes('school') || normalized.includes('work')) {
        return 'career';
      }
      return 'depression';
    }

    return best.key;
  };

  const playSpeech = async (text: string) => {
    const priorStatus = statusRef.current;
    let errorOccurred = false;
    setOrbState('speaking');
    setStatusText('Speaking...');

    try {
      const response = await fetch(`${API_URL}/voice/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TTS audio.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      await new Promise<void>((resolve, reject) => {
        const audio = new Audio(url);
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Audio playback failed'));
        };
        audio.play().catch(err => {
          URL.revokeObjectURL(url);
          reject(err);
        });
      });
    } catch (err) {
      errorOccurred = true;
      console.error('TTS error:', err);
      setStatusText('Could not play audio. Tap the microphone to respond.');
    } finally {
      setOrbState('idle');
      if (!errorOccurred) {
        setStatusText(prev => (prev === 'Speaking...' ? priorStatus : prev));
      }
    }
  };

  const speakResponse = (text: string) => {
    speechQueueRef.current = speechQueueRef.current
      .catch(() => undefined)
      .then(() => playSpeech(text));
  };

  const processWithNemotron = async (userMessage: string) => {
    setOrbState('thinking');
    setStatusText('Thinking... (Nemotron processing)');
    setAgentTimeline((prev: AgentActivity[]): AgentActivity[] => [
      ...prev,
      {
        id: `intake-${Date.now()}`,
        agent: 'Intake Agent',
        label: 'Understanding your message',
        status: 'thinking' as const,
      },
    ]);

    try {
      const response = await fetch(`${API_URL}/voice/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: SESSION_ID,
          message: userMessage,
          session_id: SESSION_ID,
        }),
      });

      const data = await response.json();
      setOrbState('idle');
      if (data.stage) {
        setStage(data.stage);
      }
      if (data.response) {
        addMessage('agent', data.response);
        speakResponse(data.response);
      }

      const forceCrisis = Boolean(data.force_crisis);
      const skipPrivacyPrompt = Boolean(data.skip_privacy_prompt);

      setAgentTimeline((prev: AgentActivity[]): AgentActivity[] => {
        const updated = prev.map(item =>
          item.agent === 'Intake Agent' && item.status !== 'done'
            ? {
                ...item,
                status: 'done' as const,
                label: forceCrisis ? 'Emergency flagged-escalating to crisis support' : 'Intake updated',
              }
            : item
        );
        if (forceCrisis) {
          return [
            ...updated,
            {
              id: `coordinator-${Date.now()}`,
              agent: 'Coordinator',
              label: 'Routing directly to Crisis Agent',
              status: 'tool' as const,
            },
          ];
        }
        return updated;
      });

      if (forceCrisis) {
        const emergencyTier: PrivacyTier = 'full_support';
        setHasPromptedPrivacy(true);
        setIsPrivacySelectionNeeded(false);
        setSelectedPrivacyTier(emergencyTier);
        setStatusText('I’m right here with you—connecting crisis support now.');
        await runInternalRiskAnalysis(emergencyTier);
        return;
      }

      if (data.intake_complete && !skipPrivacyPrompt && !hasPromptedPrivacy) {
        promptPrivacySelection();
      }
    } catch (err) {
      console.error('API error:', err);
      setOrbState('idle');
      setStatusText('Connection error. Please check the backend.');
      setAgentTimeline((prev: AgentActivity[]): AgentActivity[] =>
        prev.map(item =>
          item.agent === 'Intake Agent' && item.status !== 'done'
            ? { ...item, status: 'done' as const, label: 'Intake unavailable' }
            : item
        )
      );
    }
  };

  const promptPrivacySelection = () => {
    if (isPrivacySelectionNeeded || hasPromptedPrivacy) return;
    setHasPromptedPrivacy(true);
    setIsPrivacySelectionNeeded(true);
    setStage('privacy');
    const prompt =
      'Thanks for sharing all of that. Which privacy level feels best for you—Full Support, Assisted Handoff, Your Private Notes, or No Records?';
    addMessage('agent', prompt);
    speakResponse(prompt);
    setStatusText('Choose the privacy level that feels right for you.');
  };

  const handlePrivacySelection = async (tier: PrivacyTier) => {
    setSelectedPrivacyTier(tier);
    setIsPrivacySelectionNeeded(false);
    addMessage('user', `I’d like ${PRIVACY_OPTIONS[tier].label}.`);
    setStatusText('Thanks for letting me know. Let me review everything quickly.');
    await runInternalRiskAnalysis(tier);
  };

  const runInternalRiskAnalysis = async (tier: PrivacyTier) => {
    setStage('assessment');
    setStatusText('Analyzing your needs...');
    setAgentTimeline((prev: AgentActivity[]): AgentActivity[] => [
      ...prev,
      {
        id: `crisis-${Date.now()}`,
        agent: 'Crisis Agent',
        label: 'Assessing urgency',
        status: 'thinking' as const,
      },
    ]);

    try {
      await fetch(`${API_URL}/voice/crisis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: SESSION_ID,
          session_id: SESSION_ID,
          message: `Internal risk assessment with privacy tier: ${tier}`,
        }),
      });

      const recommendedKey = determineRecommendedSpecialist();
      setRecommendedSpecialistKey(recommendedKey);
      setIsSpecialistSelectionOpen(true);
      setSelectedSpecialistKey(null);
      setSelectedTimeSlot(null);
      setPostMatchChoice(null);

      const recommended =
        SPECIALIST_OPTIONS.find(option => option.key === recommendedKey) ?? SPECIALIST_OPTIONS[0];
      const message = `Thank you for trusting me. Based on what you shared, I’d like to introduce you to a ${recommended.title}. Feel free to pick them—or choose the specialist that feels best.`;

      setStage('specialist_selection');
      setStatusText('Choose the specialist who feels like the right fit for you.');
      setOrbState('idle');
      addMessage('agent', message);
      speakResponse(message);
      setAgentTimeline((prev: AgentActivity[]): AgentActivity[] =>
        prev.map(item =>
          item.agent === 'Crisis Agent' && item.status !== 'done'
            ? { ...item, status: 'done' as const, label: 'Risk evaluated' }
            : item
        )
      );
    } catch (err) {
      console.error('Risk analysis error:', err);
      setStage('privacy');
      setIsPrivacySelectionNeeded(true);
      setStatusText('Something went wrong. Please choose a privacy level again.');
      setAgentTimeline((prev: AgentActivity[]): AgentActivity[] =>
        prev.map(item =>
          item.agent === 'Crisis Agent' && item.status !== 'done'
            ? { ...item, status: 'done' as const, label: 'Risk check failed' }
            : item
        )
      );
    }
  };

  const handleSpecialistSelection = (key: SpecialistKey) => {
    const specialist = SPECIALIST_OPTIONS.find(option => option.key === key);
    if (!specialist) {
      return;
    }

    setSelectedSpecialistKey(key);
    setIsSpecialistSelectionOpen(false);
    setStage('time_slots');
    setStatusText('Great choice! Pick a time that works for you.');
    const message = `Wonderful—I'll reach out to a ${specialist.title} for you. Which of these times fits your schedule?`;
    addMessage('agent', message);
    speakResponse(message);
  };

  const handleTimeSlotSelection = (slot: string) => {
    setSelectedTimeSlot(slot);
    setStage('matching');
    setStatusText('Sending invite to the specialist...');
    const message = `Perfect. I’ve sent an invitation for ${slot}. I’ll let you know as soon as they confirm.`;
    addMessage('agent', message);
    speakResponse(message);
    setAgentTimeline((prev: AgentActivity[]): AgentActivity[] => [
      ...prev,
      {
        id: `resource-${Date.now()}`,
        agent: 'Resource Agent',
        label: `Reaching out for ${slot}`,
        status: 'tool' as const,
      },
    ]);

    setTimeout(() => {
      setStage('matched');
      const confirmMessage =
        'Invite sent! While we wait for their confirmation, would you like to share more or plan a few supportive habits?';
      addMessage('agent', confirmMessage);
      speakResponse(confirmMessage);
      setStage('post_match');
      setStatusText('Choose to share how you’re feeling or explore quick habit ideas.');
      setAgentTimeline((prev: AgentActivity[]): AgentActivity[] =>
        prev.map(item =>
          item.agent === 'Resource Agent' && item.status !== 'done'
            ? { ...item, status: 'done' as const, label: 'Invite sent' }
            : item
        )
      );
    }, 1500);
  };

  const handleShareExperience = () => {
    setPostMatchChoice('experience');
    setStage('experience');
    setActiveTab('chat');
    const prompt = 'I’m listening—tell me what’s weighing on you the most right now.';
    addMessage('agent', prompt);
    speakResponse(prompt);
    setStatusText('Take your time and share as much or as little as you like.');
  };

  const handleHabitTracker = () => {
    setPostMatchChoice('habit');
    setStage('habit_tracker');
    const prompt =
      "Here are a few gentle habits we can focus on until the session. Your therapist will personalize these once you meet.";
    addMessage('agent', prompt);
    speakResponse(prompt);
    setActiveTab('habits');
    setStatusText('Pick any habit to try before your session.');
  };

  const toggleListening = () => {
    if (stage === 'ended') return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleEndSession = async () => {
    stopListening();
    await fetch(`${API_URL}/voice/session/${SESSION_ID}`, { method: 'DELETE' });
    setStatusText('Session ended. Take care!');
    setStage('ended');
    setIsPrivacySelectionNeeded(false);
    setHasPromptedPrivacy(false);
    setSelectedPrivacyTier(null);
    setIsSpecialistSelectionOpen(false);
    setRecommendedSpecialistKey(null);
    setSelectedSpecialistKey(null);
    setSelectedTimeSlot(null);
    setPostMatchChoice(null);
    setAgentTimeline([]);
  };

  const highestStreak = habitEntries.reduce((max, habit) => Math.max(max, habit.streak), 0);
  const completedTodayCount = habitEntries.filter(habit => habit.completedToday).length;
  const totalHabits = habitEntries.length;
  const completionPercent =
    totalHabits === 0 ? 0 : Math.round((completedTodayCount / totalHabits) * 100);
  const agentTimelineToRender = agentTimeline.slice(-4);

  const renderLanding = () => (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-hero-badge">NIMA • Nemotron Mental Health Assistant</span>
          <h1>Human warmth, NVIDIA Nemotron intelligence, real-world outcomes.</h1>
          <p>
            MindBridge orchestrates intake, crisis detection, therapist matching, and habit coaching through a safety-first
            network of agents. Every step is powered by Nemotron models and grounded in human empathy.
          </p>
          <div className="landing-hero-actions">
            <button className="landing-primary-cta" onClick={handleOpenAssistant}>
              Talk to NIMA
            </button>
            <button className="landing-secondary-cta" onClick={scrollToArchitecture}>
              See how it works
            </button>
          </div>
          <div className="landing-trust">
            <span className="landing-trust-stars">★★★★★</span>
            <span>Built for the NVIDIA Nemotron Hackathon • 4.9 demo rating</span>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-hero-orb" />
          <div className="landing-hero-orb trail" />
        </div>
      </section>

      <section className="landing-section landing-vision">
        <div className="landing-section-heading">
          <h2>Our Vision</h2>
          <p>
            NVIDIA is accelerating the AI frontier by open-sourcing state-of-the-art models. Our shared mission is to harness
            those breakthroughs to reach people who are too often left behind. MindBridge uses these foundational models to
            democratize mental health care—making high-quality support accessible, empathetic, and affordable for everyone.
          </p>
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="landing-section-heading">
          <h2>The platform for proactive mental health support</h2>
          <p>From the first hello to long-term habits, NIMA keeps every step empathetic and data-informed.</p>
        </div>
        <div className="landing-feature-grid">
          {LANDING_FEATURES.map(feature => (
            <article key={feature.title} className="landing-feature-card">
              <span className="landing-feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-architecture" id="architecture">
        <div className="landing-section-heading">
          <h2>Architecture built on LangGraph + Nemotron</h2>
          <p>
            Every agent now runs on Nemotron 49B—coordinator, crisis triage, intake, resource matching, and habit follow-through—
            so the entire LangGraph workflow benefits from the same deep reasoning and empathy.
          </p>
        </div>
        <div className="landing-architecture-grid">
          {ARCHITECTURE_FLOW.map(step => (
            <div key={step.step} className="landing-architecture-card">
              <span className="landing-step-index">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-nemotron">
        <div className="landing-nemotron-copy">
          <h2>How we leverage NVIDIA Nemotron for good</h2>
          <p>NIMA translates cutting-edge foundation models into compassionate, action-oriented care.</p>
          <ul className="landing-bullet-list">
            {NEMOTRON_PILLARS.map(pillar => (
              <li key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="landing-nemotron-panel">
          <div className="landing-panel-metric">
            <span className="landing-panel-value">90s</span>
            <span className="landing-panel-label">from intake to triage</span>
          </div>
          <div className="landing-panel-metric">
            <span className="landing-panel-value">4×</span>
            <span className="landing-panel-label">faster therapist matches</span>
          </div>
          <div className="landing-panel-metric">
            <span className="landing-panel-value">100%</span>
            <span className="landing-panel-label">tool-audited decisions</span>
          </div>
        </div>
      </section>

      <section className="landing-section landing-callout">
        <h2>Ready to understand what your mental health needs?</h2>
        <p>NIMA listens, evaluates, and mobilizes human support in one seamless flow.</p>
        <div className="landing-callout-actions">
          <button className="landing-primary-cta" onClick={handleOpenAssistant}>
            Talk to NIMA
          </button>
          <button
            className="landing-secondary-cta"
            onClick={() => window.open('https://developer.nvidia.com/nemotron', '_blank', 'noopener')}
          >
            Learn about Nemotron
          </button>
        </div>
      </section>

      <button className="floating-nima-button" onClick={handleOpenAssistant}>
        <span>Talk to NIMA</span>
        <small>Let the assistant map your next step</small>
      </button>
    </div>
  );
  if (!showAssistant) {
    return renderLanding();
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header-block">
          <button className="back-link" onClick={handleBackToLanding}>
            ← Back to overview
          </button>
          <h1>🧠 MindBridge AI</h1>
          <p className="subtitle">
            Voice Support Powered by NVIDIA Nemotron
            <span className="badge">LIVE</span>
          </p>
        </div>

        <nav className="top-nav">
          <button
            className={`nav-tab${activeTab === 'chat' ? ' active' : ''}`}
            onClick={() => handleTabChange('chat')}
            aria-label="Return to conversation"
          >
            Conversation
          </button>
          <button
            className={`nav-tab${activeTab === 'habits' ? ' active' : ''}`}
            onClick={() => handleTabChange('habits')}
            aria-label="Open habit tracker"
          >
            Habit Tracker
          </button>
          <button
            className={`nav-tab${activeTab === 'schedule' ? ' active' : ''}`}
            onClick={() => handleTabChange('schedule')}
            aria-label="View schedules"
          >
            Schedules
          </button>
        </nav>

        {activeTab === 'chat' ? (
          <div className="chat-panel">
            <div className="orb-container">
              <div className={`orb ${orbState}`} />
            </div>

            <div className="status">{statusText}</div>

            {agentTimeline.length > 0 && (
              <div className="agent-activity-bar">
                {agentTimelineToRender.map(activity => (
                  <div key={activity.id} className={`agent-activity agent-${activity.status}`}>
                    <span className="agent-activity-dot" />
                    <div className="agent-activity-copy">
                      <span className="agent-activity-name">{activity.agent}</span>
                      <span className="agent-activity-label">{activity.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="controls">
              <button
                className={`control-btn mic-btn ${isListening ? 'active' : ''}`}
                onClick={toggleListening}
                disabled={stage === 'ended'}
                aria-label="Toggle microphone"
              >
                🎤
              </button>
              <button
                className="control-btn close-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to end the session?')) {
                    handleEndSession();
                  }
                }}
                aria-label="End session"
              >
                ✖️
              </button>
            </div>

            <div className="stage-indicator">
              {activeStage.emoji} {activeStage.label}
            </div>

            <div className="transcript" ref={transcriptRef}>
              {transcript.map((msg, idx) => (
                <div
                  key={`${msg.type}-${idx}`}
                  className={`transcript-message ${msg.type === 'user' ? 'user' : 'agent'}`}
                >
                  <div className="transcript-label">
                    {msg.type === 'user' ? 'You' : 'MindBridge AI (Nemotron)'}
                  </div>
                  <div className="transcript-content">{msg.content}</div>
                </div>
              ))}
            </div>

            {isPrivacySelectionNeeded && stage === 'privacy' && (
              <div className="privacy-panel">
                <h2>Choose Your Privacy Level</h2>
                <p className="privacy-panel-description">
                  Pick what feels safest. You can always change your mind later.
                </p>
                <div className="privacy-buttons">
                  {Object.entries(PRIVACY_OPTIONS).map(([key, value]) => (
                    <button
                      key={key}
                      className={`privacy-option${selectedPrivacyTier === key ? ' selected' : ''}`}
                      onClick={() => handlePrivacySelection(key as PrivacyTier)}
                      aria-label={`Select ${value.label}`}
                    >
                      <span className="privacy-option-label">{value.label}</span>
                      <span className="privacy-option-description">{value.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isSpecialistSelectionOpen && stage === 'specialist_selection' && (
              <div className="option-panel">
                <h2>I’ve lined up a few specialists</h2>
                <p className="option-panel-description">
                  {recommendedSpecialistKey
                    ? `I’d start with a ${
                        SPECIALIST_OPTIONS.find(option => option.key === recommendedSpecialistKey)?.title ??
                        'specialist'
                      }. Pick whoever feels right.`
                    : 'Choose the specialist who fits best.'}
                </p>
                <div className="option-grid">
                  {SPECIALIST_OPTIONS.map(option => (
                    <button
                      key={option.key}
                      className={`option-card${selectedSpecialistKey === option.key ? ' selected' : ''}${
                        recommendedSpecialistKey === option.key ? ' recommended' : ''
                      }`}
                      onClick={() => handleSpecialistSelection(option.key)}
                      aria-label={`Select ${option.title}`}
                    >
                      <span className="option-card-title">
                        {option.title}
                        {recommendedSpecialistKey === option.key && (
                          <span className="option-recommended">Recommended</span>
                        )}
                      </span>
                      <span className="option-card-description">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === 'time_slots' && (
              <div className="option-panel">
                <h2>Pick a time that works for you</h2>
                <p className="option-panel-description">We’ll hold the slot as soon as you tap it.</p>
                <div className="time-grid">
                  {AVAILABLE_TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      className={`time-slot${selectedTimeSlot === slot ? ' selected' : ''}`}
                      onClick={() => handleTimeSlotSelection(slot)}
                      aria-label={`Choose ${slot}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === 'post_match' && (
              <div className="post-match-panel">
                <h2>While we wait</h2>
                <p className="option-panel-description">
                  Would you like to share a bit more, or plan a couple of supportive habits?
                </p>
                <div className="post-match-buttons">
                  <button
                    className={`post-match-btn${postMatchChoice === 'experience' ? ' selected' : ''}`}
                    onClick={handleShareExperience}
                  >
                    Share More
                  </button>
                  <button
                    className={`post-match-btn${postMatchChoice === 'habit' ? ' selected' : ''}`}
                    onClick={handleHabitTracker}
                  >
                    See Habit Ideas
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="status status-secondary">{statusText}</div>
        )}

        {activeTab === 'habits' && (
          <div className="habit-tab">
            <div className="streak-widget">
              <div className="streak-badge">
                <span className="streak-number">{highestStreak}</span>
                <span className="streak-label">days</span>
              </div>
              <div className="streak-copy">
                <h3>Keep the momentum!</h3>
                <p>Your specialist will love seeing how consistent you’ve been.</p>
              </div>
            </div>
            <div className="habit-metrics">
              {[
                {
                  id: 'completion',
                  label: 'Completion rate',
                  value: `${completionPercent}%`,
                  progress: completionPercent * 3.6,
                },
                {
                  id: 'completed',
                  label: 'Completed today',
                  value: `${completedTodayCount}/${totalHabits}`,
                  progress: (totalHabits === 0 ? 0 : (completedTodayCount / totalHabits) * 100) * 3.6,
                },
                {
                  id: 'streak',
                  label: 'Longest streak',
                  value: `${highestStreak} day${highestStreak === 1 ? '' : 's'}`,
                  progress: (Math.min(highestStreak, 21) / 21) * 360,
                },
              ].map(metric => (
                <div
                  key={metric.id}
                  className="habit-metric"
                  style={{ '--progress': `${metric.progress}deg` } as CSSProperties}
                >
                  <div className="habit-metric-ring">
                    <span className="habit-metric-value">{metric.value}</span>
                  </div>
                  <span className="habit-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
            <div className="habit-toolbar">
              <p className="habit-subtitle">
                Keep tabs on the routines you’re testing until your specialist checks in.
              </p>
              <button className="habit-reset" onClick={resetHabitCompletions}>
                Reset today
              </button>
            </div>
            <div className="habit-grid">
              {habitEntries.map(habit => (
                <div key={habit.id} className="habit-card">
                  <div className="habit-header">
                    <h3>{habit.title}</h3>
                    <span className="habit-streak">
                      {habit.streak} day{habit.streak === 1 ? '' : 's'} streak
                    </span>
                  </div>
                  <p className="habit-description">{habit.description}</p>
                  <label className="habit-checkbox">
                    <input
                      type="checkbox"
                      checked={habit.completedToday}
                      onChange={() => handleHabitCompletion(habit.id)}
                      aria-label={`Mark ${habit.title} as completed today`}
                    />
                    <span>Completed today</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-tab">
            {sessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <h3>{session.therapist}</h3>
                  <span className={`session-status ${session.status}`}>
                    {session.status === 'scheduled' ? 'Scheduled' : 'Awaiting confirmation'}
                  </span>
                </div>
                <p className="session-specialization">{session.specialization}</p>
                <p className="session-datetime">📅 {session.datetime}</p>
                {session.notes && <p className="session-notes">{session.notes}</p>}
                <div className="session-actions">
                  <select
                    className="session-select"
                    value={sessionEditChoice[session.id] ?? ''}
                    onChange={event => handleSessionSelect(session.id, event.target.value)}
                    aria-label="Choose a new time slot"
                  >
                    <option value="">Reschedule to…</option>
                    {AVAILABLE_TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <button
                    className="session-button"
                    onClick={() => confirmReschedule(session.id)}
                    disabled={!sessionEditChoice[session.id]}
                  >
                    Send request
                  </button>
                  {session.status !== 'scheduled' && (
                    <button
                      className="session-button secondary"
                      onClick={() => markSessionConfirmed(session.id)}
                    >
                      Mark confirmed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<VoicePage />} />
        <Route path="/therapist" element={<TherapistsPage />} />
      </Routes>
    </div>
  );
}

export default App;

