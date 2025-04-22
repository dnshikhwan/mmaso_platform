import { Student } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: Student;
        }
    }
}
