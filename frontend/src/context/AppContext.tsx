'use client'

import React, { createContext, useState, ReactNode } from 'react'

export type ExperimentResult = {
  status: string
  result: {
    target: string
    action: string
    outcome: string
    timestamp: string
    details?: string
  }
}

export type Report = {
  id: string
  name: string
  date: string
  status: 'Completed' | 'Action Required' | 'In Progress'
  resilienceScore: number
  result?: ExperimentResult['result'] // Pointing to the nested result object
}

type AppContextType = {
  reports: Report[]
  isExperimentRunning: boolean
  triggerExperiment: (
    type: 'pod_crash' | 'latency' | 'resource',
    name: string
  ) => Promise<Report>
}

const initialReports: Report[] = [
  {
    id: 'rep-073',
    name: 'Pod Deletion Test - Checkout Service',
    date: '2025-06-24T18:30:00Z',
    status: 'Completed',
    resilienceScore: 7.5,
    result: {
      target: 'gke-us-central1-a/prod-cluster/checkout-service-pod-abc456',
      action: 'pod_crash',
      outcome:
        'SUCCESS - Pod successfully terminated and a new instance was scheduled and became healthy.',
      timestamp: '2025-06-24T18:30:00Z',
      details:
        'Sent SIGKILL to pod checkout-service-pod-abc456. A new pod was scheduled and passed readiness probes in 52 seconds.',
    },
  },
  {
    id: 'rep-072',
    name: 'API Gateway Latency Injection Analysis',
    date: '2025-06-22T11:00:00Z',
    status: 'Completed',
    resilienceScore: 9.1,
    result: {
      target: 'api-gateway',
      action: 'latency_injection',
      outcome:
        'SUCCESS - System handled the 300ms injected latency while staying within SLOs.',
      timestamp: '2025-06-22T11:00:00Z',
      details:
        'Injected 300ms latency to all outbound network traffic from the API gateway service for 5 minutes.',
    },
  },
  {
    id: 'rep-071',
    name: 'Database Failover Test (Post-Patch)',
    date: '2025-06-20T09:15:00Z',
    status: 'Completed',
    resilienceScore: 8.8,
    result: {
      target: 'prod-db-cluster',
      action: 'database_failover',
      outcome:
        'SUCCESS - Primary database failed over to replica in 32 seconds with no data loss.',
      timestamp: '2025-06-20T09:15:00Z',
      details:
        'Connection pool successfully re-established connections after failover.',
    },
  },
  {
    id: 'rep-070',
    name: 'Database Failover Test (Pre-Patch)',
    date: '2025-06-18T14:05:00Z',
    status: 'Action Required',
    resilienceScore: 6.4,
    result: {
      target: 'prod-db-cluster',
      action: 'database_failover',
      outcome:
        'FAILURE - Failover took 3 minutes and resulted in brief data inconsistency.',
      timestamp: '2025-06-18T14:05:00Z',
      details:
        'Applications experienced connection timeouts during the extended failover window.',
    },
  },
  {
    id: 'rep-069',
    name: 'Full Platform Blackout Test',
    date: '2025-06-17T16:45:00Z',
    status: 'Completed',
    resilienceScore: 8.9,
    result: {
      target: 'all-systems',
      action: 'region_failure',
      outcome:
        'SUCCESS - All critical services recovered automatically in the failover region within 15 minutes.',
      timestamp: '2025-06-17T16:45:00Z',
      details:
        'A full regional outage was triggered. DNS routing and data replication performed as expected.',
    },
  },
]

export const AppContext = createContext<AppContextType>({
  reports: initialReports,
  isExperimentRunning: false,
  triggerExperiment: async () =>
    Promise.reject(new Error('triggerExperiment called outside of provider')),
})

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [isExperimentRunning, setIsExperimentRunning] = useState(false)

  const triggerExperiment = (
    type: 'pod_crash' | 'latency' | 'resource',
    name: string
  ): Promise<Report> => {
    return new Promise((resolve) => {
      setIsExperimentRunning(true)

      const newReportId = `rep-${String(
        (parseInt(reports[0]?.id.split('-')[1] || '73') + 1)
      ).padStart(3, '0')}`

      // Use a consistent date for the experiment to avoid hydration issues
      // and keep the demo data consistent.
      const latestDate = new Date(reports[0]?.date || '2025-06-24T18:30:00Z')
      latestDate.setHours(latestDate.getHours() + 2) // Add 2 hours to the last report time
      const experimentDate = latestDate.toISOString()

      const newReport: Report = {
        id: newReportId,
        name: name,
        date: experimentDate,
        status: 'In Progress',
        resilienceScore: 0,
      }

      setReports((prevReports) => [newReport, ...prevReports])

      setTimeout(() => {
        let experimentResult: ExperimentResult
        const resilienceScore = +(Math.random() * 4 + 6).toFixed(1)
        const status: Report['status'] =
          resilienceScore < 7 ? 'Action Required' : 'Completed'

        switch (type) {
          case 'pod_crash':
            experimentResult = {
              status: 'experiment_run_success',
              result: {
                target:
                  'gke-us-central1-a/prod-cluster/checkout-service-pod-xyz123',
                action: 'pod_crash',
                outcome:
                  resilienceScore < 7
                    ? 'FAILURE - Pod did not recover within the 5-minute SLA.'
                    : 'SUCCESS - Pod successfully terminated and a new instance was scheduled and became healthy.',
                timestamp: experimentDate,
                details:
                  'Sent SIGKILL to pod checkout-service-pod-xyz123 in the default namespace. GKE controller manager detected the failure and initiated self-healing. A new pod was scheduled and passed readiness probes in 45 seconds.',
              },
            }
            break
          case 'latency':
            experimentResult = {
              status: 'experiment_run_success',
              result: {
                target: 'api-gateway',
                action: 'latency_injection',
                outcome:
                  resilienceScore < 7
                    ? 'DEGRADED - API p99 response times exceeded the 500ms SLO, peaking at 850ms.'
                    : 'SUCCESS - System handled the 300ms injected latency while staying within SLOs.',
                timestamp: experimentDate,
                details:
                  'Injected 300ms latency to all outbound network traffic from the API gateway service for 5 minutes. Monitored p95 and p99 response times via integrated Prometheus metrics.',
              },
            }
            break
          case 'resource':
            experimentResult = {
              status: 'experiment_run_success',
              result: {
                target: 'inventory-service-deployment',
                action: 'cpu_exhaustion',
                outcome:
                  resilienceScore < 7
                    ? 'FAILURE - HPA failed to scale up the deployment in time, leading to request timeouts.'
                    : 'SUCCESS - Kubernetes HPA correctly detected high CPU load and scaled the deployment from 3 to 5 replicas.',
                timestamp: experimentDate,
                details:
                  'Stressed CPU on all pods in the inventory-service deployment to 90% for 10 minutes. The Horizontal Pod Autoscaler (HPA) triggered a scale-up event after 60 seconds and added two new replicas to handle the load.',
              },
            }
            break
        }

        const finalReport: Report = {
          id: newReportId,
          name: name,
          date: experimentDate,
          status,
          resilienceScore,
          result: experimentResult.result,
        }

        setReports((prevReports) =>
          prevReports.map((r) => (r.id === newReportId ? finalReport : r))
        )
        setIsExperimentRunning(false)
        resolve(finalReport)
      }, 10000)
    })
  }

  return (
    <AppContext.Provider
      value={{ reports, isExperimentRunning, triggerExperiment }}
    >
      {children}
    </AppContext.Provider>
  )
}
