// app/page.tsx (o pages/index.tsx si usás el sistema viejo de pages)
import CarouselPaquetes from "../components/CarouselPaquetes"
import ChatBot from "../components/ChatBot"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import OtrosDestinos from "../components/OtrosDestinos"
import SectionExperiencias from "../components/SectionExperiencias"
import SectionNaturaleza from "../components/SectionNaturaleza"

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