import React from 'react'
import Image from "next/image"

const Story = () => {
  const stories = [
    {id:0,name:""},
    { id: 1, name: "s_ae-23b" },
    { id: 2, name: "maisenpai" },
    { id: 3, name: "sayfortwit" },
    { id: 4, name: "johndoe" },
    { id: 5, name: "maryjane2" },
    { id: 6, name: "obama" },
    { id: 7, name: "x_ae-21" },
    { id: 8, name: "x_ae-23b" },
  ]

  return (
      <>
      <div style={{boxShadow:"0px 1px 6px -1px #d8d6d6"}} className="overflow-auto p-3 pl-2 pr-2 rounded-xl  max-w-[850px] mt-8 ">
 

      <div className="flex gap-4  overflow-x-auto">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-0.5">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPjv1lHEIpzgDk_e3Sm-e4EVOzggYdb5aHA&s"
                  alt={story.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-gray-600">{story.name}</span>
          </div>
        ))}
      </div>
</div>
      </>
  )
}

export default Story