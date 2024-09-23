import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import ThemeSwitcher from '@/components/ThemeSwitch';
import { ThemeProvider } from '@/components/ThemeProvider';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="rsbuild-ui-theme" >
      <div className='w-full min-h-screen'>
        <div className='flex flex-col justify-center items-center w-full'>
          <ThemeSwitcher />
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          <Outlet />
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          This is footer
        </div>
      </div>
    </ThemeProvider>
  ),
})
