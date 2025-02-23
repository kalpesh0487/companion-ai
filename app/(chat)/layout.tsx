import React, { ReactNode } from 'react'

const layout = ({children}:{children:ReactNode}) => {
  return (
    <div className=' mx-auto max-w-4xl h-full w-full'>{children}</div>
  )
}

export default layout