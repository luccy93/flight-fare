'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, User, ArrowRight, Search, Plane, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const posts = [
  { title: '10 Tips to Find the Cheapest Flight Tickets', date: '2024-03-15', author: 'Travel Experts', excerpt: 'Discover insider tips and tricks to save money on your next flight booking. From timing your purchase to choosing the right airline.', category: 'Travel Tips' },
  { title: 'Understanding Flight Fare Trends in 2024', date: '2024-03-10', author: 'Data Team', excerpt: 'Our data scientists analyze the latest trends in flight pricing. Learn when prices peak and when to book for the best deals.', category: 'Market Analysis' },
  { title: 'Best Time to Book Domestic Flights in India', date: '2024-03-05', author: 'Travel Experts', excerpt: 'Comprehensive guide to booking domestic flights in India. Find out which months offer the best prices and how to plan ahead.', category: 'Travel Tips' },
  { title: 'How AI is Revolutionizing Travel Planning', date: '2024-02-28', author: 'Tech Team', excerpt: 'Artificial intelligence is changing how we plan travel. See how ML models predict prices with over 94% accuracy.', category: 'Technology' },
  { title: 'Top 5 Budget Airlines for Indian Travelers', date: '2024-02-20', author: 'Travel Experts', excerpt: 'Compare the most affordable airlines in India. We break down pricing, service quality, and route coverage.', category: 'Airlines' },
  { title: 'Holiday Travel Guide: Saving on Peak Season Flights', date: '2024-02-15', author: 'Travel Experts', excerpt: 'Don\'t let holiday prices break the bank. Learn strategies to save on flights during Diwali, Christmas, and other peak seasons.', category: 'Seasonal' },
]

const categoryColors: Record<string, string> = {
  'Travel Tips': 'from-primary-500 to-primary-600',
  'Market Analysis': 'from-accent-500 to-accent-600',
  'Technology': 'from-success-500 to-success-600',
  'Airlines': 'from-warning-500 to-warning-600',
  'Seasonal': 'from-purple-500 to-purple-600',
}

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="overflow-hidden">
      <section className="relative py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-950">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-6">
              Our Blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Travel <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Insights, tips, and guides to help you travel smarter and save on flights.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-md mx-auto mb-12">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <Input placeholder="Search articles..." className="pl-11 h-12" value={search} onChange={e => setSearch(e.target.value)} />
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover-lift h-full cursor-pointer overflow-hidden">
                  <div className={`h-48 bg-gradient-to-br ${categoryColors[post.category] || 'from-primary-500 to-primary-600'} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative h-full flex items-center justify-center">
                      {post.category === 'Travel Tips' && <Plane className="h-12 w-12 text-white/30" />}
                      {post.category === 'Market Analysis' && <TrendingUp className="h-12 w-12 text-white/30" />}
                      {post.category === 'Technology' && <div className="text-white/30 text-5xl font-bold">AI</div>}
                      {post.category === 'Airlines' && <Plane className="h-12 w-12 text-white/30" />}
                      {post.category === 'Seasonal' && <Calendar className="h-12 w-12 text-white/30" />}
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-xs text-secondary-500 mb-3">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{post.author}</span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <Button variant="ghost" className="p-0 text-primary-600 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
