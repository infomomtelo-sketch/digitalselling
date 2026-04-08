
## AI Consultation Chat Flow

### How it works:
1. **User submits service request** → saved to database, confirmation email sent
2. **User is redirected to a consultation chat page** (`/consultation/:requestId`)
3. **AI reads the request details** and starts a conversation offering options:
   - Design style preferences (modern, minimal, bold, etc.)
   - Color palette suggestions
   - Layout recommendations
   - Feature priorities
   - Content structure
4. **User answers questions & confirms choices** through the chat
5. **AI generates a final project brief** summarizing all confirmed decisions
6. **Brief is saved** and you (the owner) get notified with the complete plan

### What gets built:
- **New edge function** (`ai-consultation`) — powers the AI chat using Lovable AI
- **New database table** (`consultation_messages`) — stores the chat history per request
- **New page** (`/consultation/:id`) — the chat UI
- **Updated service request flow** — redirects to consultation after submission
- **Updated `service_requests` table** — adds a `brief` column to store the final plan

### The AI will:
- Greet the user by name and reference their request details
- Ask targeted questions one at a time
- Offer 2-3 options per question with recommendations
- Summarize choices and ask for final confirmation
- Generate a structured brief once confirmed
