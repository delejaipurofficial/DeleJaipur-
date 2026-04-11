import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, X } from 'lucide-react';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploader({ onUploadComplete, folder = 'uploads', label = 'Upload Image' }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);

    // Generate preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setProgress(0);

    try {
      // Compress image first
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      // Demo mode — no Cloudinary credentials configured
      if (!CLOUD_NAME || !UPLOAD_PRESET) {
        console.warn('[ImageUploader] Cloudinary not configured. Using local blob URL (demo mode).');
        const blobUrl = URL.createObjectURL(compressed);
        onUploadComplete(blobUrl);
        setProgress(100);
        setUploading(false);
        return;
      }

      // Upload to Cloudinary via unsigned preset
      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          onUploadComplete(res.secure_url);
          setProgress(100);
          setUploading(false);
        } else {
          setError('Upload failed. Please try again.');
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        setError('Network error. Check your connection.');
        setUploading(false);
      };

      xhr.send(formData);
    } catch (err) {
      setError('Image processing failed. Try a different image.');
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setProgress(0);
    onUploadComplete('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="label-sm text-xs text-onSurfaceVariant">{label}</label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-surface-high">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
              <div className="w-28 bg-white/20 rounded-full h-2">
                <div
                  className="h-2 bg-primary-container rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white text-sm font-medium">{progress}%</span>
            </div>
          )}
          {!uploading && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          {progress === 100 && !uploading && (
            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              ✓ Uploaded
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-36 border-2 border-dashed border-outlineVariant rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-container hover:bg-primary-light/10 transition-all duration-200 cursor-pointer"
        >
          <div className="w-10 h-10 bg-surface-high rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-onSurfaceVariant" />
          </div>
          <span className="text-sm text-onSurfaceVariant">Click to browse or drag & drop</span>
          <span className="text-xs text-outline">PNG, JPG, WEBP — max 5MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
