"use client";
import { useState, useEffect } from "react";

export default function EditarViajeForm({ viaje }) {
    const [fechas, setFechas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [preview, setPreview] = useState("");
    const [faq, setFaq] = useState([{ pregunta: "", respuesta: "" }]);
    const [galeria, setGaleria] = useState([]);
    const [imagenesGaleria, setImagenesGaleria] = useState([]); // para subir nuevas imágenes (File[])


    const [formData, setFormData] = useState({
        nombre: "",
        portada: "",
        destino: "",
        origen: "",
        precio: "",
        incluye: "",
        noIncluye: "",
        region: "",
        descripcion: "",
    });

    useEffect(() => {
        setFormData({
            nombre: viaje.nombre || "",
            portada: viaje.portada || "",
            destino: viaje.destino || "",
            origen: viaje.origen || "",
            precio: viaje.precio || "",
            incluye: (viaje.incluye || []).join(", "),
            noIncluye: (viaje.noIncluye || []).join(", "),
            region: viaje.region || "",
            descripcion: viaje.descripcion || "",
        });
        setFaq(viaje.faq?.length ? viaje.faq : [{ pregunta: "", respuesta: "" }]);
        setFechas(viaje.fechas?.length ? viaje.fechas : [{ salida: "", regreso: "" }]);
        setPreview(viaje.portada || "");
        setLoading(false);
        setGaleria(viaje.galeria || []);
    }, [viaje]);

    const handleFaqChange = (index, field, value) => {
        const nuevasFaq = [...faq];
        nuevasFaq[index][field] = value;
        setFaq(nuevasFaq);
    };

    const agregarFaq = () => {
        setFaq([...faq, { pregunta: "", respuesta: "" }]);
    };

    const eliminarFaq = (index) => {
        const nuevasFaq = faq.filter((_, i) => i !== index);
        setFaq(nuevasFaq.length ? nuevasFaq : [{ pregunta: "", respuesta: "" }]);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        setNuevaImagen(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleFechasChange = (index, field, value) => {
        const nuevasFechas = [...fechas];
        nuevasFechas[index][field] = value;
        setFechas(nuevasFechas);
    };

    const agregarFecha = () => setFechas([...fechas, { salida: "", regreso: "" }]);
    const eliminarFecha = (index) => {
        const nuevasFechas = fechas.filter((_, i) => i !== index);
        setFechas(nuevasFechas.length ? nuevasFechas : [{ salida: "", regreso: "" }]);
    };

    const subirImagenACloudinary = async () => {
        const formData = new FormData();
        formData.append("file", nuevaImagen);
        formData.append("nombreComercio", viaje.nombre);

        const res = await fetch("/api/cloudinary", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Error al subir imagen");

        const result = await res.json();
        return result.imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.destino || !formData.origen || !formData.precio || isNaN(parseFloat(formData.precio))) {
            setError("Completa todos los campos obligatorios y asegúrate que el precio sea un número.");
            return;
        }

        if (fechas.some(f => !f.salida || !f.regreso)) {
            setError("Todas las fechas deben tener salida y regreso.");
            return;
        }

        try {
            let portadaFinal = formData.portada;

            if (nuevaImagen) {
                portadaFinal = await subirImagenACloudinary();
            }

            let nuevasImagenes = [];

            if (imagenesGaleria.length > 0) {
                nuevasImagenes = await subirImagenesGaleria();
            }

            const payload = {
                ...formData,
                portada: portadaFinal,
                precio: parseFloat(formData.precio),
                fechas,
                incluye: formData.incluye.split(",").map((s) => s.trim()),
                noIncluye: formData.noIncluye.split(",").map((s) => s.trim()),
                faq,
                galeria: [...galeria, ...nuevasImagenes],
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/trips/${viaje._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Error al actualizar el viaje");

            setSuccessMessage("¡Viaje actualizado correctamente!");
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // FUNCIONES PARA MANEJAR LA GALERIA

    const handleAgregarImagenGaleria = (e) => {
        const archivos = Array.from(e.target.files);
        setImagenesGaleria((prev) => [...prev, ...archivos]);
    };

    const eliminarImagenNueva = (index) => {
        setImagenesGaleria(imagenesGaleria.filter((_, i) => i !== index));
    };

    const extraerPublicId = (url) => {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const eliminarImagenExistente = async (url) => {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta imagen?");
        if (!confirmacion) return;

        try {
            const publicId = extraerPublicId(url);
            if (!publicId) throw new Error("No se pudo extraer el publicId");

            const res = await fetch("/api/cloudinary", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicId }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al eliminar imagen");

            setGaleria((prev) => prev.filter((img) => img !== url));
        } catch (err) {
            console.error("Error al eliminar la imagen:", err.message);
            alert("Ocurrió un error al eliminar la imagen de Cloudinary");
        }
    };


    const subirImagenesGaleria = async () => {
        const urls = [];

        for (const img of imagenesGaleria) {
            const formData = new FormData();
            formData.append("file", img);
            formData.append("nombreComercio", viaje.nombre); // si lo usas en Cloudinary

            const res = await fetch("/api/cloudinary", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Error al subir imagen de galería");

            const result = await res.json();
            urls.push(result.imageUrl);
        }

        return urls;
    };


    if (loading) return <p className="p-4">Cargando viaje...</p>;

    return (
        <div className="w-6xl">
            <h1 className="text-2xl font-bold mb-4">Editar viaje</h1>
            {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
            {error && <p className="mb-4 text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {["nombre", "destino", "origen", "precio", "region"].map((name) => (
                    <div key={name}>
                        <label className="block text-sm font-medium capitalize">{name}</label>
                        <input
                            type={name === "precio" ? "number" : "text"}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        rows="4"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Portada actual</label>
                    {preview && <img src={preview} alt="Portada" className="w-64 h-auto mb-2 rounded shadow" />}
                    <input type="file" accept="image/*" onChange={handleImagenChange} />
                </div>

                <div>
                    <label className="block text-sm font-medium">Fechas</label>
                    {fechas.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 mt-2">
                            <input type="date" value={f.salida} onChange={(e) => handleFechasChange(i, "salida", e.target.value)} />
                            <input type="date" value={f.regreso} onChange={(e) => handleFechasChange(i, "regreso", e.target.value)} />
                            <button type="button" onClick={() => eliminarFecha(i)} className="text-red-600 text-sm">Eliminar</button>
                        </div>
                    ))}
                    <button type="button" onClick={agregarFecha} className="text-blue-600 text-sm mt-2">+ Agregar otra fecha</button>
                </div>

                {["incluye", "noIncluye"].map((key) => (
                    <div key={key}>
                        <label className="block text-sm font-medium capitalize">{key.replace("Incluye", " Incluye")} (separado por coma)</label>
                        <input name={key} value={formData[key]} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
                    </div>
                ))}
                <div>
                    <label className="block text-sm font-medium">Galería de imágenes</label>

                    {/* Imágenes ya guardadas */}
                    {galeria.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {galeria.map((url, i) => (
                                <div key={i} className="relative w-32 h-32">
                                    <img src={url} className="w-full h-full object-cover rounded shadow" />
                                    <button
                                        type="button"
                                        onClick={() => eliminarImagenExistente(url)}
                                        className="absolute top-1 right-1 bg-white text-red-600 text-xs px-1 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Nuevas imágenes a subir */}
                    {imagenesGaleria.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {imagenesGaleria.map((img, i) => (
                                <div key={i} className="relative w-32 h-32">
                                    <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded shadow" />
                                    <button
                                        type="button"
                                        onClick={() => eliminarImagenNueva(i)}
                                        className="absolute top-1 right-1 bg-white text-red-600 text-xs px-1 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAgregarImagenGaleria}
                        className="mt-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Preguntas Frecuentes (FAQ)</label>
                    {faq.map((item, i) => (
                        <div key={i} className="border p-3 mt-2 rounded space-y-2">
                            <input
                                type="text"
                                placeholder="Pregunta"
                                value={item.pregunta}
                                onChange={(e) => handleFaqChange(i, "pregunta", e.target.value)}
                                className="block w-full border rounded px-3 py-2"
                            />
                            <textarea
                                placeholder="Respuesta"
                                value={item.respuesta}
                                onChange={(e) => handleFaqChange(i, "respuesta", e.target.value)}
                                className="block w-full border rounded px-3 py-2"
                                rows="2"
                            />
                            <button
                                type="button"
                                onClick={() => eliminarFaq(i)}
                                className="text-red-600 text-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={agregarFaq}
                        className="text-blue-600 text-sm mt-2"
                    >
                        + Agregar otra pregunta
                    </button>
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar cambios</button>
            </form>
        </div>
    );
}
