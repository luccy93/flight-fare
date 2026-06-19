'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

const faqs = [
  { q: 'How accurate are the flight fare predictions?', a: 'Our ML models achieve over 94% accuracy on average. We use ensemble methods combining Random Forest, XGBoost, CatBoost, and LightGBM to ensure the most reliable predictions. The confidence score is displayed with each prediction so you can make informed decisions.' },
  { q: 'What data do you use to predict fares?', a: 'We analyze historical flight data including airline pricing patterns, route popularity, seasonal trends, day of week effects, holiday impacts, and real-time market conditions. Our models are retrained regularly to maintain accuracy.' },
  { q: 'Is this service free to use?', a: 'We offer a free tier with limited monthly predictions. Premium plans are available for frequent travelers and businesses needing unlimited predictions and advanced analytics.' },
  { q: 'How far in advance can I predict fares?', a: 'You can predict fares up to 365 days in advance. Generally, predictions are most accurate for bookings 30-90 days ahead, which we identify as the "cheapest booking window."' },
  { q: 'Do you support international flights?', a: 'Currently we support domestic Indian routes with major airlines including IndiGo, Air India, Vistara, SpiceJet, GoAir, and more. International route support is coming soon.' },
  { q: 'How do I save my favorite routes?', a: 'After creating an account, you can save routes from the prediction page. Saved routes appear in your dashboard for quick access and price monitoring.' },
  { q: 'Can I access predictions on mobile?', a: 'Yes! Our platform is fully responsive and works on all devices - desktop, tablet, and mobile. The mobile experience is optimized for on-the-go access.' },
  { q: 'How often are the ML models updated?', a: 'Models are retrained weekly with the latest data to ensure optimal performance. We continuously monitor model accuracy and retrain if there\'s any degradation in prediction quality.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use industry-standard encryption, JWT authentication, and follow security best practices. Your personal information and prediction history are protected and never shared with third parties.' },
  { q: 'How do I delete my account?', a: 'You can delete your account from the Settings page in your dashboard. This will permanently remove all your data including prediction history and saved routes.' },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="overflow-hidden">
      <section className="relative py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-950">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-6">
              FAQ
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400">
              Everything you need to know about our flight fare prediction service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-md mx-auto mb-10"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <Input
              placeholder="Search FAQs..."
              className="pl-11 h-12"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="neo-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors ${
                      openIndex === index ? 'text-primary-500' : 'text-secondary-400'
                    }`} />
                    <span className="font-medium text-secondary-900 dark:text-white">{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-secondary-400 transition-all duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180 text-primary-500' : ''
                  }`} />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-14 text-secondary-600 dark:text-secondary-400 leading-relaxed border-t border-secondary-200 dark:border-secondary-700 pt-4 text-sm">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
