import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Download, Loader2, Wand2, RotateCcw } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface ThumbnailEditorProps {
  thumbnail: ExternalBlob;
  onThumbnailUpdated: (thumbnail: ExternalBlob) => void;
}

interface Customizations {
  brightness: number;
  contrast: number;
  saturation: number;
  textOverlay: string;
  textColor: string;
  textSize: number;
}

export default function ThumbnailEditor({ thumbnail, onThumbnailUpdated }: ThumbnailEditorProps) {
  const { actor } = useActor();
  const [isApplying, setIsApplying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [customizations, setCustomizations] = useState<Customizations>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    textOverlay: '',
    textColor: '#ffffff',
    textSize: 48,
  });

  useEffect(() => {
    setPreviewUrl(thumbnail.getDirectURL());
    // Reset customizations when thumbnail changes
    setCustomizations({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      textOverlay: '',
      textColor: '#ffffff',
      textSize: 48,
    });
  }, [thumbnail]);

  const handleApplyCustomizations = async () => {
    if (!actor) {
      toast.error('Backend not connected');
      return;
    }

    setIsApplying(true);
    try {
      const customizationsJSON = JSON.stringify(customizations);
      const updated = await actor.applyCustomizationsToThumbnail(thumbnail, customizationsJSON);
      const url = updated.getDirectURL();
      setPreviewUrl(url);
      onThumbnailUpdated(updated);
      toast.success('Customizations applied successfully!');
    } catch (error) {
      console.error('Error applying customizations:', error);
      toast.error('Failed to apply customizations');
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    setCustomizations({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      textOverlay: '',
      textColor: '#ffffff',
      textSize: 48,
    });
    setPreviewUrl(thumbnail.getDirectURL());
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `thumbnail-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Thumbnail downloaded!');
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-chart-4" />
          Customize Thumbnail
        </CardTitle>
        <CardDescription>
          Adjust colors, add text, and perfect your thumbnail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="rounded-xl overflow-hidden border-2 border-border">
          <img src={previewUrl} alt="Thumbnail preview" className="w-full h-auto" />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Brightness: {customizations.brightness}%</Label>
            <Slider
              value={[customizations.brightness]}
              onValueChange={([value]) =>
                setCustomizations((prev) => ({ ...prev, brightness: value }))
              }
              min={0}
              max={200}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Contrast: {customizations.contrast}%</Label>
            <Slider
              value={[customizations.contrast]}
              onValueChange={([value]) =>
                setCustomizations((prev) => ({ ...prev, contrast: value }))
              }
              min={0}
              max={200}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Saturation: {customizations.saturation}%</Label>
            <Slider
              value={[customizations.saturation]}
              onValueChange={([value]) =>
                setCustomizations((prev) => ({ ...prev, saturation: value }))
              }
              min={0}
              max={200}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Text Overlay</Label>
            <Input
              placeholder="Add text to your thumbnail..."
              value={customizations.textOverlay}
              onChange={(e) =>
                setCustomizations((prev) => ({ ...prev, textOverlay: e.target.value }))
              }
            />
          </div>

          {customizations.textOverlay && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={customizations.textColor}
                    onChange={(e) =>
                      setCustomizations((prev) => ({ ...prev, textColor: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Text Size: {customizations.textSize}px</Label>
                  <Slider
                    value={[customizations.textSize]}
                    onValueChange={([value]) =>
                      setCustomizations((prev) => ({ ...prev, textSize: value }))
                    }
                    min={12}
                    max={120}
                    step={1}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleApplyCustomizations} disabled={isApplying} className="flex-1">
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Apply
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Button onClick={handleDownload} variant="secondary" className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Download Thumbnail
        </Button>
      </CardContent>
    </Card>
  );
}
