'use client'
import { useContext } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import {
  CheckCircle2,
  GitBranch,
  Gauge,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { AppContext } from '@/context/AppContext'

const resilienceData = [
  { date: '06-17', score: 8.9 },
  { date: '06-18', score: 6.4 },
  { date: '06-20', score: 8.8 },
  { date: '06-22', score: 9.1 },
  { date: '06-24', score: 7.5 },
]

const chartConfig = {
  score: {
    label: 'Resilience Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export default function Dashboard() {
  const router = useRouter()
  const { reports } = useContext(AppContext)

  // Get the two most recent reports for the activity feed
  const recentReports = reports.slice(0, 2)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome back! Here's a snapshot of your system's resilience.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge />
                Resilience Score Over Time
              </CardTitle>
              <CardDescription>
                Weekly trend of your system's calculated resilience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={resilienceData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-score)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-score)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border) / 0.5)"
                      vertical={false}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent indicator="dot" />}
                      cursor={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-score)"
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-semibold">All Systems Operational</p>
                  <p className="text-sm text-muted-foreground">
                    Last check: just now
                  </p>
                </div>
              </div>
              <p className="text-sm">
                No anomalies detected in the last 24 hours. Proactive checks are
                running.
              </p>
              <Button onClick={() => router.push('/experiments')}>
                Run New Experiment
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest experiments and workflows executed on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentReports.map((report) => (
                  <li
                    key={report.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full p-2 ${
                          report.status === 'Action Required'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <GitBranch className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/reports')}
                    >
                      View Report
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
