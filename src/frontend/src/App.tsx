import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Upload, Video } from 'lucide-react';
import PromptInput from './components/PromptInput';
import ImageUpload from './components/ImageUpload';
import VideoLinkInput from './components/VideoLinkInput';
import ThumbnailEditor from './components/ThumbnailEditor';
import ThumbnailGallery from './components/ThumbnailGallery';
import FeatureIcons from './components/FeatureIcons';
import { ExternalBlob } from './backend';
import { SiX, SiGithub } from 'react-icons/si';

function App() {
  const [currentThumbnail, setCurrentThumbnail] = useState<ExternalBlob | null>(null);
  const [galleryThumbnails, setGalleryThumbnails] = useState<ExternalBlob[]>([]);

  const handleThumbnailGenerated = (thumbnail: ExternalBlob) => {
    setCurrentThumbnail(thumbnail);
    setGalleryThumbnails((prev) => [thumbnail, ...prev]);
  };

  const handleThumbnailsGenerated = (thumbnails: ExternalBlob[]) => {
    if (thumbnails.length > 0) {
      setCurrentThumbnail(thumbnails[0]);
      setGalleryThumbnails((prev) => [...thumbnails, ...prev]);
    }
  };

  const handleThumbnailUpdated = (thumbnail: ExternalBlob) => {
    setCurrentThumbnail(thumbnail);
    setGalleryThumbnails((prev) => [thumbnail, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                  Thumbnail Studio
                </h1>
                <p className="text-xs text-muted-foreground">AI-Powered Thumbnail Creator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <SiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
              Create Stunning Thumbnails with AI
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Generate, enhance, and customize eye-catching thumbnails in seconds. Perfect for YouTube, social media, and more.
            </p>
            <FeatureIcons />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Creation Tools */}
          <div className="space-y-6">
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="prompt" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Prompt</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Video</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prompt" className="mt-6">
                <PromptInput onThumbnailGenerated={handleThumbnailGenerated} />
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <ImageUpload onThumbnailEnhanced={handleThumbnailGenerated} />
              </TabsContent>

              <TabsContent value="video" className="mt-6">
                <VideoLinkInput onThumbnailsGenerated={handleThumbnailsGenerated} />
              </TabsContent>
            </Tabs>

            {/* Gallery */}
            <ThumbnailGallery
              thumbnails={galleryThumbnails}
              onThumbnailSelect={setCurrentThumbnail}
            />
          </div>

          {/* Right Column - Editor */}
          <div className="lg:sticky lg:top-24 h-fit">
            {currentThumbnail ? (
              <ThumbnailEditor
                thumbnail={currentThumbnail}
                onThumbnailUpdated={handleThumbnailUpdated}
              />
            ) : (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Thumbnail Selected</h3>
                <p className="text-muted-foreground">
                  Generate or upload a thumbnail to start editing
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20 py-8 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Thumbnail Studio. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'thumbnail-studio'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-chart-1 hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
