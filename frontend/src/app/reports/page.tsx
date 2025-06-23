'use client'
import { useContext } from 'react'
import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import jsPDF from 'jspdf'
import { AppContext, Report } from '@/context/AppContext'

export default function ReportPage() {
  const { toast } = useToast()
  const { reports } = useContext(AppContext)

  const getResilienceSummary = (score: number, status: string) => {
    if (status === 'Action Required') {
      return 'Anomalies were detected that require further investigation. Key metrics deviated beyond acceptable thresholds, suggesting a potential vulnerability.'
    }
    if (score > 8.5) {
      return 'The system performed exceptionally well, showing high resilience and recovering quickly from the injected fault without any significant degradation.'
    }
    if (score > 7) {
      return 'The system performed within expected parameters and successfully recovered from the injected fault. Some minor performance degradation was observed but was within acceptable limits.'
    }
    return 'The system struggled to handle the injected fault, showing significant performance degradation or recovery issues. This scenario highlights a potential area of weakness that needs to be addressed.'
  }

  const handleDownload = (report: Report) => {
    if (report.status === 'In Progress') {
      toast({
        variant: 'destructive',
        title: 'Report Not Ready',
        description: 'Please wait for the experiment to complete.',
      })
      return
    }

    try {
      const doc = new jsPDF()
      let yPos = 20

      // Header
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.text('VOLTAROS', 105, yPos, { align: 'center' })
      yPos += 8
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100)
      doc.text('Chaos Experiment Report', 105, yPos, { align: 'center' })
      yPos += 15

      doc.setDrawColor(200)
      doc.setLineWidth(0.5)
      doc.line(20, yPos - 5, 190, yPos - 5)

      // --- Report Details ---
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Report Overview', 20, yPos)
      yPos += 10
      const details = [
        { label: 'Report Name:', value: report.name },
        { label: 'Report ID:', value: report.id },
        {
          label: 'Date Generated:',
          value: new Date(report.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          }),
        },
        { label: 'Status:', value: report.status },
        {
          label: 'Resilience Score:',
          value: report.resilienceScore.toFixed(1),
        },
      ]
      doc.setFontSize(11)
      details.forEach((detail) => {
        doc.setFont('helvetica', 'bold')
        doc.text(detail.label, 20, yPos)
        doc.setFont('helvetica', 'normal')
        doc.text(String(detail.value), 65, yPos)
        yPos += 8
      })
      yPos += 5

      // --- Experiment Execution Details ---
      if (report.result) {
        doc.line(20, yPos - 3, 190, yPos - 3)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(16)
        doc.text('Experiment Execution Details', 20, yPos + 5)
        yPos += 15
        const execDetails = [
          { label: 'Target System:', value: report.result.target },
          {
            label: 'Action Taken:',
            value: report.result.action.replace(/_/g, ' ').toUpperCase(),
          },
          {
            label: 'Timestamp:',
            value: new Date(report.result.timestamp).toUTCString(),
          },
          { label: 'Outcome:', value: report.result.outcome },
        ]
        doc.setFontSize(11)
        execDetails.forEach((detail) => {
          doc.setFont('helvetica', 'bold')
          doc.text(detail.label, 20, yPos)
          doc.setFont('helvetica', 'normal')
          const splitValue = doc.splitTextToSize(String(detail.value), 120)
          doc.text(splitValue, 65, yPos)
          yPos += splitValue.length * 5 + 3
        })
        yPos += 2

        doc.setFont('helvetica', 'bold')
        doc.text('Details:', 20, yPos)
        yPos += 6
        doc.setFont('helvetica', 'normal')
        const detailsText = doc.splitTextToSize(
          report.result.details || 'No additional details provided.',
          170
        )
        doc.text(detailsText, 20, yPos)
        yPos += doc.getTextDimensions(detailsText).h + 10
      }

      // --- Summary & Recommendations ---
      doc.line(20, yPos - 3, 190, yPos - 3)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Summary & Recommendations', 20, yPos + 5)
      yPos += 15

      // Summary
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('Summary of Findings:', 20, yPos)
      yPos += 7
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const summaryText = getResilienceSummary(
        report.resilienceScore,
        report.status
      )
      const splitSummary = doc.splitTextToSize(summaryText, 170)
      doc.text(splitSummary, 20, yPos)
      yPos += doc.getTextDimensions(splitSummary).h + 10

      // Recommendations
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('Recommendations:', 20, yPos)
      yPos += 7
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const recommendationText =
        report.status === 'Action Required'
          ? `Based on the '${report.name}' experiment, we recommend investigating the root cause of the detected anomalies. Review application logs and system metrics during the experiment timeframe for the target '${
              report.result?.target || 'system'
            }'. Consider increasing resource limits or implementing more robust failover mechanisms.`
          : `The system behaved as expected during the '${report.name}' experiment. No immediate action is required for this scenario. Continue running regular chaos experiments to ensure ongoing resilience.`
      const splitRecommendation = doc.splitTextToSize(recommendationText, 170)
      doc.text(splitRecommendation, 20, yPos)

      doc.save(`${report.name.replace(/\s/g, '_')}.pdf`)

      toast({
        title: 'Download Started',
        description: `Downloading report: ${report.name}`,
      })
    } catch (e) {
      console.error(e)
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: `Could not generate PDF. Please try again.`,
      })
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Experiment Reports
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Download detailed PDF reports for each chaos experiment.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-card-stacked">
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              Review past experiment outcomes and system resilience scores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Generated
                  </TableHead>
                  <TableHead>Resilience Score</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <motion.tr
                    key={report.id}
                    className="transition-colors hover:bg-muted/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: reports.indexOf(report) * 0.05 }}
                  >
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(report.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </TableCell>
                    <TableCell>
                      {report.status !== 'In Progress' ? (
                        <Badge
                          variant={
                            report.resilienceScore > 8.5
                              ? 'default'
                              : report.resilienceScore > 7
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-base font-bold"
                        >
                          {report.resilienceScore.toFixed(1)}
                        </Badge>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={
                          report.status === 'Completed'
                            ? 'outline'
                            : report.status === 'In Progress'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report)}
                        className="transition-colors hover:bg-primary hover:text-primary-foreground"
                        disabled={report.status === 'In Progress'}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
