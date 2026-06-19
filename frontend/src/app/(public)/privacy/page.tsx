'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const sections = [
  { title: '1. Information We Collect', content: 'We collect information you provide directly, including your name, email address, and account details. We also automatically collect certain information when you use our platform, such as IP address, browser type, device information, and usage data.' },
  { title: '2. How We Use Your Information', content: 'We use your information to provide and improve our flight fare prediction services, personalize your experience, communicate with you about our services, send you marketing communications (with your consent), and detect and prevent fraudulent or unauthorized activities.' },
  { title: '3. Data Sharing and Disclosure', content: 'We do not sell your personal information to third parties. We may share your information with service providers who assist us in operating our platform, if required by law, or to protect our rights and the rights of others.' },
  { title: '4. Cookies and Tracking', content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.' },
  { title: '5. Data Security', content: 'We implement industry-standard security measures including encryption, secure socket layer (SSL) technology, and regular security audits to protect your personal information from unauthorized access, alteration, disclosure, or destruction.' },
  { title: '6. Data Retention', content: 'We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us or through your account settings.' },
  { title: '7. Your Rights', content: 'You have the right to access, correct, update, or delete your personal information. You may also object to or restrict certain processing of your data. You can exercise these rights through your account settings or by contacting us.' },
  { title: '8. Third-Party Services', content: 'Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.' },
  { title: '9. Children\'s Privacy', content: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it.' },
  { title: '10. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our platform after changes constitutes acceptance.' },
  { title: '11. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at privacy@flightfarepredictor.com or through our Contact page.' },
]

export default function PrivacyPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-950">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-6">
              <Shield className="w-4 h-4 mr-1.5" />
              Privacy Policy
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
              Privacy <span className="gradient-text">Policy</span>
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
