import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image as ImageIcon } from 'lucide-react';
import { ExternalBlob } from '../backend';

interface ThumbnailGalleryProps {
  thumbnails: ExternalBlob[];
  onThumbnailSelect: (thumbnail: ExternalBlob) => void;
}

export default function ThumbnailGallery({ thumbnails, onThumbnailSelect }: ThumbnailGalleryProps) {
  if (thumbnails.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-chart-5" />
            Your Thumbnails
          </CardTitle>
          <CardDescription>Generated thumbnails will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No thumbnails yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-chart-5" />
          Your Thumbnails
        </CardTitle>
        <CardDescription>Click to edit any thumbnail</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid grid-cols-2 gap-3">
            {thumbnails.map((thumbnail, index) => (
              <button
                key={index}
                onClick={() => onThumbnailSelect(thumbnail)}
                className="rounded-lg overflow-hidden border-2 border-border hover:border-chart-5 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-chart-5"
              >
                <img
                  src={thumbnail.getDirectURL()}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/generated/placeholder-thumbnail.dim_400x300.png';
                  }}
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
