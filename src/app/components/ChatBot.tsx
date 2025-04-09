'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)
  const chatRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setHintVisible(false), 5000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (open) resetChat()
  }, [open])

  const resetChat = () => {
    if (!chatRef.current) return
    chatRef.current.innerHTML = ''
    showBotMessage('Hola 👋 Soy tu asistente virtual. ¿En qué te puedo ayudar?', [
      'Reservar',
      'Ya reservé',
      'Tengo un problema'
    ])
  }

  const showBotMessage = (text: string, options: string[] = []) => {
    if (!chatRef.current) return

    const wrapper = document.createElement('div')
    wrapper.className = 'flex items-start gap-2 w-full'

    const avatar = document.createElement('img')
    avatar.src = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png'
    avatar.className = 'h-6 w-6 rounded-full mt-1'

    const bubble = document.createElement('div')
    bubble.className = 'bg-white text-gray-800 px-4 py-2 rounded-xl text-sm shadow w-full'
    bubble.innerHTML = `<div class="mb-1">${text}</div>`

    if (options.length) {
      const buttonsWrapper = document.createElement('div')
      buttonsWrapper.className = 'flex flex-wrap gap-2 mt-2'

      options.forEach((opt) => {
        const btn = document.createElement('button')
        btn.textContent = opt
        btn.className = 'option-btn'
        btn.onclick = () => handleUserChoice(opt)
        buttonsWrapper.appendChild(btn)
      })

      bubble.appendChild(buttonsWrapper)
    }

    wrapper.appendChild(avatar)
    wrapper.appendChild(bubble)
    chatRef.current.appendChild(wrapper)
    chatRef.current.scrollTop = chatRef.current.scrollHeight
  }

  const handleUserChoice = (choice: string) => {
    if (!chatRef.current) return

    const wrapper = document.createElement('div')
    wrapper.className = 'flex justify-end w-full'

    const userMsg = document.createElement('div')
    userMsg.className =
      'bg-blue-600 text-white px-4 py-2 rounded-xl text-sm max-w-[75%] w-fit'
    userMsg.textContent = choice

    wrapper.appendChild(userMsg)
    chatRef.current.appendChild(wrapper)
    chatRef.current.scrollTop = chatRef.current.scrollHeight

    setTimeout(() => {
      switch (choice) {
        case 'Reservar':
          showBotMessage('¡Genial! Tenemos los mejores paquetes para vos.', ['Ver paquetes'])
          break
        case 'Tengo un problema':
          showBotMessage('Lo siento 😢 ¿Qué tipo de problema tenés?', [
            'Pagos',
            'No me llegó el email',
            'Hablar con un asesor'
          ])
          break
        case 'Ya reservé':
          showBotMessage('Perfecto. ¿Con qué necesitas ayuda?', [
            'Ver mi reserva',
            'Hablar con un asesor'
          ])
          break
        default:
          showBotMessage('Gracias por tu respuesta 🙌')
      }
    }, 500)
  }

  return (
    <>
      {hintVisible && !open && (
        <div className="fixed bottom-24 right-6 bg-white text-sm shadow-md px-3 py-2 rounded-lg border border-gray-300 animate-fade-in-up z-50">
          ¿Puedo ayudarte?
        </div>
      )}

      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir chat"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-lg z-50 flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white p-4 font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png"
                alt="Bot"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>Asistente Virtual</span>
            </div>
            <button
              onClick={resetChat}
              className="text-sm bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded"
            >
              🔄
            </button>
          </div>

          <div
            ref={chatRef}
            className="overflow-y-auto p-4 space-y-2 text-sm bg-gray-50"
            style={{ maxHeight: '400px', minHeight: '200px' }}
          ></div>

          <div className="border-t p-2">
            <input
              disabled
              className="w-full text-sm text-gray-500 italic px-2 py-1 bg-gray-100 rounded"
              value="Escribí acá..."
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .option-btn {
          border: 1px solid #cbd5e1;
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
          background-color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .option-btn:hover {
          background-color: #f1f5f9;
        }
      `}</style>
    </>
  )
}
