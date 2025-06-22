import React, { useState, useEffect } from 'react';
import '../styles/gallerysection.css'

type GalleryProps = {
  photos: string[] | undefined;
  onPhotosChange: (photos: string[]) => void;
  onNewPhotosSelected: (files: File[]) => void;
};

export const GallerySection: React.FC<GalleryProps> = ({ photos = [], onPhotosChange ,onNewPhotosSelected}) => {

  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    const previews = newPhotos.map((file) => URL.createObjectURL(file));
    setNewPreviews(previews);
    onNewPhotosSelected(newPhotos); // 🔥 Send to parent when changed

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPhotos, onNewPhotosSelected]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    setNewPhotos((prev) => [...prev, ...fileArray]); // keep existing ones
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    onPhotosChange(updatedPhotos);
  };

  const removeNewPhoto = (index: number) => {
    const updated = newPhotos.filter((_, i) => i !== index);
    setNewPhotos(updated);
  };
  // Optional: combine existing + new photos to preview in UI
  // But keep them separate to handle uploading existing vs new differently

  return (
    <div className="gallery-section">
      <label className="gallery-label">Upload More Photos</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryChange}
        className="gallery-input"
      />

      <div className="gallery-preview">
        {/* Existing photos */}
        {photos.length > 0 &&
          photos.map((src, index) => (
            <div key={`existing-${index}`} className="gallery-photo-wrapper">
              <img src={src} alt={`Photo ${index + 1}`} className="gallery-photo" />
              <button
                type="button"
                className="gallery-remove-btn"
                onClick={() => removePhoto(index)}
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}

        {/* New photos previews */}
        {newPreviews.length > 0 &&
          newPreviews.map((src, index) => (
            <div key={`new-${index}`} className="gallery-photo-wrapper">
              <img src={src} alt={`New upload ${index + 1}`} className="gallery-photo" />
              <button
                type="button"
                className="gallery-remove-btn"
                onClick={() => removeNewPhoto(index)}
                aria-label="Remove new photo"
              >
                ×
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
