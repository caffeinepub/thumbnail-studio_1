export default function FeatureIcons() {
  const features = [
    {
      icon: '/assets/generated/icon-prompt.dim_128x128.png',
      title: 'AI Generation',
      description: 'Create from text prompts',
    },
    {
      icon: '/assets/generated/icon-upload.dim_128x128.png',
      title: 'Smart Enhancement',
      description: 'Improve existing images',
    },
    {
      icon: '/assets/generated/icon-video-link.dim_128x128.png',
      title: 'Video Analysis',
      description: 'Extract from video links',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:border-chart-1 transition-all hover:scale-105"
        >
          <div className="w-16 h-16 mx-auto mb-4">
            <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
          </div>
          <h3 className="font-semibold mb-1">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
