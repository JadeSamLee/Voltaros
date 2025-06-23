'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CheckCircle2, Plug } from 'lucide-react'
import {
  GkeIcon,
  CloudRunIcon,
  BigQueryIcon,
  VertexAiIcon,
} from '@/components/icons/GcpIcons'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

const integrations = [
  {
    name: 'Google Kubernetes Engine',
    icon: GkeIcon,
    description: 'Orchestrate experiments on GKE clusters.',
    id: 'gke',
  },
  {
    name: 'Cloud Run',
    icon: CloudRunIcon,
    description: 'Target serverless containers with fault injections.',
    id: 'cloud-run',
  },
  {
    name: 'BigQuery',
    icon: BigQueryIcon,
    description: 'Use BQ as a data source for experiment analysis.',
    id: 'bigquery',
  },
  {
    name: 'Vertex AI',
    icon: VertexAiIcon,
    description: 'Leverage AI for experiment suggestions and analysis.',
    id: 'vertex-ai',
  },
]

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
  },
}

export default function IntegrationsPage() {
  const { toast } = useToast()
  const [connected, setConnected] = useState<string[]>([
    'gke',
    'vertex-ai',
    'bigquery',
    'cloud-run',
  ])

  const handleConnect = (id: string) => {
    const isConnected = connected.includes(id)
    if (isConnected) {
      setConnected(connected.filter((c) => c !== id))
      toast({
        title: 'Disconnected!',
        description: `Successfully disconnected from ${
          integrations.find((i) => i.id === id)?.name
        }.`,
      })
    } else {
      setConnected([...connected, id])
      toast({
        title: 'Connected!',
        description: `Successfully integrated with ${
          integrations.find((i) => i.id === id)?.name
        }.`,
      })
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Platform Integrations
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect Voltaros to your Google Cloud services.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {integrations.map((integration) => {
          const isConnected = connected.includes(integration.id)
          return (
            <motion.div key={integration.id} variants={itemVariants}>
              <Card className="flex h-full flex-col justify-between shadow-card-stacked">
                <CardHeader>
                  <integration.icon className="mb-4 h-12 w-12 text-primary" />
                  <CardTitle>{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={isConnected ? 'secondary' : 'default'}
                    onClick={() => handleConnect(integration.id)}
                  >
                    {isConnected ? (
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                    ) : (
                      <Plug className="mr-2 h-5 w-5" />
                    )}
                    {isConnected ? 'Connected' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
