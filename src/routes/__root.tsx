import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <div className='w-full min-h-screen'>
        <div className='flex flex-col justify-center items-center w-full'>
          This is header
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          <Outlet />
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          This is footer
        </div>
      </div>
    </React.Fragment>
  ),
})
