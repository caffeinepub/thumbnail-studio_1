import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Loader2, ExternalLink } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface VideoLinkInputProps {
  onThumbnailsGenerated: (thumbnails: ExternalBlob[]) => void;
}

export default function VideoLinkInput({ onThumbnailsGenerated }: VideoLinkInputProps) {
  const { actor } = useActor();
  const [videoUrl, setVideoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];
      return validDomains.some((domain) => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    if (!actor) {
      toast.error('Backend not connected');
      return;
    }

    if (!videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    if (!validateUrl(videoUrl)) {
      toast.error('Please enter a valid video URL (YouTube, Vimeo, or Dailymotion)');
      return;
    }

    setIsGenerating(true);
    try {
      const thumbnails = await actor.generateThumbnailsFromVideo(videoUrl);
      const urls = thumbnails.map((t) => t.getDirectURL());
      setGeneratedThumbnails(urls);
      onThumbnailsGenerated(thumbnails);
      toast.success(`Generated ${thumbnails.length} thumbnail${thumbnails.length > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error('Error generating thumbnails:', error);
      toast.error('Failed to generate thumbnails from video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-chart-3" />
          Generate from Video
        </CardTitle>
        <CardDescription>
          Paste a video link to create similar thumbnails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports YouTube, Vimeo, and Dailymotion
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !videoUrl.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Generate Thumbnails
            </>
          )}
        </Button>

        {generatedThumbnails.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Generated Thumbnails:</p>
            <div className="grid grid-cols-2 gap-2">
              {generatedThumbnails.map((url, index) => (
                <div key={index} className="rounded-lg overflow-hidden border-2 border-border">
                  <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
