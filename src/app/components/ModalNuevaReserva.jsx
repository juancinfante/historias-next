'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import { toast } from "sonner";
import { Loader2, PlusCircle, X } from "lucide-react";

export default function NuevoModalReserva({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tripID, setTripID] = useState('');
  const [pagos, setPagos] = useState([]);
  const [nuevoPago, setNuevoPago] = useState({ monto: '', metodo: 'efectivo', fecha: '' });
  const [fechasDisponibles, setFechasDisponibles] = useState([]);

  const [nuevaReserva, setNuevaReserva] = useState({
    titulo: '',
    precio: '',
    metodoPago: 'efectivo',
    tipoPago: 'total',
    estado: 'pagado',
    pasajeros: [{
      nombre: '',
      apellido: '',
      email: '',
      tipo_documento: '',
      numero_documento: '',
      email: '',
      telefono: '',
      notas: ''
    }],
  });



  const handleNuevoPagoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPago((prev) => ({ ...prev, [name]: value }));
  };

  const agregarPago = () => {
    if (!nuevoPago.monto || !nuevoPago.fecha) {
      toast.error("Completa monto y fecha");
      return;
    }
    setPagos((prev) => [...prev, nuevoPago]);
    setNuevoPago({ monto: '', metodo: 'efectivo', fecha: '' });
  };

  const eliminarPago = (index) => {
    setPagos((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFecha = (isoString) => {
    if (!isoString) return 'N/A';
    const [year, month, day] = isoString.split("-");
    return `${day}/${month}/${year}`;
  };


  const handleChange = (e) => {
    const { id, value } = e.target;
    setNuevaReserva((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasajeroChange = (index, field, value) => {
    const nuevosPasajeros = [...nuevaReserva.pasajeros];
    nuevosPasajeros[index][field] = value;
    setNuevaReserva((prev) => ({ ...prev, pasajeros: nuevosPasajeros }));
  };

  const agregarPasajero = () => {
    setNuevaReserva((prev) => ({
      ...prev,
      pasajeros: [...prev.pasajeros, {
        nombre: '',
        apellido: '',
        email: '',
        tipo_documento: '',
        numero_documento: '',
        email: '',
        telefono: '',
        notas: ''
      }],
    }));
  };

  const quitarPasajero = (index) => {
    const nuevos = nuevaReserva.pasajeros.filter((_, i) => i !== index);
    setNuevaReserva((prev) => ({ ...prev, pasajeros: nuevos }));
  };

  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/trips`);
        const data = await res.json();
        setViajes(data.data);
      } catch (err) {
        console.error("Error al obtener viajes:", err);
      }
    };

    fetchViajes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevaReserva, precio: Number(nuevaReserva.precio), tripID, pagos: pagos }),
      });
      if (!res.ok) throw new Error('Error al crear la reserva');
      const data = await res.json();
      setIsOpen(false);
      setNuevaReserva({
        titulo: '',
        precio: '',
        metodoPago: '',
        tipoPago: '',
        estado: '',
        pasajeros: [{
          nombre: '',
          apellido: '',
          email: '',
          tipo_documento: '',
          numero_documento: '',
          email: '',
          telefono: '',
          notas: ''
        }],
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  function formatearFecha(iso) {
    if (!iso) return '';
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="ml-2">
        <PlusCircle className="mr-2 h-4 w-4" />
        Nueva Reserva
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Crear Reserva</h2>
              <button onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            {/* Aquí aplicamos las clases de scroll */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-grow" id="reserva-form"> {/* AÑADIDO: id="reserva-form" */}
              <div>
                <Label htmlFor="tripID">Viaje</Label>
                <select
                  id="tripID"
                  value={nuevaReserva.tripID || ''}
                  onChange={(e) => {
                    const selectedTripId = e.target.value;
                    const viajeSeleccionado = viajes.find((v) => v._id === selectedTripId);

                    setTripID(selectedTripId);
                    setNuevaReserva((prev) => ({
                      ...prev,
                      tripID: selectedTripId,
                      titulo: viajeSeleccionado?.nombre || '',
                    }));
                    setFechasDisponibles(viajeSeleccionado?.fechas || []);
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="">Selecciona un viaje</option>
                  {viajes.map((viaje) => (
                    <option key={viaje._id} value={viaje._id}>
                      {viaje.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {fechasDisponibles.length > 0 && (
                <div>
                  <Label htmlFor="fechaElegida">Fecha</Label>
                  <select
                    id="fechaElegida"
                    value={nuevaReserva.fechaElegida || ''}
                    onChange={(e) => setNuevaReserva((prev) => ({ ...prev, fechaElegida: e.target.value }))}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Selecciona una fecha</option>
                    {fechasDisponibles.map((f, index) => (
                      <option key={index} value={formatFecha(f.salida)}>
                        {formatearFecha(f.salida)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <Label htmlFor="precio">Monto</Label>
                <Input id="precio" type="number" value={nuevaReserva.precio} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="metodoPago">Método de Pago</Label>
                <select id="metodoPago" value={nuevaReserva.metodoPago} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="mercado pago admin">Mercado Pago</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tipoPago">Tipo de Pago</Label>
                <select id="tipoPago" value={nuevaReserva.tipoPago} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="total">Total</option>
                  <option value="reserva">Reserva</option>
                </select>
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <select id="estado" value={nuevaReserva.estado} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Pagos</Label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    name="monto"
                    placeholder="Monto"
                    value={nuevoPago.monto}
                    onChange={handleNuevoPagoChange}
                    type="number"
                  />
                  <select
                    name="metodo"
                    value={nuevoPago.metodo}
                    onChange={handleNuevoPagoChange}
                    className="border rounded-md p-2 text-sm"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="mercado pago">Mercado Pago</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="otro">Otro</option>
                  </select>
                  <Input
                    name="fecha"
                    type="date"
                    value={nuevoPago.fecha}
                    onChange={handleNuevoPagoChange}
                  />
                </div>

                <Button type="button" onClick={agregarPago} size="sm" className="mt-2">
                  Agregar Pago
                </Button>

                {pagos.length > 0 && (
                  <table className="w-full border mt-2 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Monto</th>
                        <th className="border px-2 py-1">Método</th>
                        <th className="border px-2 py-1">Fecha</th>
                        <th className="border px-2 py-1">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.map((pago, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">${pago.monto}</td>
                          <td className="border px-2 py-1 capitalize">{pago.metodo}</td>
                          <td className="border px-2 py-1">{formatFecha(pago.fecha)}</td>
                          <td className="border px-2 py-1">
                            <button
                              type="button"
                              onClick={() => eliminarPago(index)}
                              className="text-red-500 text-xs"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="space-y-4">
                <Label className="block">Pasajeros</Label>

                {nuevaReserva.pasajeros.map((pasajero, index) => (
                  <div key={index} className="relative border rounded-md p-4 space-y-2 bg-gray-50 dark:bg-gray-800">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <Input
                        placeholder="Nombre"
                        value={pasajero.nombre}
                        onChange={(e) => handlePasajeroChange(index, 'nombre', e.target.value)}
                      />
                      <Input
                        placeholder="Apellido"
                        value={pasajero.apellido}
                        onChange={(e) => handlePasajeroChange(index, 'apellido', e.target.value)}
                      />
                      <select
                        value={pasajero.tipo_documento}
                        onChange={(e) => handlePasajeroChange(index, 'tipo_documento', e.target.value)}
                        className="border rounded p-2"
                      >
                        <option value="">Tipo Doc</option>
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Otro">Otro</option>
                      </select>
                      <Input
                        placeholder="Número Doc"
                        value={pasajero.numero_documento}
                        onChange={(e) => handlePasajeroChange(index, 'numero_documento', e.target.value)}
                      />
                      <Input
                        placeholder="Email"
                        value={pasajero.email}
                        onChange={(e) => handlePasajeroChange(index, 'email', e.target.value)}
                      />
                      <Input
                        placeholder="Teléfono"
                        value={pasajero.telefono}
                        onChange={(e) => handlePasajeroChange(index, 'telefono', e.target.value)}
                      />
                      <div className="col-span-2">
                        <Input
                          placeholder="Notas"
                          value={pasajero.notas}
                          onChange={(e) => handlePasajeroChange(index, 'notas', e.target.value)}
                        />
                      </div>
                    </div>

                    {nuevaReserva.pasajeros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => quitarPasajero(index)}
                        className="absolute top-2 right-2 text-red-600"
                        title="Quitar pasajero"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <Button type="button" onClick={agregarPasajero} variant="outline" size="sm">
                  Agregar pasajero
                </Button>
              </div>
            </form>

            <div className="flex justify-end gap-2 pt-4 border-t p-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} form="reserva-form"> {/* MODIFICADO: Agregado form="reserva-form" */}
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}