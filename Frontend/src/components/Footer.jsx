import React from 'react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaMedium, 
  FaEnvelope, 
  FaPhone,
  FaHeart,
  FaCode,
  FaMobile
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Developer Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaCode className="text-blue-400" />
              <h3 className="text-lg font-semibold">Developer</h3>
            </div>
            <div>
              <h4 className="text-xl font-bold text-blue-400 mb-2">Thisara Dasun</h4>
              <div className="flex items-center space-x-2 text-gray-300 mb-1">
                <FaCode className="text-sm" />
                <span>Fullstack Developer</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FaMobile className="text-sm" />
                <span>Mobile App Developer</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <FaEnvelope className="text-blue-400" />
              <span>Contact</span>
            </h3>
            <div className="space-y-3">
              <a 
                href="tel:+94789854096" 
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaPhone className="text-sm" />
                <span>+94 78 985 4096</span>
              </a>
              <a 
                href="mailto:thisaradasun05@gmail.com" 
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaEnvelope className="text-sm" />
                <span>thisaradasun05@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Me</h3>
            <div className="space-y-3">
              <a 
                href="https://github.com/Thisara404" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaGithub className="text-lg" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/thisara-dasun-1a2464281" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaLinkedin className="text-lg" />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://thisarad404.medium.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaMedium className="text-lg" />
                <span>Medium Blog</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span className="text-gray-400">by Thisara Dasun</span>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} MCQ System. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <a 
                  href="https://github.com/Thisara404" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaGithub className="text-xl" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/thisara-dasun-1a2464281" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                </a>
                <a 
                  href="https://thisarad404.medium.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaMedium className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;