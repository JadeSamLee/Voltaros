
'use client'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/icons/Logo'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Zap,
  BarChart3,
  FileText,
  Lightbulb,
  GitBranch,
  Share2,
  Download,
  ChevronRight,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export default function LandingPage() {
  const router = useRouter()

  const workflowSteps = [
    {
      icon: Zap,
      title: 'Trigger',
      description: 'Initiate targeted chaos experiments like pod crashes or latency injections.',
    },
    {
      icon: BarChart3,
      title: 'Analyze',
      description: 'The system observes the impact in real-time, collecting vital metrics on performance.',
    },
    {
      icon: FileText,
      title: 'Report',
      description: 'Receive detailed reports with resilience scores and actionable insights for improvement.',
    },
  ]

  const features = [
    {
      icon: Lightbulb,
      title: 'AI Suggestions',
      description: 'Let AI analyze your system and suggest the most impactful experiments to run.',
    },
    {
      icon: GitBranch,
      title: 'Automated Workflows',
      description: 'Chain multiple experiments together to recreate complex, real-world failure scenarios.',
    },
    {
      icon: Share2,
      title: 'Seamless Integrations',
      description: 'Connect directly to your cloud infrastructure like GKE, Cloud Run, and more.',
    },
    {
      icon: Download,
      title: 'Downloadable Reports',
      description: 'Generate professional PDF reports for each experiment to share with your team.',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Logo className="mr-2 size-6 text-primary" />
            <span className="font-bold">VOLTAROS</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button onClick={() => router.push('/dashboard')}>
              Explore Dashboard
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-headline text-4xl font-bold md:text-6xl lg:text-7xl">
              Resilience, Redefined
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Voltaros is an AI-powered chaos engineering platform designed to help you build unbreakable systems. Proactively discover vulnerabilities before they cause outages.
            </p>
            <div className="mt-8">
              <Button size="lg" onClick={() => router.push('/dashboard')}>
                Get Started
                <ChevronRight className="ml-2 size-5" />
              </Button>
            </div>
          </motion.div>
        </section>

        <section id="workflow" className="bg-muted/40 py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                The Workflow
              </h2>
              <p className="mt-4 text-muted-foreground">
                A simple, powerful three-step process to strengthen your applications.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {workflowSteps.map((step, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <div className="rounded-lg border bg-card p-6 text-center shadow-card-stacked">
                    <div className="mb-4 inline-flex items-center justify-center rounded-md bg-primary/10 p-3">
                      <step.icon className="size-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Powerful Features
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to run sophisticated chaos experiments with ease.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <div className="rounded-lg border bg-card p-6 shadow-card-stacked">
                    <feature.icon className="mb-4 size-8 text-accent" />
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Voltaros. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
