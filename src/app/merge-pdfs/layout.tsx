import React from "react";

const MergePDFLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return <section className="w-full min-h-screen">{children}</section>;
};

export default MergePDFLayout;
