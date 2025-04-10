// app/page.tsx (o pages/index.tsx si usás el sistema viejo de pages)
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import SectionExperiencias from "./components/SectionExperiencias"
import SectionNaturaleza from "./components/SectionNaturaleza"
import CarouselPaquetes from "./components/CarouselPaquetes"
import OtrosDestinos from "./components/OtrosDestinos"
import Footer from "./components/Footer"
import ChatBot from "./components/ChatBot"

export default function Home() {
  return (
    <>
      <Hero
        titulo="Descubre el norte Argentino"
        subtitulo="Creamos experiencias únicas y memorables para que disfrutes de los destinos más increíbles del planeta."
        botonTexto="Explorar Destinos"
        botonHref="/paquetes"
        imagen="/img/hornocal.webp"
        mostrarBoton={true}
      />

      <SectionExperiencias />
      <SectionNaturaleza />
      <CarouselPaquetes />
      <OtrosDestinos />
      <Footer />
      <ChatBot />
    </>
  )
}