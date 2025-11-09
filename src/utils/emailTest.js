// EmailJS Test Utility
import emailjs from '@emailjs/browser'

export const testEmailConfiguration = async () => {
  console.log('🧪 Testing EmailJS Configuration...')
  
  const testParams = {
    to_name: 'Othman Taoufik',
    from_name: 'Test User',
    from_email: 'test@example.com',
    phone: '+212 666 580 883',
    company: 'Test Company',
    subject: 'Test Email from WeziWeb',
    message: 'This is a test email to verify EmailJS configuration.',
    time_slot: 'Morning (9AM - 12PM)',
    budget: '$5000 - $10000',
    urgency: 'Within 1 month',
    challenge: 'Testing the email system functionality',
    reply_to: 'test@example.com',
    timestamp: new Date().toLocaleString()
  }

  try {
    const result = await emailjs.send(
      'service_l9ih3ca',
      'template_cxelb0k', 
      testParams,
      'mDabFQLvIth7thgGU'
    )
    
    console.log('✅ Email test successful:', result)
    return { success: true, result }
  } catch (error) {
    console.error('❌ Email test failed:', error)
    return { success: false, error }
  }
}

// Add this to browser console to test:
// window.testEmail = testEmailConfiguration