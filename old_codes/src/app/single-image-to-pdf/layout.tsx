import React from "react";

const SingleImageToPDFLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return <section className="w-full min-h-screen">{children}</section>;
};

export default SingleImageToPDFLayout;
