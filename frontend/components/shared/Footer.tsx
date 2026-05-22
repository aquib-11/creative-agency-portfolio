import { FaInstagram, FaPhoneAlt,FaLinkedin,FaWhatsapp } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";

import logoWhite from "@/public/LogoWhite.png";
import logoBlack from "@/public/LogoBlack.png";
import Image from "next/image";

const Footer = () => {

  const isDark = typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true';
  return (
    <footer className="border-t border-border bg-background"> 
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-8 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {/* Logo and Branding */}
            <div className="flex flex-col gap-3 md:gap-4">
             <Image  src={isDark ? logoWhite : logoBlack} alt="Oasis Ascend Logo" className="w-40 md:w-50" />
              <p className="text-xs md:text-sm text-muted-foreground">  Where your brand meets the right audience and truly stands out.
</p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="font-semibold text-sm md:text-base text-foreground">Quick Links</h3>
              <nav className="space-y-1 md:space-y-2">
                <a href="/industries" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors inline-block">
                  Industries
                </a>
                <br />
                <a href="/testimonials" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors inline-block">
                  Testimonials
                </a>
              </nav>
            </div>

            {/* Contact & Social */}
            <div className="flex flex-col gap-3 ">
              <h3 className="font-semibold text-sm md:text-base text-foreground">Connect With Us</h3>
              
              {/* Contact Info */}
              <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                <a href="mailto:sales@oasisascend.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
                 <IoMailOpen  className="w-4 h-4 text-yellow-dark "/>
                  <span className="truncate">sales@oasisascend.com</span>
                </a>
                <a href="tel:+918491012121" className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <FaPhoneAlt className="text-yellow-dark w-4 h-4"/>
                  <span>+91 8491012121</span>
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-2 md:gap-2">
                <a href="https://www.instagram.com/oasis_ascend" target="_blank" rel="noopener noreferrer" className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors shrink-0" title="Instagram">
                  <FaInstagram className="text-yellow-dark w-5 h-5"/>
                </a>
                <a href="https://www.linkedin.com/company/oasisascend" target="_blank" rel="noopener noreferrer" className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors shrink-0" title="LinkedIn">
                  <FaLinkedin className="text-yellow-dark w-5 h-5"/>
                </a>
                <a href="https://wa.me/918491012121" target="_blank" rel="noopener noreferrer" className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors shrink-0" title="WhatsApp">
                  <FaWhatsapp className="text-yellow-dark w-5 h-5"/>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8 md:my-10"></div>

          {/* Copyright */}
          <div className="text-center text-xs md:text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()}<span className="text-yellow-dark"> Oasis Ascend</span>. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}
export default Footer