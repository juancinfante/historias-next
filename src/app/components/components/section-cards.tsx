import { Banknote, Handshake, Landmark, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/components/ui/card"
import { Button } from "./ui/button"

export function SectionCards() {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Total Revenue</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        $1,250.00
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this month <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>New Customers</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        1,234
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingDownIcon className="size-3" />
                            -20%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Down 20% this period <TrendingDownIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Acquisition needs attention
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Active Accounts</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        45,678
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +12.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Strong user retention <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Engagement exceed targets</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Growth Rate</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        4.5%
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                            <TrendingUpIcon className="size-3" />
                            +4.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Steady performance <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Meets growth projections</div>
                </CardFooter>
            </Card>
            <Card className="col-span-full @xl/main:col-span-2 @5xl/main:col-span-2 @container/card">
                <CardHeader>
                    <CardTitle>Mi Nueva Tarjeta Grande</CardTitle>
                    <CardDescription>Esta tarjeta ocupa dos columnas en pantallas medianas y grandes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Aquí puedes poner cualquier contenido que desees, como un gráfico grande, una tabla o más detalles.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Se adapta automáticamente al tamaño de la pantalla.</p>
                </CardContent>
                <CardFooter>
                    <Button>Ver más detalles</Button>
                </CardFooter>
            </Card>
            <Card className="col-span-full @xl/main:col-span-2 @5xl/main:col-span-2 @container/card">
                <CardHeader>
                    <CardTitle className="text-2xl">Ultimas reservas</CardTitle>
                    <CardDescription>Se hicieron 43 reservas este mes.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div className="w-full flex justify-between">
                        <div className="flex w-full gap-9 items-center">
                            <div className="flex flex-col gap-2">
                                <CardTitle>Juan Cruz Infante</CardTitle>
                                <CardDescription className="w-[170px] overflow-hidden">juaninfantejj@gmail.com</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <CardDescription className="w-[150px] overflow-hidden">Aventura en tilcara</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Badge variant="outline">
                                    <Landmark className=" text-black" />
                                    Transferencia
                                </Badge>
                                <Badge variant="outline">Reserva</Badge>
                            </div>
                        </div>
                        <CardTitle className="text-xl tabular-nums">
                            +$45,000
                        </CardTitle>
                    </div>
                    <div className="w-full flex justify-between">
                        <div className="flex w-full gap-9 items-center">
                            <div className="flex flex-col gap-2">
                                <CardTitle>Jose Perez</CardTitle>
                                <CardDescription className="w-[170px] overflow-hidden">joseperez@gmail.com</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <CardDescription className="w-[150px] overflow-hidden">Escapada a las Cataratas</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Badge variant="outline">
                                    <Handshake className=" text-blue-500" />
                                    Mercado Pago
                                </Badge>
                                <Badge variant="outline">Total</Badge>
                            </div>
                        </div>
                        <CardTitle className="text-xl tabular-nums">
                            +$300,000
                        </CardTitle>
                    </div>
                    <div className="w-full flex justify-between">
                        <div className="flex w-full gap-9 items-center">
                            <div className="flex flex-col gap-2">
                                <CardTitle>Maria Diaz</CardTitle>
                                <CardDescription className="w-[170px] overflow-hidden">mariadiaz@gmail.com</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <CardDescription className="w-[150px] overflow-hidden">Playas de Brasil</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Badge variant="outline">
                                    <Banknote className=" text-green-500" />
                                    Efectivo
                                </Badge>
                                <Badge variant="outline">Reserva</Badge>
                            </div>
                        </div>
                        <CardTitle className="text-xl tabular-nums">
                            +$90,000
                        </CardTitle>
                    </div>
                    <div className="w-full flex justify-between">
                        <div className="flex w-full gap-9 items-center">
                            <div className="flex flex-col gap-2">
                                <CardTitle>Juan Cruz Infante</CardTitle>
                                <CardDescription className="w-[170px] overflow-hidden">juaninfantejj@gmail.com</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <CardDescription className="w-[150px] overflow-hidden">Aventura en tilcara</CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Badge variant="outline">
                                    <Landmark className=" text-black" />
                                    Transferencia
                                </Badge>
                                <Badge variant="outline">Reserva</Badge>
                            </div>
                        </div>
                        <CardTitle className="text-xl tabular-nums">
                            +$45,000
                        </CardTitle>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Ver más</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
