
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100/50 border-t border-slate-200/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-semibold text-slate-800">DocChat AI</span>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              Transform your documents into interactive conversations. Upload, analyze, and ask questions about your content with AI-powered insights.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                Home
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                About
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                Documentation
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                Contact
              </a>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                <span className="sr-only">Twitter</span>
                <div className="w-6 h-6 bg-slate-300 rounded"></div>
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                <span className="sr-only">GitHub</span>
                <div className="w-6 h-6 bg-slate-300 rounded"></div>
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <div className="w-6 h-6 bg-slate-300 rounded"></div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/50 mt-8 pt-8 text-center">
          <p className="text-slate-600 text-sm">
            © {currentYear} DocChat AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
