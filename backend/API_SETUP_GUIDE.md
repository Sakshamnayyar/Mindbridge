# 🔑 API Keys Setup Guide

This guide will walk you through getting your API keys for MindBridge AI. Both services have **FREE tiers** perfect for development and hackathons!

---

## 📍 Part 1: OpenRouter API Key (~2 minutes)

### **What is OpenRouter?**
- A unified API gateway to access 100+ AI models (including NVIDIA Nemotron)
- Instead of managing separate accounts for NVIDIA, OpenAI, Anthropic, etc., you get ONE key for all
- **Free tier**: $1 in free credits to start (enough for ~200,000 tokens)

### **Step-by-Step Instructions:**

#### **1. Sign Up**
- Go to: https://openrouter.ai/
- Click **"Sign In"** in the top right
- You can sign in with:
  - GitHub (recommended - fastest)
  - Google
  - Email

#### **2. Get Free Credits**
- After signing in, you'll automatically get **$1 in free credits**
- This is enough to test and build your entire hackathon project!
- For more credits during development, you can add a credit card (minimum $5)

#### **3. Create Your API Key**
- Once logged in, click on your profile picture (top right)
- Select **"Keys"** from the dropdown menu
- Click **"Create Key"**
- Give it a name like `MindBridge-Dev`
- Click **"Create"**
- **IMPORTANT**: Copy the key immediately! It won't be shown again

#### **4. Your API Key Format**
Your key will look like this:
```
sk-or-v1-123456......
```

#### **5. Test Your Key (Optional but Recommended)**
Let's verify it works immediately. Open your terminal and run:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_KEY_HERE" \
  -d '{
    "model": "nvidia/nemotron-nano-9b-v2:free",
    "messages": [
      {"role": "user", "content": "Say hello!"}
    ]
  }'
```

**Expected Response:**
You should see a JSON response with the model's reply. If you get an error, double-check your key.

---

## 🔍 Part 2: Tavily API Key (~2 minutes)

### **What is Tavily?**
- A search API specifically designed for AI agents (not regular users)
- Returns clean, structured search results perfect for LLMs
- **Free tier**: 1,000 searches per month (plenty for development!)

### **Step-by-Step Instructions:**

#### **1. Sign Up**
- Go to: https://tavily.com/
- Click **"Get Started Free"** or **"Sign Up"**
- You can sign up with:
  - Google (recommended - fastest)
  - Email

#### **2. Verify Email**
- Check your email inbox
- Click the verification link
- This activates your account

#### **3. Access Your Dashboard**
- After verification, you'll be taken to your dashboard
- You should see: https://app.tavily.com/home

#### **4. Get Your API Key**
- On the dashboard, look for **"API Keys"** in the sidebar
- Or go directly to: https://app.tavily.com/api-keys
- Your API key will be displayed immediately
- Click **"Copy"** to copy it

#### **5. Your API Key Format**
Your key will look like this:
```
tvly-12345....
```

#### **6. Test Your Key (Optional but Recommended)**
Let's verify it works. In your terminal:

```bash
curl -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_TAVILY_KEY_HERE",
    "query": "mental health support resources",
    "max_results": 3
  }'
```

**Expected Response:**
You should see JSON with search results including URLs, titles, and content.

---

## 💾 Part 3: Storing Your Keys Securely

Now that you have both keys, let's store them properly.

### **Step 1: Create Your .env File**

In your terminal, navigate to the MindBridge directory and run:

```bash
cd /Users/abdulshaik/MindBridge
cp .env.example .env
```

### **Step 2: Add Your Keys**

Open the `.env` file with your favorite editor:

```bash
# Using nano (beginner-friendly)
nano .env

# OR using VS Code
code .env

# OR using vim
vim .env
```

### **Step 3: Fill In Your Keys**

Replace the placeholder values:

```bash
# Replace these with your actual keys:
OPENROUTER_API_KEY=sk-or-v1-YOUR_ACTUAL_KEY_HERE
TAVILY_API_KEY=tvly-YOUR_ACTUAL_KEY_HERE

# Optional (for later):
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
REDIS_URL=redis://localhost:6379

# Keep these as is:
LOG_LEVEL=INFO
ENVIRONMENT=development
COORDINATOR_MODEL=nvidia/nemotron-super-49b-v1_5:free
AGENT_MODEL=nvidia/nemotron-nano-9b-v2:free
```

### **Step 4: Save and Verify**

Save the file:
- In nano: Press `Ctrl+X`, then `Y`, then `Enter`
- In VS Code: Press `Cmd+S` (Mac) or `Ctrl+S` (Windows)
- In vim: Press `Esc`, type `:wq`, press `Enter`

### **Step 5: Verify Your .env File**

```bash
cat .env | grep "API_KEY"
```

You should see your keys (not the example placeholders).

---

## ⚠️ IMPORTANT SECURITY NOTES

### **Never Commit Your .env File to Git!**

Make sure `.env` is in your `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### **Why This Matters:**
- ✅ `.env.example` → Safe to commit (no real keys)
- ❌ `.env` → NEVER commit (contains real keys)
- If you accidentally commit real keys, they can be stolen and used by others

---

## 🎉 What You Just Accomplished

You now have:
- ✅ OpenRouter API key → Access to NVIDIA Nemotron models
- ✅ Tavily API key → Web search capabilities for your agents
- ✅ Secure storage in `.env` file
- ✅ Understanding of why each service is needed

---

## 🐛 Troubleshooting

### **"Invalid API Key" Error**
- Make sure you copied the entire key (they're long!)
- Check for extra spaces before/after the key in `.env`
- Verify the key format matches the examples above

### **"Rate Limit Exceeded"**
- OpenRouter free tier: $1 credit limit
- Tavily free tier: 1,000 searches/month
- Both reset monthly or you can add credits

### **Can't Access OpenRouter**
- Some countries may require a VPN
- Try signing in with GitHub instead of email

---

## 📊 Checking Your Usage

### **OpenRouter:**
- Dashboard: https://openrouter.ai/activity
- See credits remaining and usage statistics

### **Tavily:**
- Dashboard: https://app.tavily.com/home
- See API calls remaining this month

---

## ✅ Ready for Next Steps!

Once you have both keys:
1. Stored in your `.env` file
2. Tested (optional but recommended)
3. Verified they're not in git

You're ready to build your first agent! 🚀

Let me know when you're done, and we'll create the requirements.txt together!
