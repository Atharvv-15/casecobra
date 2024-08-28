import { notFound } from "next/navigation"
import { db } from "/Users/atharvakharage/Documents/Web-Dev/casecobra-dev/src/db"
import DesignConfigurator from "./DesignConfigurator"

interface PageProps {
    searchParams : {
        [key : string] : string | string[] | undefined
    }
}

const Page = async ({searchParams}: PageProps) => {
    const {id} = searchParams

    if(!id || typeof id !== "string") {
        return notFound()
    }

    const configuration = await db.configuration.findUnique({
        where: {id},
    })

    if(!configuration) {
        return notFound()
    }

    const {width, height, imageUrl} = configuration


    return <DesignConfigurator configId={configuration.id} imageUrl={imageUrl} imageDimensions={{width, height}}/>
}

export default Page