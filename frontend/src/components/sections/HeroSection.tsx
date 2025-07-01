
export const HeroSection = () => {
  return (
    <section className="text-center py-16 space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
          Chat with Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-green-600 block">
            Documents
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload any document and transform it into an interactive conversation. 
          Ask questions, get insights, and explore your content in a whole new way.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>PDF Support</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          <span>Word Documents</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>Text Files</span>
        </span>
      </div>
    </section>
  );
};
