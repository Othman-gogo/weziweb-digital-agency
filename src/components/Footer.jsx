import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Mail, Phone, MapPin, Linkedin, Twitter, Github, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const quickLinks = [
    { label: 'Services', action: () => scrollToSection('services') },
    { label: 'About', action: () => scrollToSection('about') },
    { label: 'Portfolio', action: () => scrollToSection('portfolio') },
    { label: 'Contact', action: () => scrollToSection('contact') }
  ]

  const services = [
    'AI Workflow Automation',
    'n8n Development',
    'Process Optimization',
    'Digital Marketing',
    'System Integration',
    'Business Intelligence'
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
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='10' r='2'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='50' cy='30' r='2'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Ccircle cx='30' cy='50' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Zap className="w-8 h-8 text-wezi-pink-500" />
                  <div className="absolute inset-0 bg-wezi-gradient rounded-full opacity-20 blur-sm"></div>
                </div>
                <span className="text-2xl font-display font-bold gradient-text">weziweb</span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Transforming businesses through intelligent AI workflows and automation solutions. 
                Expert n8n development by Othman Taoufik.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-wezi-cyan-500" />
                  <a href="mailto:othman@weziweb.com" className="hover:text-white transition-colors duration-200">
                    othman@weziweb.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-wezi-cyan-500" />
                  <a href="tel:+212666580883" className="hover:text-white transition-colors duration-200">
                    +212 666 580 883
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-wezi-cyan-500" />
                  <span>Remote Worldwide</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-display font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={link.action}
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => scrollToSection('consultation')}
                    className="text-wezi-cyan-500 hover:text-wezi-cyan-400 transition-colors duration-200 font-medium"
                  >
                    Book Consultation
                  </button>
                </li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-display font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="text-gray-300 flex items-center space-x-2">
                    <div className="w-1 h-1 bg-wezi-green-500 rounded-full"></div>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter & Social */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-display font-semibold mb-6">Stay Connected</h3>
              
              {/* Newsletter Signup */}
              <div className="mb-6">
                <p className="text-gray-300 mb-4 text-sm">
                  Get automation tips and industry insights delivered to your inbox.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-wezi-blue-500 focus:border-transparent transition-all duration-200 text-white"
                  />
                  <button className="px-4 py-2 bg-wezi-gradient text-white rounded-r-lg hover:shadow-lg transition-all duration-200">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-gray-300 mb-4 text-sm">Follow my work</p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-wezi-gradient text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 WeziWeb. All rights reserved. Built with ❤️ by Othman Taoufik.
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Terms of Service
                </a>
                
                {/* Back to Top */}
                <button
                  onClick={scrollToTop}
                  className="w-10 h-10 bg-gray-800 hover:bg-wezi-gradient text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="Back to top"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer