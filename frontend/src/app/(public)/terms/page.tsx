'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

const sections = [
  { title: '1. Introduction', content: 'Welcome to Flight Fare Predictor. By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.' },
  { title: '2. User Accounts', content: 'You must create an account to use certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.' },
  { title: '3. Use of Service', content: 'Our platform provides flight fare predictions for informational purposes only. Predictions are based on historical data and machine learning models, and actual prices may vary. We do not guarantee the accuracy of predictions and are not liable for any decisions made based on our predictions.' },
  { title: '4. Intellectual Property', content: 'All content, features, and functionality of our platform, including but not limited to text, graphics, logos, and software, are owned by Flight Fare Predictor and are protected by intellectual property laws.' },
  { title: '5. User Data', content: 'We collect and process personal data as described in our Privacy Policy. By using our service, you consent to such processing and warrant that all data provided by you is accurate.' },
  { title: '6. Limitation of Liability', content: 'Flight Fare Predictor shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the platform. Our total liability shall not exceed the amount paid by you for accessing our services.' },
  { title: '7. Termination', content: 'We reserve the right to terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.' },
  { title: '8. Changes to Terms', content: 'We may modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform after any modifications indicates your acceptance of the new terms.' },
  { title: '9. Governing Law', content: 'These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in India.' },
  { title: '10. Contact', content: 'For any questions about these Terms, please contact us through our Contact page or email us at support@flightfarepredictor.com.' },
]

export default function TermsPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-950">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-6">
              <FileText className="w-4 h-4 mr-1.5" />
              Terms & Conditions
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
              Terms and <span className="gradient-text">Conditions</span>
            </h1>
            <p className="text-secondary-500">Last updated: March 1, 2024</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="neo-card rounded-2xl p-6"
              >
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">{section.title}</h2>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
