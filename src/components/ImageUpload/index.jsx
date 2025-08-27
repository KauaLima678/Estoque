import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import style from './style.module.css';
import { FiUploadCloud } from "react-icons/fi";

export default function ImageUpload({ value, onChange, initialImageUrl }) {
  // Log para ver quando o componente renderiza e com que props
  console.log('--- [ImageUpload] RENDERIZOU ---');
  console.log(`Props recebidas -> value:`, value, ` initialImageUrl:`, initialImageUrl);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    console.log('[useEffect] A verificar se muda a preview...');
    if (value && value instanceof File) {
      const newPreviewUrl = URL.createObjectURL(value);
      setPreview(newPreviewUrl);
      console.log('[useEffect] Nova preview criada a partir de um File.');
      return () => {
        console.log('[useEffect] Limpando URL da preview:', newPreviewUrl);
        URL.revokeObjectURL(newPreviewUrl);
      }
    } 
    else if (initialImageUrl && !value) {
      setPreview(initialImageUrl);
      console.log('[useEffect] Preview definida a partir da initialImageUrl.');
    }
  }, [initialImageUrl, value]);

  const onDrop = useCallback(acceptedFiles => {
    console.log('--- [onDrop] FICHEIRO SELECIONADO/LARGADO ---');
    const file = acceptedFiles[0];
    if (file) {
      onChange(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);

    open();
  }

  return (
    <div {...getRootProps()} className={`${style.dropzone} ${isDragActive ? style.active : ''}`}>
      <input {...getInputProps()} />
      
      {preview ? (
        <div className={style.previewContainer}>
          <img src={preview} alt="Pré-visualização" className={style.previewImage} />
          <button type="button" onClick={handleRemoveImage} className={style.removeButton}>
            Trocar Imagem
          </button>
        </div>
      ) : (
        <div className={style.uploadPrompt}>
            <FiUploadCloud size={40} />
            <p>Arraste e solte a imagem aqui, ou clique para selecionar</p>
            <span>PNG e JPG, até 2MB</span>
        </div>
      )}
    </div>
  );
}