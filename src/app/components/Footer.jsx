export default function Footer() {
    return (
      <footer className="bg-[rgb(43,52,71)] text-white py-10 px-4 lg:px-0 bottom-0">
        <div className="container mx-auto max-w-[1300px] grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          {/* Marca */}
          <div>
            <h2 className="text-2xl font-bold">TravelDreams</h2>
            <p className="text-sm mt-1">Haciendo realidad tus sueños de viaje desde 2008</p>
          </div>
  
          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contacto</h3>
            <p>+1 234 567 890</p>
            <p>info@traveldreams.com</p>
            <p>123 Travel Street, Ciudad</p>
          </div>
  
          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Enlaces Rápidos</h3>
            <ul className="space-y-1">
              <li><a href="#about" className="hover:underline">Sobre Nosotros</a></li>
              <li><a href="#packages" className="hover:underline">Paquetes</a></li>
              <li><a href="#contact" className="hover:underline">Contacto</a></li>
            </ul>
          </div>
  
          {/* Redes sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Síguenos</h3>
            <p>Redes sociales próximamente</p>
          </div>
        </div>
  
        {/* Separador */}
        <hr className="my-6 border-gray-400" />
  
        {/* Copyright */}
        <p className="text-center text-sm">© 2025 TravelDreams. Todos los derechos reservados.</p>
      </footer>
    )
  }
  