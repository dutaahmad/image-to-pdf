import "server-only";

const isDevelopment = () => process.env.NODE_ENV === "development";

const isProduction = () => process.env.NODE_ENV === "production";

const debug = {
    isDevelopment,
    isProduction,
}

export default debug;