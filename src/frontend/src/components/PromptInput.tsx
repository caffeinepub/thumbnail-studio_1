import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface PromptInputProps {
  onThumbnailGenerated: (thumbnail: ExternalBlob) => void;
}

export default function PromptInput({ onThumbnailGenerated }: PromptInputProps) {
  const { actor } = useActor();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!actor) {
      toast.error('Backend not connected');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const thumbnail = await actor.generateThumbnailFromText(prompt);
      const url = thumbnail.getDirectURL();
      setGeneratedThumbnail(url);
      onThumbnailGenerated(thumbnail);
      toast.success('Thumbnail generated successfully!');
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      toast.error('Failed to generate thumbnail');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-chart-1" />
          Generate from Text
        </CardTitle>
        <CardDescription>
          Describe your ideal thumbnail and let AI create it for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="E.g., A vibrant gaming thumbnail with neon colors, featuring a character holding a sword against a futuristic cityscape..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
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
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Thumbnail
            </>
          )}
        </Button>

        {generatedThumbnail && (
          <div className="mt-4 rounded-xl overflow-hidden border-2 border-border">
            <img
              src={generatedThumbnail}
              alt="Generated thumbnail"
              className="w-full h-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
