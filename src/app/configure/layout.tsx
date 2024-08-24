import MaxWidthwrapper from "@/components/MaxWidthWrapper"

import Steps from "@/components/Steps"

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <MaxWidthwrapper className="flex-1 flex flex-col">
            <Steps/>    
            {children}
            </MaxWidthwrapper>
    )
}

export default Layout