import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, CheckCircle, User, Mail, Phone, MessageSquare, Briefcase, Sparkles, Target, TrendingUp, Zap } from 'lucide-react'
import { gsap } from 'gsap'
import { sendConsultationBooking, testEmailSetup } from '../../services/simpleEmailService'
import { notify } from '../enhanced/NotificationSystem'

const EnhancedConsultation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    challenge: '',
    timeSlot: '',
    budget: '',
    urgency: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const sectionRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    // GSAP animations for the section
    const ctx = gsap.context(() => {
      gsap.fromTo('.consultation-header', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.fromTo('.consultation-content', 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step >= 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      if (!formData.company.trim()) newErrors.company = 'Company is required'
    }

    if (step >= 2) {
      if (!formData.challenge.trim()) {
        newErrors.challenge = 'Please describe your business challenge'
      } else if (formData.challenge.length < 20) {
        newErrors.challenge = 'Please provide more details (minimum 20 characters)'
      }
    }

    if (step >= 3) {
      if (!formData.timeSlot) newErrors.timeSlot = 'Please select a preferred time slot'
    }

    return newErrors
  }

  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep)
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
      setErrors({})
    } else {
      setErrors(stepErrors)
      // Show first error
      const firstError = Object.values(stepErrors)[0]
      notify.error(firstError)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const finalErrors = validateStep(totalSteps)
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors)
      notify.error('Please fix the form errors before submitting')
      return
    }

    setIsLoading(true)

    try {
      const result = await sendConsultationBooking(formData)
      
      if (result.success) {
        setIsSubmitted(true)
        
        // Trigger success animation
        gsap.fromTo('.success-animation', 
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
        )
      } else {
        notify.error('Failed to book consultation. Please try again or contact directly.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      notify.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const timeSlots = [
    '9:00 AM - 9:30 AM',
    '10:00 AM - 10:30 AM',
    '11:00 AM - 11:30 AM',
    '2:00 PM - 2:30 PM',
    '3:00 PM - 3:30 PM',
    '4:00 PM - 4:30 PM'
  ]

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Custom Strategy Blueprint",
      description: "Get a personalized automation roadmap tailored to your specific business needs and challenges."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "ROI Analysis & Timeline",
      description: "Understand the potential time savings, cost reductions, and financial impact of automation."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Wins Identification",
      description: "Discover immediate automation opportunities that can be implemented within 30 days."
    }
  ]

  if (isSubmitted) {
    return (
      <section ref={sectionRef} id="consultation" className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="success-animation bg-white rounded-3xl p-12 shadow-xl border border-green-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-200 rounded-full opacity-30"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                <span className="gradient-text">Consultation Booked!</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Thank you <span className="font-semibold text-wezi-blue-500">{formData.name}</span>! 
                Your strategy session has been successfully scheduled.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4 text-left max-w-2xl mx-auto bg-gray-50 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
              <div className="space-y-3">
                {[
                  "I'll contact you within 24 hours to confirm your session",
                  "You'll receive a calendar invite with video call details",
                  "We'll dive deep into your automation opportunities",
                  "You'll get a custom strategy blueprint for your business"
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 bg-wezi-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-600">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100"
            >
              <p className="text-sm text-blue-700">
                📧 <strong>Urgent questions?</strong> Email me directly at{' '}
                <a href="mailto:othman@weziweb.com" className="font-semibold hover:underline">
                  othman@weziweb.com
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="consultation" className="section-padding bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="consultation-header text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-wezi-pink-500" />
              <span className="text-sm font-semibold text-wezi-blue-500 uppercase tracking-wider">Free Strategy Session</span>
              <Sparkles className="w-6 h-6 text-wezi-pink-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Book Your <span className="gradient-text">30-Minute</span>
              <br />
              <span className="text-gray-900">AI Automation Discovery Call</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Let's uncover the hidden automation opportunities in your business. 
              No sales pitch—just valuable insights and a clear roadmap to 3x your efficiency.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits Section */}
          <div className="consultation-content space-y-8">
            <div>
              <h3 className="text-2xl font-display font-semibold mb-6 text-gray-900">
                What You'll Get in <span className="gradient-text">30 Minutes</span>
              </h3>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-wezi-gradient rounded-xl flex items-center justify-center text-white">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600 italic mb-2">
                    "In just 30 minutes, Othman identified automation opportunities worth $50K annually. 
                    Best business call I've ever made!"
                  </p>
                  <p className="text-sm font-semibold text-gray-900">— Sarah Chen, E-commerce Director</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Multi-Step Form */}
          <div className="consultation-content">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="text-sm font-medium text-wezi-blue-500">
                    {Math.round((currentStep / totalSteps) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-wezi-gradient h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Let's get to know you
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                              errors.name 
                                ? 'border-red-300 focus:ring-2 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-2 focus:ring-wezi-blue-500'
                            }`}
                            placeholder="Your full name"
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                              errors.email 
                                ? 'border-red-300 focus:ring-2 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-2 focus:ring-wezi-blue-500'
                            }`}
                            placeholder="your@email.com"
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wezi-blue-500 transition-all duration-200"
                            placeholder="+212 666 580 883"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 inline mr-2" />
                            Company Name *
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                              errors.company 
                                ? 'border-red-300 focus:ring-2 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-2 focus:ring-wezi-blue-500'
                            }`}
                            placeholder="Your company name"
                          />
                          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Business Challenge */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Tell us about your challenges
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MessageSquare className="w-4 h-4 inline mr-2" />
                          What's your biggest business challenge? *
                        </label>
                        <textarea
                          name="challenge"
                          value={formData.challenge}
                          onChange={handleInputChange}
                          rows="6"
                          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                            errors.challenge 
                              ? 'border-red-300 focus:ring-2 focus:ring-red-500' 
                              : 'border-gray-200 focus:ring-2 focus:ring-wezi-blue-500'
                          }`}
                          placeholder="Describe the repetitive tasks, inefficiencies, or manual processes that are slowing down your business. The more specific, the better I can help!"
                        />
                        {errors.challenge && <p className="text-red-500 text-sm mt-1">{errors.challenge}</p>}
                        <p className="text-gray-500 text-sm mt-2">
                          {formData.challenge.length} characters (minimum 20 recommended)
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget Range
                          </label>
                          <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wezi-blue-500 transition-all duration-200"
                          >
                            <option value="">Select budget range</option>
                            <option value="under-5k">Under $5,000</option>
                            <option value="5k-15k">$5,000 - $15,000</option>
                            <option value="15k-50k">$15,000 - $50,000</option>
                            <option value="50k-plus">$50,000+</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timeline
                          </label>
                          <select
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wezi-blue-500 transition-all duration-200"
                          >
                            <option value="">When do you need this?</option>
                            <option value="asap">ASAP (Urgent)</option>
                            <option value="1-month">Within 1 month</option>
                            <option value="3-months">Within 3 months</option>
                            <option value="exploring">Just exploring options</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Scheduling */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Choose your preferred time
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Available Time Slots (EST) *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((slot, index) => (
                            <label
                              key={index}
                              className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                formData.timeSlot === slot
                                  ? 'border-wezi-blue-500 bg-wezi-blue-50'
                                  : 'border-gray-200 hover:border-wezi-blue-300 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="timeSlot"
                                value={slot}
                                checked={formData.timeSlot === slot}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium">{slot}</span>
                              {formData.timeSlot === slot && (
                                <CheckCircle className="w-5 h-5 text-wezi-blue-500 ml-auto" />
                              )}
                            </label>
                          ))}
                        </div>
                        {errors.timeSlot && <p className="text-red-500 text-sm mt-2">{errors.timeSlot}</p>}
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-blue-700">
                          ⏰ <strong>Note:</strong> All times are in Eastern Standard Time (EST). 
                          I'll send a calendar invite with the exact meeting details after confirmation.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className={`px-6 py-3 border border-gray-300 rounded-lg font-medium transition-all duration-200 ${
                      currentStep === 1 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-wezi-gradient text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-wezi-gradient text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Booking Session...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5" />
                          <span>Book My Strategy Session</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {currentStep === totalSteps && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting this form, you agree to receive communication from WeziWeb. 
                    Your information is secure and will never be shared.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EnhancedConsultation