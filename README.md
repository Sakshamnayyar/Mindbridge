# MindBridge AI - Autonomous Mental Health Support Platform

## 🎯 Hackathon Project
NVIDIA Nemotron Hackathon - Demonstrating TRUE agentic AI behavior

## ✨ Key Features
- **Autonomous Habit Tracking**: Continuously monitors therapeutic homework without human intervention
- **Crisis Detection**: ReAct-based assessment and triage
- **Smart Therapist Matching**: Connects users with volunteer therapists
- **Privacy Tiers**: User-controlled AI involvement (No Records → Full Support)
- **Multi-Agent Orchestration**: Specialized agents working together via LangGraph

## 🏗️ Architecture
- **Coordination Agent** (Nemotron-super-49b): Orchestrates all agents
- **Crisis Agent** (Nemotron-nano-9b): Assesses urgency using ReAct
- **Habit Agent** (Nemotron-nano-9b): Autonomous monitoring and intervention
- **Resource Agent** (Nemotron-nano-9b): Therapist matching

## 🚀 Tech Stack
- LangGraph for multi-agent orchestration
- NVIDIA Nemotron via OpenRouter API
- Supabase for database
- Redis for state management
- Streamlit for demo UI
- FastAPI for backend
