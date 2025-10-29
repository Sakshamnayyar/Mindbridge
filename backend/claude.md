# MindBridge AI - Agentic Mental Health Support Platform

## Project Overview
An autonomous mental health support system that demonstrates TRUE agentic AI behavior using NVIDIA Nemotron models. The platform connects people who can't afford therapy with volunteer therapists while providing continuous, autonomous support through intelligent agents.

## Key Innovation: True Agency
Unlike typical chatbots, this system exhibits genuine autonomous behavior:
- **Persistent Goals**: Continuously works toward improving user mental health outcomes
- **Autonomous Actions**: Takes initiatives without human prompting
- **Learning & Adaptation**: Evolves strategies based on effectiveness
- **Multi-Agent Coordination**: Agents negotiate and collaborate independently

## Hackathon Context
- **Event**: NVIDIA Nemotron Hackathon
- **Duration**: 2 hours (with 2 days prep)
- **Prize Track**: Best Use of NVIDIA Nemotron
- **Presentation**: 3-minute demo
- **Requirements**: Must use Nemotron models, show agentic workflows, not just prompting

## Core Architecture

### Agent System Design
```
┌─────────────────────────────────────────────┐
│          Coordination Agent                  │
│         (Nemotron-super-49b)                │
└────────────┬────────────────────────────────┘
             │ Orchestrates
    ┌────────┼────────┬───────────┬──────────┐
    ▼        ▼        ▼           ▼          ▼
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
│Crisis  ││Resource││Habit   ││Quality ││Handoff │
│Agent   ││Matcher ││Tracker ││Agent   ││Agent   │
└────────┘└────────┘└────────┘└────────┘└────────┘
```

### Privacy Tier System
1. **No Records** - Complete anonymity, no data stored
2. **Your Private Notes** (Default) - User-encrypted data only
3. **Assisted Handoff** - Platform helps with therapist transitions  
4. **Full Support** - Complete AI assistance and insights

## Agentic Components

### 1. Autonomous Habit Tracking Agent
**Demonstrates true agency through:**
- Continuous monitoring without human intervention
- Predictive intervention when failure likely
- Adaptive encouragement strategies
- Automatic difficulty adjustment
- Crisis pattern detection

**Key Behaviors:**
```python
# Runs continuously, checking every hour
- Evaluates all active user habits
- Predicts likelihood of habit completion
- Selects personalized intervention strategy
- Executes intervention (reminder, encouragement, etc.)
- Learns from outcome effectiveness
- Adjusts future strategies
```

### 2. Crisis Assessment Agent
**ReAct Pattern Implementation:**
```
Thought: User message indicates distress
Action: analyze_crisis_indicators
Observation: Multiple warning signs detected
Thought: Need immediate risk assessment
Action: evaluate_suicide_risk
Observation: Moderate risk, no immediate danger
Thought: Implement safety protocol
Action: initiate_crisis_intervention
```

### 3. Resource Matching Agent
**Tool Calling Capabilities:**
- `search_available_therapists()`
- `check_specialization_match()`
- `verify_availability()`
- `schedule_appointment()`
- `create_waitlist_entry()`

### 4. Multi-Agent Coordination
**Autonomous Negotiation Example:**
```
HabitAgent → CoordinatorAgent: "User missed 5 days of habits"
CoordinatorAgent → CrisisAgent: "Evaluate risk level"
CrisisAgent → CoordinatorAgent: "Depression indicators detected"
CoordinatorAgent → ResourceAgent: "Priority scheduling needed"
ResourceAgent → CoordinatorAgent: "Emergency slot scheduled"
```

## Technical Implementation

### Required APIs/Services
- **NVIDIA Nemotron**: Via OpenRouter API
- **LangGraph**: For agent orchestration
- **Tavily**: Web search for resources
- **Supabase**: Database and auth
- **Redis**: State management
- **FastAPI**: Backend server
- **WebSockets**: Real-time updates

### Model Selection
- **nemotron-nano-9b-v2**: For focused agents (Crisis, Habit, Resource)
- **nemotron-super-49b-v1_5**: For coordination and complex reasoning

### Project Structure
```
mindbridge-ai/
├── agents/
│   ├── base_agent.py          # Abstract base class
│   ├── crisis_agent.py         # Crisis detection/assessment
│   ├── habit_agent.py          # Autonomous habit tracking
│   ├── resource_agent.py       # Therapist matching
│   └── coordinator_agent.py    # Multi-agent orchestration
├── workflows/
│   ├── langgraph_workflow.py   # Main orchestration
│   ├── react_patterns.py       # ReAct implementations
│   └── state_manager.py        # Conversation state
├── tools/
│   ├── database_tools.py       # DB operations
│   ├── assessment_tools.py     # Mental health assessments
│   └── intervention_tools.py   # Coping strategies
├── models/
│   ├── user_model.py          # User data/privacy tiers
│   ├── therapist_model.py     # Therapist availability
│   └── habit_model.py         # Habit tracking
├── api/
│   ├── main.py               # FastAPI app
│   ├── websocket_handler.py  # Real-time updates
│   └── auth.py              # Authentication
├── ui/
│   ├── streamlit_app.py     # Demo interface
│   └── agent_visualizer.py  # Show agent reasoning
└── demo/
    ├── mock_data.py         # Pre-populated data
    └── demo_scenarios.py    # Scripted demonstrations
```

## Demo Flow (3 minutes)

### Minute 1: Problem & Agentic Solution
- Show mental health crisis statistics
- Introduce multi-agent system
- Emphasize AUTONOMOUS operation (not chatbot)
- Quick privacy tier explanation

### Minute 2: Live Demonstration
**Scenario**: User with anxiety, assigned meditation homework

**Show Split Screen:**
- Left: User interface
- Right: Agent reasoning panel

**Autonomous Actions (no user trigger):**
1. HabitAgent detects user hasn't meditated in 2 days
2. Analyzes pattern: "Usually skips on weekdays"
3. Adapts: Suggests 3-minute version for workdays  
4. User still struggles
5. System autonomously schedules therapist check-in
6. Learns: This user needs accountability partner

### Minute 3: Technical Excellence
- Show LangGraph workflow visualization
- Demonstrate Nemotron's reasoning capabilities
- Highlight autonomous behaviors
- Impact metrics (could serve 100K+ users)

## Judging Criteria Alignment

### Creativity (1-5)
- Privacy tier system is novel
- Autonomous habit intervention unique
- Multi-agent mental health approach innovative

### Functionality (1-5)
- Live demo with real Nemotron calls
- Multiple agents working together
- Actual tool calling and state changes

### Scope of Completion (1-5)
- Full workflow implemented
- Polished UI showing reasoning
- End-to-end user journey

### Presentation (1-5)
- Clear problem statement
- Live demo (not slides)
- Technical depth visible

### Use of NVIDIA Tools (1-5)
- Nemotron models central to solution
- Using both nano and super variants
- Advanced features (ReAct, tool calling)

### Use of Nemotron Models (1-5)
- Sophisticated reasoning chains
- True agentic workflows
- Not just prompting

## Development Priorities

### Must Have (Hours 0-1)
1. Basic agent structure with Nemotron
2. LangGraph orchestration
3. Crisis detection
4. Simple habit tracking
5. Demo UI with reasoning display

### Should Have (Hours 1-1.5)
1. Privacy tier implementation
2. Therapist matching
3. Intervention strategies
4. WebSocket real-time updates

### Nice to Have (Hours 1.5-2)
1. Learning system
2. Advanced visualizations
3. Multiple demo scenarios
4. Voice input

## Success Metrics
- **Response Time**: <2 seconds for crisis detection
- **Autonomy**: 80%+ decisions without human input
- **Effectiveness**: Show measurable habit improvement
- **Scale**: Demonstrate handling 100+ concurrent users

## Key Differentiators
1. **TRUE Agency**: System acts autonomously, not just responds
2. **Privacy First**: User-controlled AI involvement
3. **Continuous Operation**: 24/7 autonomous monitoring
4. **Learning System**: Adapts strategies based on effectiveness
5. **Multi-Agent Collaboration**: Agents negotiate and coordinate

## Risk Mitigation
- Pre-build core components before hackathon
- Have mock data ready
- Test Nemotron endpoints thoroughly
- Record backup demo videos
- Practice 3-minute pitch

## Resources & References
- [NVIDIA Nemotron Docs](https://build.nvidia.com/models)
- [LangGraph Tutorial](https://github.com/langchain-ai/langgraph)
- [Report Generator Example](https://github.com/NVIDIA/report-generator-agent)
- [OpenRouter API](https://openrouter.ai/docs)

## Remember
**Judges want to see AGENTS that reason and act autonomously, not chatbots that respond to prompts!**

Focus on showing:
- Autonomous decision-making
- Multi-step reasoning (ReAct pattern)
- Tool calling and real actions
- Agents working together
- Continuous operation without human intervention

## Quick Start Commands
```bash
# Setup environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Environment variables (.env)
OPENROUTER_API_KEY=your_key
TAVILY_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
REDIS_URL=redis://localhost:6379

# Run the autonomous system
python -m agents.autonomous_system

# Launch demo UI
streamlit run ui/streamlit_app.py

# Run tests
pytest tests/
```

## Final Checklist Before Hackathon
- [ ] All API keys working
- [ ] Nemotron endpoints tested
- [ ] Core agents implemented
- [ ] LangGraph workflow complete
- [ ] Habit tracking loop running
- [ ] Demo scenarios prepared
- [ ] Backup videos recorded
- [ ] 3-minute pitch practiced
- [ ] Mock data loaded
- [ ] UI shows agent reasoning
