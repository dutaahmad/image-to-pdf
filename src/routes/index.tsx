import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex flex-col justify-center items-center min-h-screen text-center">
      <h1 className="font-bold text-6xl leading-normal">Rsbuild with React</h1>
      <p className="font-normal text-gray-500 text-lg leading-normal">
        Start building amazing things with Rsbuild.
      </p>
    </div>
  )
});