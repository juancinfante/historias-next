"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function NuevoViajeForm() {
    const [fechas, setFechas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [preview, setPreview] = useState("");
    const [faq, setFaq] = useState([{ pregunta: "", respuesta: "" }]);
    const [galeria, setGaleria] = useState([]);
    const [imagenesGaleria, setImagenesGaleria] = useState([]); // para subir nuevas imágenes (File[])
    const [imagenesAEliminar, setImagenesAEliminar] = useState([]); // Para almacenar las imágenes a eliminar
    const [saving, setSaving] = useState(false);
    const [origenes, setOrigenes] = useState([]);
    const opcionesOrigen = ["Santiago del Estero", "Tucumán", "Córdoba", "Salta"];
    const [mostrarLugares, setMostrarLugares] = useState(true);
    const [noches, setNoches] = useState(0);
    const [dias, setDias] = useState(0);
    const [formData, setFormData] = useState({
        nombre: "",
        portada: "",
        destino: "",
        origen: [],          // array
        precio: "",
        incluye: [],
        noIncluye: [],
        region: "",
        descripcion: "",
        mostrarLugares: false, // booleano (por defecto true)
        noches: 0,            // número
        dias: 0,              // número
    });


    useEffect(() => {
        setFormData({
            nombre: "",
            portada: "",
            destino: "",
            origen: [],
            precio: "",
            incluye: [],
            noIncluye: [],
            region: "",
            descripcion: "",
            mostrarLugares: false,
            noches: 0,
            dias: 0,
        });
        setFaq([{ pregunta: "", respuesta: "" }]);
        setFechas([{ salida: "", regreso: "" }]);
        setPreview("");
        setLoading(false);
        setGaleria([]);
    }, []);


    function agregarOrigen(origen) {
        if (!origenes.includes(origen)) {
            setOrigenes([...origenes, origen]);
        }
    }

    function eliminarOrigen(origen) {
        setOrigenes(origenes.filter(o => o !== origen));
    }

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

    const subirImagenACloudinary = async (nombreViaje) => {
        const formData = new FormData();
        formData.append("file", nuevaImagen);
        formData.append("nombreComercio", nombreViaje);

        const res = await fetch("/api/cloudinary", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Error al subir imagen");
        setSaving(false)

        const result = await res.json();
        return result.imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Validación básica
        if (!formData.nombre || !formData.destino || origenes.length === 0 || !formData.precio || isNaN(parseFloat(formData.precio))) {
            setError("Completa todos los campos obligatorios y asegúrate que el precio sea un número.");
            setSaving(false);
            return;
        }

        if (fechas.some(f => !f.salida || !f.regreso)) {
            setError("Todas las fechas deben tener salida y regreso.");
            setSaving(false);
            return;
        }

        try {
            let portadaFinal = formData.portada;

            if (nuevaImagen) {
                portadaFinal = await subirImagenACloudinary(formData.nombre);
            }

            let nuevasImagenes = [];
            if (imagenesGaleria.length > 0) {
                nuevasImagenes = await subirImagenesGaleria(formData.nombre);
            }

            if (imagenesAEliminar.length > 0) {
                await Promise.all(
                    imagenesAEliminar.map(async (publicId) => {
                        try {
                            const res = await fetch("/api/cloudinary", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ publicId }),
                            });

                            if (!res.ok) {
                                const err = await res.json();
                                console.error("Error al eliminar imagen:", err);
                            }
                        } catch (error) {
                            console.error("Error al hacer DELETE:", error);
                        }
                    })
                );
            }

            // ✅ Preparar payload final
            const payload = {
                ...formData,
                portada: portadaFinal,
                precio: parseFloat(formData.precio),
                fechas,
                incluye: typeof formData.incluye === "string" ? formData.incluye.split(",").map(s => s.trim()) : formData.incluye,
                noIncluye: typeof formData.noIncluye === "string" ? formData.noIncluye.split(",").map(s => s.trim()) : formData.noIncluye,
                faq,
                galeria: [...galeria, ...nuevasImagenes],
                origen: origenes, // ✅ array de origenes seleccionado
                noches: formData.noches, // ✅ número
                dias: formData.dias,     // ✅ número
                mostrarLugares: formData.mostrarLugares // ✅ booleano
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/trips`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                setSaving(false);
                throw new Error("Error al agregar el viaje");
            }

            // ✅ Resetear formulario
            setFormData({
                nombre: "",
                portada: "",
                destino: "",
                origen: [],
                precio: "",
                incluye: [],
                noIncluye: [],
                region: "",
                descripcion: "",
                mostrarLugares: false,
                noches: 0,
                dias: 0,
            });
            setOrigenes([]);
            setFaq([{ pregunta: "", respuesta: "" }]);
            setFechas([{ salida: "", regreso: "" }]);
            setPreview("");
            setGaleria([]);
            setNuevaImagen(null);
            setImagenesGaleria([]);
            setImagenesAEliminar([]);
        } catch (err) {
            setError(err.message);
            setSaving(false);
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
        return match ? decodeURIComponent(match[1]) : null;
    };

    const eliminarImagenExistente = (url) => {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta imagen?");
        if (!confirmacion) return;

        const publicId = extraerPublicId(url);
        if (publicId) {
            setImagenesAEliminar((prev) => [...prev, publicId]);
            setGaleria((prev) => prev.filter((img) => img !== url)); // Solo eliminamos de la galería visible
        }
    };

    const subirImagenesGaleria = async (nombreViaje) => {
        const urls = [];

        for (const img of imagenesGaleria) {
            const formData = new FormData();
            formData.append("file", img);
            formData.append("nombreComercio", nombreViaje);

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
            {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
            {error && <p className="mb-4 text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {["nombre", "destino", "precio"].map((name) => (
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
                <div className="mb-4">
                    <label className="block mb-1">Origen</label>
                    <select
                        onChange={(e) => agregarOrigen(e.target.value)}
                        className="border rounded p-2 w-full"
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona un origen</option>
                        {opcionesOrigen.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {origenes.map((origen) => (
                            <div key={origen} className="flex items-center bg-gray-200 rounded px-2 py-1">
                                {origen}
                                <button
                                    onClick={() => eliminarOrigen(origen)}
                                    className="ml-2 text-red-500"
                                >×</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="mostrarLugares"
                            checked={formData.mostrarLugares}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }))
                            }
                        />
                        Mostrar lugares disponibles
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Noches</label>
                    <select
                        name="noches"
                        value={formData.noches}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }))
                        }
                        className="border rounded p-2 w-full"
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15].map((d) => (
                            <option key={d} value={d}>{d} día{d > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Das</label>
                    <select
                        name="dias"
                        value={formData.dias}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }))
                        }
                        className="border rounded p-2 w-full"
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15].map((d) => (
                            <option key={d} value={d}>{d} día{d > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>
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

                <button
                    type="submit"
                    disabled={saving}
                    className={`px-4 py-2 rounded ${saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                    {saving ?
                        <>
                            <span className="flex justify-center items-center gap-2">
                                <p>
                                    Guardando
                                </p>
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </span>
                        </>
                        : 'Guardar'}
                </button>
            </form>
        </div>
    );
}
