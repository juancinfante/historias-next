import React from "react";
import EditarViajeForm from "@/components/EditarViajeForm";

export default async function Page({ params }) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/trips/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <p>Error al cargar el viaje</p>;
  }

  const viaje = await res.json();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar viaje</h1>
      <EditarViajeForm viaje={viaje} />
    </div>
  );
}
