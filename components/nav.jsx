"use client";


import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders} from 'next-auth/react'
import {RiMenu3Line, RiCloseLine } from 'react-icons/ri'



const Nav = () => {
    const {data: session} = useSession();

    const [toggleDropdown,  setToggleDropdown] = useState(false);

    const [providers, setproviders] = useState(null);
    
    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();

            setproviders(response);

        }
        setUpProviders();
    }, []);
    return (
        <nav className="flex-between w-full mb-16 pt-3" >
            <Link href="/" className="flex gap-2 flex-center">
                <Image src="/assets/images/logo.svg" alt="Promptopia Logo" width={30} height= {30} className="object-contain"/>
            </Link>

            { /* desktop nav */ }
             <div className="sm:flex hidden">
                {session?.user ? (
                <div className="flex gap-3 md:gap-5">
                    <Link href="/create-prompt" className="black_btn">
                        Create Post
                    </Link>
                    <button type="button" className="outline_btn" onClick={signOut}>
                        Sign Out
                    </button>
                    <Link href="/profile">
                        <Image src= {session?.user.image}
                               width={37}
                               height={37}
                               className="rounded-full"
                               alt="profile"/>
                    </Link>
                </div>):(
                <>
                   {providers && 
                   Object.values(providers).map((provider) => (
                    <button type="button" 
                    key= {provider.name}
                    onClick={() => signIn(provider.id)}
                    className="black_btn">
                        SignIn
                    </button>
                   ))

                   }
                </>
                ) }
            </div> 

            {/* mobile navigation */}

            <div className="sm:hidden flex relative">
                {session?.user ? (
                    <div className="flex" >
                        {/* <Image src="/assets/images/logo.svg"
                               width={37}
                               height={37}
                               className="rounded -full"
                               alt="profile"
                               onClick={() => setToggleDropdown((prev) => !prev)}/> */}
                          {toggleDropdown 
                            ? <RiCloseLine color='#808080' size={27} onClick = {() => setToggleDropdown(false)} />
                             : <RiMenu3Line color='#808080' size={27} onClick = {() => setToggleDropdown(true) } /> 
                          
                          }
                          
                        {toggleDropdown && (
                            <div className="dropdown">
                                <Link 
                                href="/profile"
                                className="dropdown_link"
                                onClick={()=> setToggleDropdown(false)}>
                                    My Profile
                                </Link>
                                <Link 
                                href="/create-prompt"
                                className="dropdown_link"
                                onClick={()=> setToggleDropdown(false)}>
                                    Create Prompt
                                </Link>
                                <button onClick={()=>{ setToggleDropdown(false);
                                               signOut();}} 
                                               className="mt-5 w-full black_btn">
                                    Sign Out

                                </button>
                                

                            </div>
                        )}
                    </div>
                    
                ):(
                <>
                   {providers && 
                   Object.values(providers).map((provider) => (
                    <button type="button" 
                    key= {provider.name}
                    onClick={() => signIn(provider.id)}
                    className="black_btn">
                        SignIn
                    </button>
                   ))

                   }
                </>)}
            </div>

        </nav>
    
    )
}


export default Nav;