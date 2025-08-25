import React from 'react'
import Image from "next/image";
import logo from "../../public/Logo.png"
import { MdOutlineVerifiedUser } from "react-icons/md";

function Navbar(){
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex w-full h-[76px] lg:h-[184px] bg-white items-center justify-center shadow-sm">
            <Image
                src={logo}
                alt='logo'
                className="absolute left-4 w-10 h-10 lg:w-[100px] lg:h-[100px] top-1/2 -translate-y-1/2"
            />

            <div>
                <p className="text-[20px] lg:text-[32px] leading-[100%] font-semibold text-center">
                    Oyoyo Star Hunt
                </p>
                <div className="flex justify-center mt-3 gap-1">
                    <MdOutlineVerifiedUser className="text-[#289A55] w-4 h-4 lg:w-6 lg:h-6" />
                    <p className="text-[14px] lg:text-[18px] leading-[26px] text-[#289A55]">
                        Secure voting system
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Navbar;