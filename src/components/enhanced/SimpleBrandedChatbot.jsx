import React, { useState } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { GoogleGenAI } from '@google/genai'
import { SIMPLE_CHATBOT_CONFIG } from '../../config/simpleConfig'

// Initialize Gemini AI with environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDZkqbG1lUIYirzskN2rA0Ue8uOfNPOrFU'
const ai = new GoogleGenAI({
  apiKey: API_KEY
})

const SimpleBrandedChatbot = () => {
  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: SIMPLE_CHATBOT_CONFIG.welcomeMessage,
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const systemPrompt = SIMPLE_CHATBOT_CONFIG.systemPrompt

  const toggleChat = () => {
    console.log('Chat toggled, isOpen will be:', !isOpen)
    setIsOpen(!isOpen)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage = inputMessage.trim()
    
    // Simple lead data collection - store in localStorage
    let leadData = JSON.parse(localStorage.getItem('weziweb_visitor') || '{}')
    
    // Extract contact info from messages
    const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (emailMatch) {
      leadData.email = emailMatch[0]
      leadData.timestamp = new Date().toISOString()
      localStorage.setItem('weziweb_visitor', JSON.stringify(leadData))
    }
    
    // Extract name (if it's a short response without email/url)
    if (!leadData.name && userMessage.length < 50 && !userMessage.includes('@') && !userMessage.includes('http')) {
      const nameWords = userMessage.trim().split(' ')
      if (nameWords.length <= 3 && /^[a-zA-Z\s]+$/.test(userMessage)) {
        leadData.name = userMessage.trim()
        leadData.timestamp = new Date().toISOString()
        localStorage.setItem('weziweb_visitor', JSON.stringify(leadData))
      }
    }
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      message: userMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsTyping(true)

    try {
      // Enhanced prompt with lead collection guidance
      const leadContext = leadData.name ? `Visitor's name: ${leadData.name}` : 'Name not collected yet'
      const emailContext = leadData.email ? `Email: ${leadData.email}` : 'Email not collected yet'
      
      const prompt = `${systemPrompt}

VISITOR INFO: ${leadContext}, ${emailContext}

User Message: "${userMessage}"

Important: If you don't have their name yet, ask for it naturally. If you have name but no email, ask for email.
Provide a helpful response about WeziWeb's services:`

      // Get AI response from Gemini
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      })
      const aiResponseText = response.text

      // Add AI response
      const aiResponse = {
        id: Date.now() + 1,
        message: aiResponseText,
        isUser: false,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiResponse])

    } catch (error) {
      console.error('AI response error:', error)
      
      // Smart fallback based on collected data - work even without AI connection
      let fallbackMessage
      
      if (!leadData.name) {
        fallbackMessage = "Hey! I'm WeziWeb AI helping Othman connect with clients. What's your name?"
      } else if (!leadData.email) {
        fallbackMessage = `Nice to meet you ${leadData.name}! What's your email address? Othman will send you his portfolio examples.`
      } else {
        fallbackMessage += `Thanks ${leadData.name}! Othman builds websites, automation, and marketing solutions. Contact: othman.taoufik20000@gmail.com 🚀`
      }
      
      const fallbackResponse = {
        id: Date.now() + 1,
        message: fallbackMessage,
        isUser: false,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, fallbackResponse])
    }

    setIsTyping(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(to right, #0066FF, #00CCFF)',
            color: 'white',
            border: 'none',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <MessageCircle size={28} />
          {/* AI Badge */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            backgroundColor: '#00FF88',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            AI
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '320px',
          height: '480px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          border: '1px solid #e5e5e5',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(to right, #0066FF, #00CCFF)',
            padding: '16px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>WeziWeb AI</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>● Online</div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.isUser ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  background: msg.isUser 
                    ? 'linear-gradient(to right, #0066FF, #00CCFF)'
                    : '#f3f4f6',
                  color: msg.isUser ? 'white' : '#374151',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Bot size={16} />
                  <span>WeziWeb AI is thinking</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#6b7280',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out infinite both'
                    }}></div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#6b7280',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                    }}></div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#6b7280',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e5e5',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about automation..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !inputMessage.trim()}
              style={{
                padding: '10px 12px',
                background: isTyping || !inputMessage.trim() 
                  ? '#d1d5db' 
                  : 'linear-gradient(to right, #0066FF, #00CCFF)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isTyping || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isTyping || !inputMessage.trim() ? 0.6 : 1
              }}
            >
              {isTyping ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {/* Powered by */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e5e5',
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            ✨ Powered by WeziWeb AI
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleBrandedChatbot