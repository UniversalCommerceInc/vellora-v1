export function SolutionsSection() {
  const solutions = [
    {
      icon: "🎯",
      title: "Deal Pipeline Management",
      description: "Visual kanban boards with AI-powered deal scoring and revenue forecasting",
      features: ["Drag & drop interface", "AI deal scoring", "Revenue forecasting", "Custom stages"],
    },
    {
      icon: "👥",
      title: "Contact Management",
      description: "Centralized contact database with intelligent relationship mapping",
      features: ["Contact profiles", "Interaction history", "Relationship mapping", "Smart segmentation"],
    },
    {
      icon: "📅",
      title: "Meeting Scheduler",
      description: "Integrated calendar with automated follow-up reminders",
      features: ["Calendar integration", "Auto reminders", "Meeting notes", "Follow-up tracking"],
    },
    {
      icon: "📧",
      title: "Email Integration",
      description: "Seamless email sync with automated sequence campaigns",
      features: ["Email sync", "Template library", "Automated sequences", "Open tracking"],
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Real-time insights and performance metrics for your revenue operations",
      features: ["Real-time metrics", "Custom reports", "Team performance", "Revenue analytics"],
    },
    {
      icon: "⚡",
      title: "AI Automation",
      description: "Intelligent automation to streamline your revenue workflow",
      features: ["Lead scoring", "Task automation", "Smart recommendations", "Predictive insights"],
    },
  ]

  return (
    <section className="py-20 bg-black/20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Complete ROS Solution
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Accelerate Revenue Growth
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our comprehensive Revenue Operating System provides all the tools your team needs to manage leads, track
            deals, and optimize revenue operations.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-900/70 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{solution.icon}</div>
              <h3 className="text-white text-xl font-semibold mb-3">{solution.title}</h3>
              <p className="text-gray-400 mb-4">{solution.description}</p>
              <ul className="space-y-2">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Revenue Operations?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of revenue teams who have already increased their performance by 40% with Vellora AI's
              intelligent Revenue Operating System.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-colors">
                Start Your Free Trial →
              </button>
              <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
