"use client"

import Link from 'next/link'
import React from 'react'
import { ModeToggle } from './theme-toggle'
import { usePathname } from 'next/navigation'

const menus = [
    {
        name: 'Home',
        path: '/',
    },
    {
        name: 'Features',
        path: '/features',
    },
    {
        name: 'Pricing',
        path: '/pricing',
    },
    {
        name: 'Contact',
        path: '/contact',
    },
]

const Menus = ({ menus, currentPath }: { menus: { name: string; path: string }[], currentPath: string }) => (
    <>
        {menus.map(menu => (
            <Link
                key={menu.name}
                className={`flex items-center text-sm font-medium ${currentPath === menu.path ? "text-black dark:text-white" : ""} transition-colors hover:text-gray-900/90 dark:text-gray-400 dark:hover:text-gray-50/90`}
                href={menu.path}
            >
                {menu.name}
            </Link>
        ))}
    </>
)

const NavigationBar = () => {

    const path = usePathname()

    return (
        <div className="flex items-center justify-end w-[30%] rounded-3xl mx-auto p-6 px-4 md:px-6 fixed inset-x-0 top-4 z-10 bg-white/80 border shadow-lg dark:bg-white/10 backdrop-filter backdrop-blur-md bg-opacity-50">
            <nav className="hidden space-x-4 md:flex gap-12 w-full items-center justify-center">
                <Menus menus={menus} currentPath={path} />
            </nav>
            <ModeToggle />
        </div>
    )
}

export default NavigationBar