'use client'
import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Clock,
  Cpu,
  GripVertical,
  ServerCrash,
  ShieldAlert,
  Save,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const initialSteps = [
  { id: '1', name: 'Inject 100ms Latency', icon: Clock },
  { id: '2', name: 'Verify Health Endpoints', icon: ShieldAlert },
  { id: '3', name: 'Crash 1 Pod in Checkout Svc', icon: ServerCrash },
  { id: '4', name: 'Verify Pod Recovery (5 mins)', icon: ShieldAlert },
  { id: '5', name: 'Spike CPU to 80%', icon: Cpu },
  { id: '6', name: 'Verify HPA Scaling', icon: ShieldAlert },
]

type Step = {
  id: string
  name: string
  icon: React.ElementType
}

function SortableItem({ id, step }: { id: string; step: Step }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="mb-2 flex items-center p-3 shadow-md">
        <div className="flex flex-1 items-center gap-4">
          <button {...listeners} className="cursor-grab p-2">
            <GripVertical className="text-muted-foreground" />
          </button>
          <step.icon className="h-5 w-5 text-primary" />
          <span className="font-medium">{step.name}</span>
        </div>
      </Card>
    </div>
  )
}

function WorkflowSkeleton() {
  return (
    <div>
      {initialSteps.map((step) => (
        <Card
          key={step.id}
          className="mb-2 flex animate-pulse items-center p-3 shadow-md"
        >
          <div className="flex flex-1 items-center gap-4">
            <GripVertical className="text-muted-foreground" />
            <step.icon className="h-5 w-5 text-primary" />
            <span className="font-medium">{step.name}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function WorkflowsPage() {
  const { toast } = useToast()
  const [steps, setSteps] = useState<Step[]>(initialSteps)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = () => {
    toast({
      title: 'Workflow Saved!',
      description: 'Your chaos experiment sequence has been saved.',
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Automated Workflows
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Design and automate complex chaos experiments with a sequence of
          actions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mt-8 shadow-2xl">
          <CardHeader>
            <CardTitle>Weekend Peak Workflow</CardTitle>
            <CardDescription>
              Drag and drop the steps to reorder the experiment sequence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl">
              {hasMounted ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={steps}
                    strategy={verticalListSortingStrategy}
                  >
                    {steps.map((step) => (
                      <SortableItem key={step.id} id={step.id} step={step} />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <WorkflowSkeleton />
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button size="lg" onClick={handleSave}>
                <Save className="mr-2 h-5 w-5" />
                Save Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
