import MaxWidthwrapper from "@/components/MaxWidthWrapper"

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <MaxWidthwrapper className="flex-1 flex flex-col">{children}</MaxWidthwrapper>
    )
}

export default Layout