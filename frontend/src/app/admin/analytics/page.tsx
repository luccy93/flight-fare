'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FareTrendChart from '@/components/charts/FareTrendChart'
import AirlineComparisonChart from '@/components/charts/AirlineComparisonChart'
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart'
import { TrendingUp, Brain, Users, BarChart3, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
}

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Predictions', value: '12,847', change: '+12.5%', icon: BarChart3, gradient: 'from-primary-500 to-primary-600' },
    { label: 'Avg. Confidence', value: '94.2%', change: '+2.1%', icon: Brain, gradient: 'from-accent-500 to-accent-600' },
    { label: 'Active Users', value: '1,203', change: '+8.3%', icon: Users, gradient: 'from-success-500 to-success-600' },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-secondary-500 mt-1">Comprehensive analytics and insights.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="success" className="flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-secondary-500">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fare Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <FareTrendChart />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Airline Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <AirlineComparisonChart />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
