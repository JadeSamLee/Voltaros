'use client'
import { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  Zap,
  ServerCrash,
  Clock,
  Cpu,
  FileText,
} from 'lucide-react'
import { AppContext, Report } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default function ExperimentsPage() {
  const router = useRouter()
  const { triggerExperiment, isExperimentRunning } = useContext(AppContext)
  const [result, setResult] = useState<Report | null>(null)
  const [triggeredExperimentType, setTriggeredExperimentType] = useState<
    string | null
  >(null)

  const handleTriggerExperiment = (
    type: 'pod_crash' | 'latency' | 'resource',
    name: string
  ) => {
    setResult(null)
    setTriggeredExperimentType(type)
    triggerExperiment(type, name).then((finalReport) => {
      setResult(finalReport)
      setTriggeredExperimentType(null)
    })
  }

  const ExperimentTab = ({
    type,
    title,
    icon: Icon,
    description,
    buttonText,
    experimentName,
  }: {
    type: 'pod_crash' | 'latency' | 'resource'
    title: string
    icon: React.ElementType
    description: string
    buttonText: string
    experimentName: string
  }) => (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            className="h-16 px-12 text-lg font-bold"
            onClick={() => handleTriggerExperiment(type, experimentName)}
            disabled={isExperimentRunning}
          >
            {isExperimentRunning && triggeredExperimentType === type ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Zap className="mr-2 h-6 w-6" />
            )}
            {isExperimentRunning && triggeredExperimentType === type
              ? 'Initiating...'
              : buttonText}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Chaos Experiments
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select and trigger a fault injection experiment on your target system.
        </p>
      </motion.div>

      <Card className="mt-8 shadow-card-stacked">
        <CardContent className="p-0">
          <Tabs defaultValue="pod_crash" className="w-full">
            <TabsList className="grid w-full grid-cols-1 rounded-none rounded-t-lg md:grid-cols-3">
              <TabsTrigger value="pod_crash">Pod Failure</TabsTrigger>
              <TabsTrigger value="latency">Latency Injection</TabsTrigger>
              <TabsTrigger value="resource">Resource Exhaustion</TabsTrigger>
            </TabsList>
            <TabsContent value="pod_crash">
              <ExperimentTab
                type="pod_crash"
                title="Pod Crash Test"
                icon={ServerCrash}
                description="Terminate a random pod in a target deployment to test self-healing."
                buttonText="Trigger Pod Crash"
                experimentName="Pod Crash Test - Web Server"
              />
            </TabsContent>
            <TabsContent value="latency">
              <ExperimentTab
                type="latency"
                title="Latency Injection"
                icon={Clock}
                description="Introduce network delay to test service resilience to slow dependencies."
                buttonText="Inject Latency"
                experimentName="API Gateway Latency Injection"
              />
            </TabsContent>
            <TabsContent value="resource">
              <ExperimentTab
                type="resource"
                title="Resource Exhaustion"
                icon={Cpu}
                description="Simulate high CPU or memory usage to test scaling and performance."
                buttonText="Exhaust Resources"
                experimentName="Inventory Service CPU Exhaustion"
              />
            </TabsContent>
          </Tabs>

          <AnimatePresence>
            {isExperimentRunning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-8 text-center"
              >
                <p className="text-muted-foreground">
                  Contacting GKE cluster... injecting fault...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 pt-0"
              >
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle>Experiment Complete!</CardTitle>
                    <CardDescription>
                      The '{result.name}' experiment has finished.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Resilience Score
                        </p>
                        <p className="text-2xl font-bold">
                          {result.resilienceScore.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge
                          variant={
                            result.status === 'Action Required'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.result?.outcome}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => router.push('/reports')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Full Report
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
