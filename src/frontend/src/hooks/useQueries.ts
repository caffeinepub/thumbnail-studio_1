import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useGenerateThumbnailFromText() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateThumbnailFromText(prompt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thumbnails'] });
    },
  });
}

export function useEnhanceThumbnail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (thumbnail: ExternalBlob) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.enhanceThumbnail(thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thumbnails'] });
    },
  });
}

export function useGenerateThumbnailsFromVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoUrl: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateThumbnailsFromVideo(videoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thumbnails'] });
    },
  });
}

export function useApplyCustomizations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      thumbnail,
      customizations,
    }: {
      thumbnail: ExternalBlob;
      customizations: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.applyCustomizationsToThumbnail(thumbnail, customizations);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thumbnails'] });
    },
  });
}
