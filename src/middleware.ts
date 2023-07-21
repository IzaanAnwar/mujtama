export { default } from "next-auth/middleware";

export const config = {
    // matcher: ["/profile"],
    matcher: ["/dashboard/:path*", "/profile/:path*"],
};
