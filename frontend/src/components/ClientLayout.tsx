'use client'

import { usePathname } from 'next/navigation'
import {
  BarChart3,
  GitBranch,
  LayoutDashboard,
  Lightbulb,
  Share2,
  Zap,
} from 'lucide-react'

import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Logo } from './icons/Logo'

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // Don't show sidebar on the landing page
  if (pathname === '/') {
    return <>{children}</>
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/experiments', label: 'Experiments', icon: Zap },
    { href: '/workflows', label: 'Workflows', icon: GitBranch },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/integrations', label: 'Integrations', icon: Share2 },
    { href: '/suggest', label: 'AI Suggestions', icon: Lightbulb },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <Logo className="size-8 text-sidebar-primary" />
            <h1 className="font-headline text-xl font-bold text-sidebar-foreground">
              VOLTAROS
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
