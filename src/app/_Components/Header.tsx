import React from 'react'
import Link from "next/link"


const Header = () => {
    return (
        <header className=" sm:hidden flex ">
          <div className="  justify-center flex  items-center">
            {/* Left side - Logo and Name */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                
                <span className="font-bold sm:inline-block font-[Pacifico]">Twins</span>
              </Link>
          </div>
          
        
            
    
           
          </div>
        </header>
      )
}

export default Header
