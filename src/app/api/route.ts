import { getServerAuthSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
    const session = await getServerAuthSession();
    console.log("session", session);
    if (!session) return new NextResponse(JSON.stringify({
        status: 200,
        message: "Hello World. user is not logged in"
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    }); else return new NextResponse(JSON.stringify({
        status: 200,
        message: "Hello World. user is logged in"
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export { handler as GET, handler as POST };