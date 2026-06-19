'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Moon, Sun, Trash2, Globe, Mail, Shield, Palette } from 'lucide-react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
        checked
          ? 'bg-primary-500 shadow-sm shadow-primary-500/30'
          : 'bg-secondary-300 dark:bg-secondary-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const { theme, setTheme } = useTheme()
  const darkMode = theme === 'dark'

  useEffect(() => setMounted(true), [])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Settings</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">Customize your experience and manage preferences.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white text-sm">Email Notifications</p>
                    <p className="text-xs text-secondary-500">Receive price alerts via email</p>
                  </div>
                </div>
                <Toggle checked={emailNotif} onChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-100 dark:bg-accent-950 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white text-sm">Push Notifications</p>
                    <p className="text-xs text-secondary-500">Receive price alerts in browser</p>
                  </div>
                </div>
                <Toggle checked={pushNotif} onChange={setPushNotif} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          {mounted && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      darkMode
                        ? 'bg-secondary-700 text-secondary-200'
                        : 'bg-warning-100 text-warning-600'
                    }`}>
                      {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-white text-sm">Dark Mode</p>
                      <p className="text-xs text-secondary-500">Toggle dark theme</p>
                    </div>
                  </div>
                  <Toggle checked={darkMode} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-danger-200 dark:border-danger-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-danger-500 to-danger-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
