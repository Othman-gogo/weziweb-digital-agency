import emailjs from '@emailjs/browser'

// Direct EmailJS Configuration (no environment variables to avoid issues)
const CONFIG = {
  serviceId: 'service_l9ih3ca',
  templateId: 'template_cxelb0k',
  publicKey: 'mDabFQLvIth7thgGU'
}

// Initialize EmailJS immediately
emailjs.init(CONFIG.publicKey)
console.log('🔧 EmailJS Simple Service Initialized')

// Simple email sending function
export const sendEmail = async (formData, formType = 'contact') => {
  try {
    console.log('📧 Sending email with data:', formData)
    
    // Prepare email parameters
    const emailParams = {
      to_name: 'Othman Taoufik',
      from_name: formData.name || formData.from_name || 'Unknown User',
      from_email: formData.email || formData.from_email || 'no-email@provided.com',
      reply_to: formData.email || formData.from_email || 'no-email@provided.com',
      phone: formData.phone || 'Not provided',
      company: formData.company || 'Not provided',
      subject: formData.subject || `${formType} Form Submission`,
      message: formData.message || formData.challenge || 'No message provided',
      
      // Consultation specific fields
      time_slot: formData.timeSlot || formData.time_slot || 'Not specified',
      budget: formData.budget || 'Not specified',
      urgency: formData.urgency || 'Not specified',
      challenge: formData.challenge || formData.message || 'Not specified',
      
      // Additional fields
      timestamp: new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Casablanca',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      form_type: formType
    }

    console.log('📧 Email parameters prepared:', emailParams)

    // Send email using EmailJS
    const result = await emailjs.send(
      CONFIG.serviceId,
      CONFIG.templateId,
      emailParams,
      CONFIG.publicKey
    )

    console.log('✅ Email sent successfully:', result)
    return { success: true, result }

  } catch (error) {
    console.error('❌ Email sending failed:', error)
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      text: error.text
    })
    return { success: false, error: error.message || 'Unknown error' }
  }
}

// Specific functions for different form types
export const sendConsultationBooking = (bookingData) => {
  console.log('📅 Sending consultation booking...')
  return sendEmail(bookingData, 'Consultation Booking')
}

export const sendContactMessage = (contactData) => {
  console.log('💌 Sending contact message...')
  return sendEmail(contactData, 'Contact Message')
}

export const sendNewsletterSubscription = (subscriberData) => {
  console.log('📧 Sending newsletter subscription...')
  return sendEmail({
    name: subscriberData.name || 'Newsletter Subscriber',
    email: subscriberData.email,
    subject: 'Newsletter Subscription',
    message: 'New newsletter subscription request'
  }, 'Newsletter Subscription')
}

// Debug function to test email configuration
export const testEmailSetup = async () => {
  console.log('🧪 Testing email setup...')
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+212 666 580 883',
    company: 'Test Company',
    subject: 'EmailJS Test',
    message: 'This is a test message to verify EmailJS configuration.',
    timeSlot: 'Morning (9AM - 12PM)',
    budget: '$5000 - $10000',
    urgency: 'Within 1 month',
    challenge: 'Testing email functionality'
  }

  const result = await sendConsultationBooking(testData)
  
  if (result.success) {
    console.log('✅ Email test successful! Check othman.taoufik20000@gmail.com')
  } else {
    console.error('❌ Email test failed:', result.error)
  }
  
  return result
}

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  window.testWeziWebEmail = testEmailSetup
}

export default { sendEmail, sendConsultationBooking, sendContactMessage, sendNewsletterSubscription, testEmailSetup }