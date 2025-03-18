import AnotherUserProfile from '@/app/_Components/AnotherUserProfile'
import React from 'react'

const page = ({ params }: any) => {
   const { username }: any = React.use(params) 
  return (
      <>
      <AnotherUserProfile username={ username} />
      </>
  )
}

export default page