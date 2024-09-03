'use client'

import Confetti from 'react-dom-confetti'
import { useEffect, useState } from "react"
import { Configuration } from '@prisma/client'
import Phone from "@/components/Phone"
import { COLORS, FINISHES, MODELS } from '@/validators/option-validator'
import { cn, formatPrice } from "@/lib/utils"
import { ArrowRight, Check } from 'lucide-react'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { createCheckoutSession } from './actions'
import { url } from 'inspector'
import { useRouter } from 'next/navigation'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useToast } from '@/components/ui/use-toast'
import LoginModal from '@/components/LoginModal'



const DesignPreview = ({configuration}: {configuration: Configuration}) => {
    const[showConfetti, setShowConfetti] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
    const router = useRouter()
    const {toast} = useToast()
   

    const {color, model, material, finish} = configuration
    const tw = COLORS.find(c => c.value === color)?.tw
    const {label: modelLabel} = MODELS.options.find(m => m.value === model)!
    const {user} = useKindeBrowserClient()
    const {id} = configuration

    let totalPrice = BASE_PRICE
    if (material === 'polycarbonate') {
        totalPrice += PRODUCT_PRICES.material.polycarbonate
    }

    if (finish === 'textured') {
        totalPrice += PRODUCT_PRICES.finish.textured
    }
    const totalPriceFormatted = formatPrice(totalPrice / 100)

    const {mutate: createPaymentSession, isPending} = useMutation({
        mutationKey: ['get-checkout-session'],
        mutationFn: createCheckoutSession,
        onSuccess: ({url}) => {
            if(url) router.push(url)
                else throw new Error("Unable to retrieve payment URL.")
        },
        onError: () => {
            toast({
                title: "Something went wrong",
                description: "There was an error on our end. Please try again.",
                variant: "destructive",
            })
        }
    })

    const handleCheckout = () => {
        if (user) {
          // create payment session
          createPaymentSession({ configId: id })
        } else {
          // need to log in
          sessionStorage.setItem('configurationId', id)
          setIsLoginModalOpen(true)
        }
      }

    useEffect(() => {
        setShowConfetti(true)
    }, [])

    return (
        <>
            <div 
                aria-hidden="true" 
                className="pointer-events-none select-none absolute inset-0
                overflow-hidden flex justify-center">
                    <Confetti active={showConfetti} config = {{elementCount: 200, spread: 90}} />
            </div>

            <div className='flex flex-col items-center mt-20 md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 
            md:gap-x-8 lg:gap-x-12'>
                <div className='md:col-span-3 md:row-span-2 md:row-end-2'>
                    <Phone className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")} imgSrc={configuration.croppedImageUrl!}/>
                </div>

                <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen}/>

                <div className='mt-6 sm:col-span-9 md:row-end-1'>
                    <h3 className="text-3xl font-bold tracking-tight text-gray-900">Your {modelLabel} Case</h3>
                    <div className="mt-3 flex items-center gap-1.5 text-base">
                        <Check className='h-4 w-4 text-green-500'/>
                        In stock and ready to ship
                    </div>
                </div>
                <div className='sm:col-span-12 md:col-span-9 text-base'>
                    <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6
                    sm:py-6 md:py-10'>
                        <div>
                            <p className='font-medium text-zinc-950'>Highlights</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>Wireless Charging compatible</li>
                                <li>TPU shock absorbtion</li>
                                <li>Packaging made from recycled materials</li>
                                <li>5 year warranty</li>

                            </ol>
                        </div>

                        <div>
                            <p className='font-medium text-zinc-950'>Materials</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>Wireless Charging compatible</li>
                                <li>Scratch and fingerprint-resistant coating</li>
                            </ol>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8'>
                            <div className='flow-root text-sm'>
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Base price</p>
                                    <p className='font-medium text-gray-900'>
                                        {formatPrice(BASE_PRICE / 100)}
                                    </p>
                                </div>

                                {finish === 'textured' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Textured finish</p>
                                    <p className='font-medium text-gray-900'>
                                        {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                                    </p>
                                </div>
                                ) : null}

                                {material === 'polycarbonate' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Soft Polycarbonate material</p>
                                    <p className='font-medium text-gray-900'>
                                        {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                                    </p>
                                </div>
                                ) : null}

                                <div className='my-2 h-px bg-gray-200'/>
                                <div className='flex items-center justify-between py-2'>
                                    <p className='text-gray-900 font-semibold'>Order total</p>
                                    <p className='font-semibold text-gray-900'>{totalPriceFormatted}</p>
                                </div>

                            </div>
                        </div>
                        <div className='mt-8 flex justify-end pb-12'>
                            <Button isLoading={isPending} disabled={isPending} loadingText="Just a moment..." onClick={() => createPaymentSession({ configId: id })} className='px-4 sm:px-6 lg:px-8'>Check out <ArrowRight className='h-4 w-4 ml-1.5 inline'/></Button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default DesignPreview