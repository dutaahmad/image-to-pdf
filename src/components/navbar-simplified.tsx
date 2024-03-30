"use client"

import React from 'react'
import Link from 'next/link'
import { ModeToggle } from './theme-toggle'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { deleteImageByID } from '@/server/server-functions'
import { DemoDisclaimer } from './demo-disclaimer'

const NavbarSimplified = () => {
    const router = useRouter()
    const path = usePathname()
    const params = useParams()
    if (params && params.states) return (
        <div className="flex justify-between fixed inset-x-4 top-4">
            <Button variant={"ghost"} size={"icon"} type='button' onClick={async () => {
                await deleteImageByID(params.states[0])
                router.push("/")
            }}>
                <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <ModeToggle />
        </div>
    )

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
        <div className='fixed inset-x-4 top-4'>
            <DemoDisclaimer />
            <div className="flex justify-end">
                <ModeToggle />
            </div>
        </div>
    );
}

export default NavbarSimplified