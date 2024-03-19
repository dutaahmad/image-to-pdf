"use client"

import React from 'react'
import Link from 'next/link'
import { ModeToggle } from './theme-toggle'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { ChevronLeftIcon } from '@radix-ui/react-icons'

const NavbarSimplified = () => {
    const path = usePathname()
    if (path !== "/") return (
        <div className="flex justify-between fixed inset-x-4 top-4">
            <Button variant={"ghost"} size={"icon"} asChild>
                <Link href={"/"}>
                    <ChevronLeftIcon className="h-4 w-4" />
                </Link>
            </Button>
            <ModeToggle />
        </div>
    ); else return (
        <div className="flex justify-end fixed inset-x-4 top-4">
            <ModeToggle />
        </div>
    );
}

export default NavbarSimplified