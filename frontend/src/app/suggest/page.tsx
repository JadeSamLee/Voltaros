'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Lightbulb, TestTubeDiagonal } from 'lucide-react'
import {
  SuggestExperimentsInput,
  SuggestExperimentsOutput,
  suggestExperiments,
} from '@/ai/flows/suggest-experiments'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  historicalData: z.string().min(50, {
    message: 'Please provide at least 50 characters of historical data.',
  }),
  systemBehavior: z.string().min(50, {
    message: 'Please provide at least 50 characters of system description.',
  }),
})

export default function SuggestPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SuggestExperimentsOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalData: '',
      systemBehavior: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setResult(null)
    try {
      const response = await suggestExperiments(values as SuggestExperimentsInput)
      setResult(response)
    } catch (error) {
      console.error('Failed to get suggestions:', error)
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to fetch AI suggestions. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          AI Experiment Suggestions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let Gemini suggest chaos experiments based on your system's context.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>System Context</CardTitle>
              <CardDescription>
                Provide details about your system for tailored suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="historicalData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Historical Data & Logs</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste relevant logs, past incident reports, or performance metrics..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe past failures, high-traffic events, or deployment issues.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="systemBehavior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Architecture & Behavior</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Microservices architecture with Kafka, running on GKE. Checkout service depends on payment and inventory services..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Explain your system's components and their interactions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} size="lg">
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Lightbulb className="mr-2 h-5 w-5" />
                    )}
                    {loading ? 'Analyzing...' : 'Get Suggestions'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {loading || result ? (
              <Card className="sticky top-8 shadow-2xl">
                <CardHeader>
                  <CardTitle>AI-Generated Suggestions</CardTitle>
                  <CardDescription>
                    {loading
                      ? 'Gemini is thinking...'
                      : 'Review the suggested experiments below.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading && (
                    <div className="flex flex-col items-center justify-center p-12">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-4 text-muted-foreground">
                        Generating tailored experiments...
                      </p>
                    </div>
                  )}
                  {result && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Rationale:</h4>
                        <p className="text-muted-foreground text-sm">
                          {result.rationale}
                        </p>
                      </div>
                      <div className="mt-6 space-y-3">
                        <h4 className="font-semibold text-lg">
                          Suggested Experiments:
                        </h4>
                        <ul className="list-none space-y-3">
                          {result.experiments.map((exp, index) => (
                            <motion.li
                              key={index}
                              className="flex items-start gap-3 rounded-md border p-3"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <TestTubeDiagonal className="h-5 w-5 flex-shrink-0 text-accent mt-1" />
                              <span>{exp}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
