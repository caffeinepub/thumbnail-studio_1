import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProps {
  onThumbnailEnhanced: (thumbnail: ExternalBlob) => void;
}

export default function ImageUpload({ onThumbnailEnhanced }: ImageUploadProps) {
  const { actor } = useActor();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      toast.error('Please upload a PNG or JPEG image');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload and enhance
    setIsEnhancing(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      if (!actor) {
        toast.error('Backend not connected');
        return;
      }

      const enhanced = await actor.enhanceThumbnail(blob);
      const url = enhanced.getDirectURL();
      setEnhancedImage(url);
      onThumbnailEnhanced(enhanced);
      toast.success('Thumbnail enhanced successfully!');
    } catch (error) {
      console.error('Error enhancing thumbnail:', error);
      toast.error('Failed to enhance thumbnail');
    } finally {
      setIsEnhancing(false);
      setUploadProgress(0);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setEnhancedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-chart-2" />
          Upload & Enhance
        </CardTitle>
        <CardDescription>
          Upload your thumbnail and let AI enhance it to perfection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!uploadedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-chart-2 hover:bg-accent/50 transition-all"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">Click to upload image</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border-2 border-border">
              <img src={uploadedImage} alt="Uploaded" className="w-full h-auto" />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {isEnhancing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Enhancing...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {enhancedImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-chart-2">Enhanced Result:</p>
                <div className="rounded-xl overflow-hidden border-2 border-chart-2">
                  <img src={enhancedImage} alt="Enhanced" className="w-full h-auto" />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
