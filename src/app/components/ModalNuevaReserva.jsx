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
        body: JSON.stringify({ ...nuevaReserva, precio: Number(nuevaReserva.precio), tripID }),
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

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="ml-2">
        <PlusCircle className="mr-2 h-4 w-4" />
        Nueva Reserva
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Crear Reserva</h2>
              <button onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <Label htmlFor="tripID">Viaje</Label>
                <select
                  id="tripID"
                  value={nuevaReserva.tripID || ''}
                  onChange={(e) =>
                    setNuevaReserva((prev) => ({
                      ...prev,
                      tripID: e.target.value,
                      titulo: viajes.find((v) => v._id === e.target.value)?.nombre || '',
                    }))
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">Selecciona un viaje</option>
                  {viajes.map((viaje) => (
                    <option key={viaje._id} value={viaje._id} onChange={setTripID(viaje._id)}>
                      {viaje.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="precio">Precio total</Label>
                <Input id="precio" type="number" value={nuevaReserva.precio} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="metodoPago">Método de Pago</Label>
                <select id="metodoPago" value={nuevaReserva.metodoPago} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="mercado pago">Mercado Pago</option>
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


              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
