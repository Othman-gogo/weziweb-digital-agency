import { GoogleGenAI } from "@google/genai"
import { notify } from '../components/enhanced/NotificationSystem'
import { SIMPLE_CHATBOT_CONFIG } from '../config/simpleConfig.js'
import { sendEmail } from './simpleEmailService'

// Initialize Google Gemini AI with API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDZkqbG1lUIYirzskN2rA0Ue8uOfNPOrFU'
const ai = new GoogleGenAI({
  apiKey: API_KEY
})

class ChatbotService {
  constructor() {
    this.conversationHistory = []
    this.systemPrompt = SIMPLE_CHATBOT_CONFIG.systemPrompt // Use simple direct prompt
    this.leadData = {
      name: '',
      email: '', 
      phone: '',
      company: '',
      industry: '',
      businessChallenge: '',
      servicesNeeded: [],
      collectionStep: 0, // 0: name, 1: email, 2: phone, 3: business info
      emailSent: false,
      qualified: false
    }
  }

  async sendMessage(userMessage) {
    try {
      // Check for lead information in the message
      this.extractLeadData(userMessage)

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      })

      // Build conversation context with lead data
      const leadContext = this.getLeadContext()
      const conversationContext = this.conversationHistory
        .slice(-6) // Keep last 6 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')

      // Create simple prompt with just the essential context
      const fullPrompt = `${this.systemPrompt}

CONVERSATION HISTORY:
${conversationContext}

USER MESSAGE: ${userMessage}

RESPOND HELPFULLY:`

      // Generate response using the new Gemini API structure
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: fullPrompt,
      })
      const aiResponse = response.text

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      })

      // Keep conversation history manageable
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-16)
      }

      // Check if we have complete lead data and send email
      if (this.isLeadComplete()) {
        this.sendLeadEmail()
      }

      return {
        success: true,
        message: aiResponse,
        timestamp: new Date().toISOString(),
        leadData: this.leadData
      }

    } catch (error) {
      console.error('Chatbot error:', error)
      
      // Handle specific error types
      if (error.message?.includes('API key')) {
        return {
          success: false,
          message: "I'm having trouble connecting right now. Please contact Othman directly at othman.taoufik2000@gmail.com or book a consultation through the form on this page.",
          error: 'API_KEY_ERROR'
        }
      }

      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        return {
          success: false,
          message: "I'm currently at capacity. For immediate assistance, please email othman.taoufik2000@gmail.com or use the contact form below.",
          error: 'QUOTA_ERROR'
        }
      }

      return {
        success: false,
        message: "I'm experiencing technical difficulties. Please try again in a moment, or contact Othman directly at othman.taoufik2000@gmail.com.",
        error: 'GENERAL_ERROR'
      }
    }
  }

  // Predefined quick responses for common questions
  getQuickReplies() {
    return SIMPLE_CHATBOT_CONFIG.quickReplies
  }

  // Get conversation starter messages
  getWelcomeMessage() {
    return {
      success: true,
      message: SIMPLE_CHATBOT_CONFIG.welcomeMessage,
      timestamp: new Date().toISOString(),
      isWelcome: true
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = []
    this.clearLeadData() // Also clear lead data when clearing history
    return {
      success: true,
      message: SIMPLE_CHATBOT_CONFIG.welcomeMessage,
      timestamp: new Date().toISOString()
    }
  }

  // Get suggested questions based on current context
  getSuggestedQuestions() {
    const suggestions = [
      "How much does automation cost?",
      "What's included in the free consultation?",
      "Can you show me automation examples?",
      "How long does implementation take?",
      "What ROI can I expect?",
      "Do you work with my industry?"
    ]

    // Return 3 random suggestions
    return suggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
  }

  // Analytics tracking for chatbot usage
  trackInteraction(type, data = {}) {
    const event = {
      type,
      timestamp: new Date().toISOString(),
      ...data
    }
    
    // Store in localStorage for basic analytics
    const interactions = JSON.parse(localStorage.getItem('weziweb_chat_analytics') || '[]')
    interactions.push(event)
    
    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100)
    }
    
    localStorage.setItem('weziweb_chat_analytics', JSON.stringify(interactions))
    
    return event
  }

  // Extract lead data from user messages
  extractLeadData(message) {
    const lowercaseMessage = message.toLowerCase()
    
    // Step-based collection: name first, then email, then phone
    if (!this.leadData.name && this.collectionStep === 0) {
      // More aggressive name detection for first response
      const namePatterns = [
        /(?:i'm|i am|my name is|call me|name's|name is)\s+([a-zA-Z\s]{2,30})/i,
        /^([a-zA-Z\s]{2,30})$/i, // Just a name by itself
        /hi,?\s*i'm\s+([a-zA-Z\s]{2,30})/i,
        /hello,?\s*([a-zA-Z\s]{2,30})/i
      ]
      
      for (const pattern of namePatterns) {
        const nameMatch = message.match(pattern)
        if (nameMatch) {
          const extractedName = nameMatch[1].trim()
          // Exclude common non-names
          const excludeWords = ['yes', 'no', 'sure', 'okay', 'thanks', 'hello', 'hi', 'good', 'great']
          if (extractedName.split(' ').length <= 4 && 
              !excludeWords.includes(extractedName.toLowerCase())) {
            this.leadData.name = extractedName
            this.collectionStep = 1
            this.trackInteraction('name_collected', { name: extractedName })
            break
          }
        }
      }
    }

    // Extract email - more patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    const emailMatch = message.match(emailRegex)
    if (emailMatch && !this.leadData.email) {
      this.leadData.email = emailMatch[0]
      this.collectionStep = Math.max(this.collectionStep, 2)
      this.trackInteraction('email_collected', { email: emailMatch[0] })
    }

    // Extract phone number (various formats)
    const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(?:\+?[0-9]{1,3}[-.\s]?)?[0-9]{10,}/
    const phoneMatch = message.match(phoneRegex)
    if (phoneMatch && !this.leadData.phone) {
      this.leadData.phone = phoneMatch[0]
      this.collectionStep = Math.max(this.collectionStep, 3)
      this.trackInteraction('phone_collected', { phone: phoneMatch[0] })
    }

    // Extract company/industry info
    const businessPatterns = [
      /(?:work at|company is|from|business is|industry is|we are|i run)\s+([a-zA-Z\s&.,]{2,50})/i,
      /(?:i represent|we do|specializ\w+ in)\s+([a-zA-Z\s&.,]{2,50})/i
    ]
    
    for (const pattern of businessPatterns) {
      const businessMatch = message.match(pattern)
      if (businessMatch && !this.leadData.company) {
        this.leadData.company = businessMatch[1].trim()
        this.trackInteraction('company_collected', { company: businessMatch[1] })
        break
      }
    }

    // Extract industry keywords
    const industryKeywords = ['retail', 'ecommerce', 'healthcare', 'finance', 'real estate', 
                             'education', 'consulting', 'manufacturing', 'tech', 'startup', 
                             'restaurant', 'fitness', 'legal', 'accounting', 'marketing']
    
    for (const keyword of industryKeywords) {
      if (lowercaseMessage.includes(keyword) && !this.leadData.industry) {
        this.leadData.industry = keyword
        break
      }
    }

    // Store business challenges/needs
    const challengeKeywords = ['challenge', 'problem', 'need help', 'automate', 'inefficient', 
                              'time consuming', 'manual', 'struggling', 'difficulty']
    
    if (challengeKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      if (!this.leadData.businessChallenge || this.leadData.businessChallenge.length < message.length) {
        this.leadData.businessChallenge = message
      }
    }

    // Track service interest
    const serviceKeywords = {
      'web development': ['website', 'web app', 'landing page', 'ecommerce'],
      'automation': ['automate', 'workflow', 'n8n', 'process', 'integration'],
      'digital marketing': ['marketing', 'seo', 'social media', 'email campaign', 'ads']
    }

    for (const [service, keywords] of Object.entries(serviceKeywords)) {
      if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        if (!this.leadData.servicesNeeded.includes(service)) {
          this.leadData.servicesNeeded.push(service)
        }
      }
    }
  }

  // Get lead collection context for AI
  getLeadContext() {
    const collected = []
    const missing = []
    
    if (this.leadData.name) collected.push(`Name: ${this.leadData.name}`)
    else missing.push('name')
    
    if (this.leadData.email) collected.push(`Email: ${this.leadData.email}`)
    else missing.push('email')
    
    if (this.leadData.phone) collected.push(`Phone: ${this.leadData.phone}`)
    else missing.push('phone (optional)')
    
    if (this.leadData.company) collected.push(`Company: ${this.leadData.company}`)
    if (this.leadData.industry) collected.push(`Industry: ${this.leadData.industry}`)
    if (this.leadData.servicesNeeded.length > 0) collected.push(`Services: ${this.leadData.servicesNeeded.join(', ')}`)
    
    let context = `✅ COLLECTED: ${collected.join(', ') || 'None'}\n`
    context += `❌ MISSING: ${missing.join(', ') || 'All basic info collected!'}\n`
    context += `📊 COLLECTION STEP: ${this.collectionStep}/3\n`
    
    // Specific guidance based on collection step
    if (!this.leadData.name) {
      context += `\n🎯 PRIORITY: Must get their NAME first. Ask directly: "What's your name?"`
    } else if (!this.leadData.email) {
      context += `\n🎯 PRIORITY: Must get EMAIL next. Use their name: "Thanks ${this.leadData.name}! What's your email address?"`
    } else if (!this.leadData.phone) {
      context += `\n🎯 PRIORITY: Try to get PHONE number: "And your phone number so Othman can reach you directly?"`
    } else {
      context += `\n🎯 READY: All contact info collected! Now focus on business discovery and service matching.`
    }
    
    return context
  }

  // Check if we have minimum lead data
  isLeadComplete() {
    return this.leadData.name && this.leadData.email && !this.leadData.emailSent
  }

  // Send lead data via email
  async sendLeadEmail() {
    if (this.leadData.emailSent) return
    
    try {
      // Mark as sent to prevent duplicates
      this.leadData.emailSent = true
      
      // Prepare email data
      const emailData = {
        to_email: 'othman.taoufik2000@gmail.com',
        subject: `New Lead from WeziWeb Chatbot: ${this.leadData.name}`,
        message: `
🎯 New Lead Captured via WeziWeb Chatbot

📋 LEAD INFORMATION:
Name: ${this.leadData.name}
Email: ${this.leadData.email}
Phone: ${this.leadData.phone || 'Not provided'}
Company: ${this.leadData.company || 'Not provided'}

💬 BUSINESS CHALLENGE:
${this.leadData.businessChallenge || 'Not specified yet'}

🗣️ CONVERSATION SUMMARY:
${this.conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')}

⏰ Captured: ${new Date().toLocaleString()}
🌐 Source: WeziWeb Chatbot

---
This lead was automatically captured through the WeziWeb website chatbot.
        `,
        from_name: 'WeziWeb Chatbot',
        lead_data: this.leadData
      }

      // Send via EmailJS (we'll use a simple fetch as backup)
      await this.sendEmailViaService(emailData)
      
      // Store lead in localStorage as backup
      this.storeLeadLocally()
      
      this.trackInteraction('lead_email_sent', { email: this.leadData.email })
      
      console.log('Lead email sent successfully:', this.leadData)
      
    } catch (error) {
      console.error('Failed to send lead email:', error)
      this.leadData.emailSent = false // Reset so we can try again
    }
  }

  // Send email via EmailJS or fallback service
  async sendEmailViaService(emailData) {
    try {
      // Use the integrated email service
      const result = await emailService.sendLeadCaptureEmail({
        ...this.leadData,
        conversation: this.conversationHistory
      })
      
      if (result.success) {
        console.log('Lead email sent successfully via emailService')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      // Fallback: Store for manual retrieval
      console.log('Email service unavailable, storing lead locally:', error)
      this.storeLeadLocally()
    }
  }

  // Store lead data locally as backup
  storeLeadLocally() {
    const leads = JSON.parse(localStorage.getItem('weziweb_leads') || '[]')
    leads.push({
      ...this.leadData,
      conversation: this.conversationHistory,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('weziweb_leads', JSON.stringify(leads))
  }

  // Get collected leads (for admin view)
  getCollectedLeads() {
    return JSON.parse(localStorage.getItem('weziweb_leads') || '[]')
  }

  // Clear current lead data
  clearLeadData() {
    this.leadData = {
      name: '',
      email: '', 
      phone: '',
      company: '',
      businessChallenge: '',
      collectionStep: 0,
      emailSent: false
    }
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService()

// Export configuration for setup
export const CHATBOT_CONFIG = {
  name: 'WeziWeb AI Assistant',
  avatar: '🤖',
  primaryColor: '#0066FF',
  accentColor: '#00CCFF',
  welcomeMessage: true,
  quickReplies: true,
  suggestedQuestions: true,
  maxHistoryLength: 20,
  typingDelay: 1000,
  features: [
    'AI-powered responses',
    'Business-focused conversations',
    'Lead qualification',
    'Consultation booking guidance',
    'Service information',
    'Portfolio showcase'
  ]
}