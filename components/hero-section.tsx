export function HeroSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 ring-1 ring-purple-500/20 mb-8">
          ⚡ AI-Powered Revenue Operating System (ROS)
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Transform Your
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sales Process
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Vellora AI combines intelligent automation with powerful revenue operations to help your sales team close more
          deals faster than ever before.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
            Start Free Trial →
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-medium transition-colors">
            View Demo
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-400 text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Deal Tracking</h3>
            <p className="text-gray-400">AI-powered insights to optimize your sales pipeline</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-400 text-xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
            <p className="text-gray-400">Multi-tenant architecture for seamless teamwork</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-400 text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Automation</h3>
            <p className="text-gray-400">Automate repetitive tasks and focus on closing deals</p>
          </div>
        </div>
      </div>
    </section>
  )
}
