import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary usando un buffer
 * @param {Buffer} buffer - La imagen como buffer
 * @param {string} folder - Carpeta destino en Cloudinary
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export const subirImagen = (buffer, folder = 'default') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    ).end(buffer);
  });
};

/**
 * Elimina una imagen de Cloudinary por su public_id
 * @param {string} publicId - El ID público de la imagen en Cloudinary
 * @returns {Promise<any>}
 */
export const eliminarImagen = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    throw new Error("Error al eliminar imagen");
  }
};
