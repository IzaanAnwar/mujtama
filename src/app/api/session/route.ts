import { getSession } from "next-auth/react";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { ISession } from "my-types";

export async function POST(req: NextApiRequest) {
    const session = (await getSession({ req })) as ISession | null;
    if (!session || !session.user) {
        return NextResponse.json(
            { error: "User not authenticated" },
            { status: 400 },
        );
    }
    session.user.role = "G";

    return NextResponse.json({
        authenticated: !!session,
        session,
    });
}
