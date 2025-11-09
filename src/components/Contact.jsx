import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Twitter, Github } from 'lucide-react'
import { sendContactMessage } from '../services/simpleEmailService'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('📧 Contact form submitted with data:', formData)
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      const result = await sendContactMessage(formData)
      console.log('📧 Contact email result:', result)

      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "othman@weziweb.com",
      action: "mailto:othman@weziweb.com",
      description: "Best for detailed project discussions"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+212 666 580 883",
      action: "tel:+212666580883",
      description: "For urgent matters and quick questions"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Remote Worldwide",
      action: null,
      description: "Serving clients globally"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      value: "Within 24 hours",
      action: null,
      description: "Typically much faster"
    }
  ]

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/othman-taoufik-b992721a0/"
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      name: "X (Twitter)",
      url: "https://x.com/othmantaou"
    },
    {
      icon: <Github className="w-5 h-5" />,
      name: "GitHub",
      url: "https://github.com/Othman-gogo"
    }
  ]

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Get In Touch</span>
            <br />
            <span className="text-gray-900">Let's Build Something Amazing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your business with intelligent automation? I'd love to hear about your challenges 
            and explore how we can work together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-semibold mb-8 text-gray-900">
              Multiple Ways to <span className="gradient-text">Connect</span>
            </h3>

            <div className="space-y-6 mb-8">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    method.action ? 'hover:bg-white hover:shadow-lg cursor-pointer' : 'bg-white'
                  }`}
                  onClick={() => method.action && window.open(method.action)}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-wezi-gradient rounded-xl flex items-center justify-center text-white">
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{method.title}</h4>
                    <p className="text-wezi-blue-500 font-medium mb-1">{method.value}</p>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow My Work</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white hover:bg-wezi-gradient text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-display font-semibold mb-6 text-gray-900">
                Send a <span className="gradient-text">Quick Message</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wezi-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wezi-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wezi-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wezi-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tell me about your project or question..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">✅ Message sent successfully! I'll get back to you within 24 hours.</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">❌ Failed to send message. Please try again or email me directly.</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  💡 <strong>Pro tip:</strong> For faster response and more detailed discussion, 
                  consider booking a free strategy session instead.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-display font-bold mb-8">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 text-left border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">How long does a typical project take?</h4>
              <p className="text-gray-600">Most automation projects take 2-6 weeks depending on complexity. I provide detailed timelines during our strategy session.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-left border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Do you work with small businesses?</h4>
              <p className="text-gray-600">Absolutely! I work with businesses of all sizes, from startups to enterprises. Every business can benefit from automation.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-left border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">What if I'm not sure what to automate?</h4>
              <p className="text-gray-600">That's exactly what the free strategy session is for! I'll help identify the best opportunities for automation in your business.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-left border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Do you provide ongoing support?</h4>
              <p className="text-gray-600">Yes! I offer maintenance packages and can train your team to manage the workflows independently if preferred.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact