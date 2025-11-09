import emailjs from '@emailjs/browser'
import { notify, notificationPresets } from '../components/enhanced/NotificationSystem'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_l9ih3ca' // Your actual EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_cxelb0k' // Your actual EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'mDabFQLvIth7thgGU' // Your actual EmailJS public key
const ADMIN_EMAIL = 'othman.taoufik20000@gmail.com' // Your working email with EmailJS configured

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

class EmailService {
  constructor() {
    this.isConfigured = EMAILJS_SERVICE_ID !== 'your_service_id'
  }

  // Send consultation booking email
  async sendConsultationRequest(formData) {
    const loadingToast = notify.loading('Booking your consultation...')
    
    try {
      if (!this.isConfigured) {
        // Simulate API call for demo
        await this.simulateEmailSending()
        notify.success('🎉 Consultation request sent! (Demo mode)', { id: loadingToast })
        return { success: true, message: 'Demo mode - consultation booked!' }
      }

      const templateParams = {
        to_name: 'Othman Taoufik',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        company: formData.company,
        challenge: formData.challenge,
        time_slot: formData.timeSlot,
        budget: formData.budget,
        urgency: formData.urgency,
        message: `
          New Consultation Request:
          
          Name: ${formData.name}
          Email: ${formData.email}
          Phone: ${formData.phone}
          Company: ${formData.company}
          
          Preferred Time: ${formData.timeSlot}
          Budget: ${formData.budget}
          Timeline: ${formData.urgency}
          
          Challenge Description:
          ${formData.challenge}
        `,
        reply_to: formData.email
      }

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )

      notify.success(
        '🎉 Consultation booked! I\'ll contact you within 24 hours.',
        { id: loadingToast, duration: 6000 }
      )

      return { success: true, message: 'Consultation request sent successfully!' }

    } catch (error) {
      console.error('Email sending failed:', error)
      
      notify.error(
        'Booking failed. Please try again or email directly.',
        { id: loadingToast }
      )

      return { 
        success: false, 
        message: 'Failed to send consultation request. Please try again.' 
      }
    }
  }

  // Send general contact form email
  async sendContactMessage(formData) {
    const loadingToast = notify.loading('Sending your message...')
    
    try {
      if (!this.isConfigured) {
        await this.simulateEmailSending()
        notify.success(
          `Thank you ${formData.name}! Message sent successfully. (Demo mode)`,
          { id: loadingToast }
        )
        return { success: true, message: 'Demo mode - message sent!' }
      }

      const templateParams = {
        to_name: 'Othman Taoufik',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      }

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID, // Use the same template for all communications
        templateParams
      )

      notify.success(
        `Thank you ${formData.name}! I'll get back to you within 24 hours.`,
        { id: loadingToast, duration: 5000 }
      )

      return { success: true, message: 'Message sent successfully!' }

    } catch (error) {
      console.error('Email sending failed:', error)
      
      notify.error(
        'Message failed to send. Please try again.',
        { id: loadingToast }
      )

      return { 
        success: false, 
        message: 'Failed to send message. Please try again.' 
      }
    }
  }

  // Send lead capture email
  async sendLeadCaptureEmail(leadData) {
    const loadingToast = notify.loading('Sending lead information...')
    
    try {
      const templateParams = {
        to_name: 'Othman Taoufik',
        to_email: ADMIN_EMAIL,
        lead_name: leadData.name,
        lead_email: leadData.email,
        lead_phone: leadData.phone || 'Not provided',
        lead_company: leadData.company || 'Not provided',
        business_challenge: leadData.businessChallenge || 'Not specified',
        conversation_summary: leadData.conversation?.map(msg => 
          `${msg.role}: ${msg.content}`
        ).join('\n\n') || 'No conversation data',
        timestamp: new Date().toLocaleString(),
        subject: `New Lead from WeziWeb Chatbot: ${leadData.name}`,
        message: `
🎯 New Lead Captured via WeziWeb Chatbot

📋 LEAD INFORMATION:
Name: ${leadData.name}
Email: ${leadData.email}
Phone: ${leadData.phone || 'Not provided'}
Company: ${leadData.company || 'Not provided'}

💬 BUSINESS CHALLENGE:
${leadData.businessChallenge || 'Not specified yet'}

⏰ Captured: ${new Date().toLocaleString()}
🌐 Source: WeziWeb Chatbot

---
This lead was automatically captured through the WeziWeb website chatbot.
Follow up within 24 hours for best results.
        `,
        reply_to: leadData.email
      }

      // EmailJS is now properly configured - remove demo mode
      console.log('Sending real email via EmailJS with credentials:', {
        service: EMAILJS_SERVICE_ID,
        template: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY
      })

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )

      notify.success(
        '📧 Lead information sent to Othman!',
        { id: loadingToast, duration: 4000 }
      )

      return { success: true, message: 'Lead email sent successfully!' }

    } catch (error) {
      console.error('Lead email sending failed:', error)
      
      notify.error(
        'Failed to send lead info. Lead saved locally.',
        { id: loadingToast }
      )

      return { 
        success: false, 
        message: 'Failed to send lead email. Information saved locally.' 
      }
    }
  }

  // Send newsletter subscription
  async subscribeToNewsletter(email, name = '') {
    const loadingToast = notify.loading('Subscribing to newsletter...')
    
    try {
      if (!this.isConfigured) {
        await this.simulateEmailSending()
        notify.success(
          '🚀 Welcome aboard! You\'ll receive automation tips and insights. (Demo)',
          { id: loadingToast }
        )
        return { success: true, message: 'Demo mode - subscribed!' }
      }

      const templateParams = {
        to_name: 'Othman Taoufik',
        subscriber_email: email,
        subscriber_name: name,
        message: `New newsletter subscription: ${name} (${email})`
      }

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID, // Use same template for consistency
        templateParams
      )

      notify.success(
        '🚀 Welcome! You\'ll receive automation tips and industry insights.',
        { id: loadingToast, duration: 5000 }
      )

      return { success: true, message: 'Successfully subscribed to newsletter!' }

    } catch (error) {
      console.error('Newsletter subscription failed:', error)
      
      notify.error(
        'Subscription failed. Please try again.',
        { id: loadingToast }
      )

      return { 
        success: false, 
        message: 'Failed to subscribe. Please try again.' 
      }
    }
  }

  // Simulate email sending for demo purposes
  async simulateEmailSending() {
    return new Promise(resolve => {
      setTimeout(resolve, 1500) // Simulate network delay
    })
  }

  // Form validation helpers
  validateConsultationForm(formData) {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.challenge.trim()) {
      errors.challenge = 'Please describe your business challenge'
    } else if (formData.challenge.length < 10) {
      errors.challenge = 'Please provide more details about your challenge'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  validateContactForm(formData) {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      errors.message = 'Please provide a more detailed message'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Setup instructions for EmailJS
export const EMAILJS_SETUP_INSTRUCTIONS = `
🔧 EmailJS Setup Instructions:

1. Sign up at https://www.emailjs.com/
2. Create a new service (Gmail, Outlook, etc.)
3. Create email templates:
   - Consultation template with variables: {{from_name}}, {{from_email}}, {{challenge}}, etc.
   - Contact template with variables: {{from_name}}, {{subject}}, {{message}}
   - Newsletter template with variables: {{subscriber_email}}, {{subscriber_name}}
4. Replace the configuration values in emailService.js:
   - EMAILJS_SERVICE_ID
   - EMAILJS_TEMPLATE_ID
   - EMAILJS_PUBLIC_KEY

Current Status: Demo mode (emails are simulated)
`