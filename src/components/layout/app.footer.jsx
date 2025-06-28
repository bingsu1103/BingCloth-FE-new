import binglogo from "../../assets/img/png/binglogo.jpg"
import { FaRegCopyright } from "react-icons/fa6";
import { IoLogoFacebook } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import ModelAI from "../client/modelAI";
const AppFooter = () => {
    return (
        <div className='bg-[#181818]'>
            <ModelAI />
            <div className='p-10 grid grid-cols-5 max-sm:grid-cols-1 text-white text-xs gap-5'>
                <div className="flex gap-5 col-span-2 items-center">
                    <div>
                        <img src={binglogo} width={80} className="rounded-full" alt="" />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div>Company: Bing Cloth Ltd</div>
                        <div>Present: An Ngo</div>
                        <div>Address: 43 Tan Lap, Dong Hoa, Di An, Binh Duong</div>
                        <div>Business registration number: 032-762-8312</div>
                    </div>
                </div>
                <div className='flex flex-col gap-1 col-span-1'>
                    <ul> Contact
                        <li className='list-disc'>Phone: +84 775 510 335</li>
                        <li className='list-disc'>Email: bingcloth@gmail.com</li>
                    </ul>
                </div>
                <div className='flex flex-col gap-1 col-span-1'>
                    <ul>Customer Service
                        <li className='list-disc'>Q&A</li>
                        <li className='list-disc'>Open: 7AM - 8PM</li>
                        <li className='list-disc'>Contact for cooperation</li>
                    </ul>
                </div>
                <div className='flex flex-col gap-1 max-sm:hidden'>
                    <ul className='flex flex-col gap-2'>
                        <span>Social Media</span>
                        <div className='flex gap-3'>
                            <li className='cursor-pointer'><IoLogoFacebook className='text-xl' /></li>
                            <li className='cursor-pointer'><FaSquareXTwitter className='text-xl' /></li>
                            <li className='cursor-pointer'><FaInstagram className='text-xl' /></li>
                        </div>
                    </ul>
                </div>
            </div>
            <div className='flex gap-2 justify-center'>
                <footer className="footer sm:footer-horizontal footer-center bg-[#181818] text-base-content p-4">
                    <aside>
                        <p>Copyright © {new Date().getFullYear()} - All right reserved by BingCloth Ltd</p>
                    </aside>
                </footer>
            </div>
        </div>
    )
}
export default AppFooter