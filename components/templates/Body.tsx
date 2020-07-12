import Head from "next/head";

const Body = ({ children }) => (
    <>
        <Head>
            <title>🚀🦀 rocketcrab</title>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
        </Head>
        {children}
        <style jsx global>{`
            * {
                letter-spacing: normal !important;
                font-family: "Inconsolata", monospace;
            }
        `}</style>
    </>
);

export default Body;