'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Search, RefreshCw, AlertCircle, Info, UserCheck, AlertTriangle, ListOrdered } from 'lucide-react'

const logs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  event: ['User Login', 'Prediction Made', 'User Registered', 'Model Retrained', 'Error Occurred'][i % 5],
  user: ['john@example.com', 'jane@example.com', 'System', 'admin@flightfare.com', 'bob@example.com'][i % 5],
  type: ['info', 'success', 'warning', 'info', 'error'][i % 5],
  details: `Action completed successfully - log entry #${i + 1}`
}))

const typeConfig: Record<string, { color: string; bg: string; dot: string }> = {
  info: { color: 'text-primary-600', bg: 'bg-primary-100 dark:bg-primary-950', dot: 'bg-primary-500' },
  success: { color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-950', dot: 'bg-success-500' },
  warning: { color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-950', dot: 'bg-warning-500' },
  error: { color: 'text-danger-600', bg: 'bg-danger-100 dark:bg-danger-950', dot: 'bg-danger-500' }
}

const typeIcons: Record<string, any> = {
  info: Info,
  success: UserCheck,
  warning: AlertTriangle,
  error: AlertCircle
}

const typeFilterOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
]

export default function LogsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.type !== filter) return false
    if (search && !log.event.toLowerCase().includes(search.toLowerCase()) && !log.user.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">System Logs</h1>
          <p className="text-sm text-secondary-500 mt-1">Monitor system activity and events.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <Input
            placeholder="Search logs..."
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={typeFilterOptions}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ListOrdered className="h-5 w-5 text-primary-600 mr-2" />
              Event Logs
              <Badge variant="secondary" className="ml-3 text-xs">{filteredLogs.length} entries</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {filteredLogs.map((log, i) => {
                const Icon = typeIcons[log.type]
                const config = typeConfig[log.type]
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${config.dot} border-2 border-white dark:border-secondary-900`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">{log.event}</p>
                      <p className="text-xs text-secondary-500 truncate">{log.details}</p>
                    </div>
                    <div className="hidden sm:block text-right text-xs flex-shrink-0">
                      <p className="text-secondary-500">{log.user}</p>
                      <p className="text-secondary-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge variant="secondary" className={`${config.bg} ${config.color} border-0 text-xs flex-shrink-0`}>
                      {log.type}
                    </Badge>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
