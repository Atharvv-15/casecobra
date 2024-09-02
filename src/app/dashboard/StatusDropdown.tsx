'use client'

import { Button } from "@/components/ui/button"
import { OrderStatus } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { changeOrderStatus } from "./actions"
import { useRouter } from "next/navigation"


const STATUS : Record<keyof typeof OrderStatus, string> = {

    awating_shipment: 'Awaiting Shipment',
    shipped: 'Shipped',
    fullfilled: 'Fullfilled'
}

const StatusDropDown = ({id, orderStatus} : {id: string, orderStatus: OrderStatus}) => {

    const router = useRouter()

    const {mutate: setOrderStatusDropDown} = useMutation({
        mutationKey: ['updateOrderStatus'],
        mutationFn: changeOrderStatus,
        onSuccess: () => {
            router.refresh()
        }
    })
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-52 flex justify-between items-center">
                    {STATUS[orderStatus]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                {Object.keys(OrderStatus).map((status) => (
                    <DropdownMenuItem
                        key={status}
                        className={cn('flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100', {
                            'bg-zinc-100': orderStatus === status
                        })}
                        onClick={() => setOrderStatusDropDown({id, newStatus: status as OrderStatus})}
                    >
                        <Check className={cn('mr-2 h-4 w-4 text-primary', 
                            orderStatus === status ? 'opacity-100' : 'opacity-0'
                        )}/>
                        {STATUS[status as OrderStatus]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default StatusDropDown