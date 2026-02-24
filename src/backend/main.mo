import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Blob "mo:core/Blob";

actor {
  include MixinStorage();

  public query ({ caller }) func generateThumbnailFromText(_ : Text) : async Storage.ExternalBlob {
    Blob.fromArray([]);
  };

  public query ({ caller }) func enhanceThumbnail(_ : Storage.ExternalBlob) : async Storage.ExternalBlob {
    Blob.fromArray([]);
  };

  public query ({ caller }) func generateThumbnailsFromVideo(_ : Text) : async [Storage.ExternalBlob] {
    [];
  };

  public query ({ caller }) func applyCustomizationsToThumbnail(_ : Storage.ExternalBlob, _ : Text) : async Storage.ExternalBlob {
    Blob.fromArray([]);
  };
};
