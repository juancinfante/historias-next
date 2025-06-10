'use client'
import Slider from 'react-slick'
import Image from 'next/image'

const paquetes = [
  {
    title: 'Aventura en la Quebrada de Humahuaca',
    duration: '5 noches - 4 dias',
    description: 'Explorá los cerros multicolores y los pueblos tradicionales de Jujuy en un viaje lleno de cultura y paisajes únicos.',
    image: '/img/hornocal.webp',
    precio: 450000
  },
  {
    title: 'Retiro Colonial en Salta',
    duration: '2-8 noches',
    description: 'Viví el encanto de Salta con su arquitectura colonial, historia fascinante y vinos regionales de alta calidad.',
    image: '/img/hornocal.webp'
  },
  {
    title: 'Experiencia Vinícola en Cafayate',
    duration: '2-4 noches',
    description: 'Relajate en Cafayate, tierra del vino Torrontés, con vistas a los cerros y una atmósfera tranquila y acogedora.',
    image: '/img/hornocal.webp'
  },
  {
    title: 'Bienestar en Termas de Río Hondo',
    duration: '5-10 noches',
    description: 'Renová cuerpo y mente en las aguas termales más famosas del país, ideales para descansar y disfrutar de un spa natural.',
    image: '/img/hornocal.webp'
  }
]

export default function CarouselPaquetes() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      }
    ]
  }

  return (
    <section id="packages" className="bg-gray-100 py-20 text-center px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">Nuestros Paquetes</h2>
      <div className="container mx-auto max-w-[1300px]">
        <Slider {...settings}>
          {paquetes.map((paquete, i) => (
            <div key={i} className="px-3">
              <div className="relative h-[500px] rounded-lg overflow-hidden text-left">
                <Image
                  src={paquete.image}
                  alt={paquete.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="flex flex-col absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{paquete.title}</h3>
                  <p className="text-sm">{paquete.duration}</p>
                  <h1 className='text-3xl font-semibold'><span className='text-lg mr-1'>$</span>450.000</h1>
                  <span className='text-sm'>Saliendo desde Santiago del Estero, Tucuman</span>
                  <button className="cursor-pointer mt-2 inline-flex items-center justify-center w-fit rounded-md text-sm font-medium h-10 p-2 bg-white/10 border border-white/20 hover:bg-white/20 transition">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}
