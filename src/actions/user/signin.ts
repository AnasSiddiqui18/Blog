"use server"

import { sendError } from "@/helpers/sendError"
import { auth } from "@/lib/auth"
import { client } from "@/lib/prismaClient"
import { ErrorResponse, SuccessResponse } from "@/types"
import { signinValidation } from "@/validations/user"
import argon from "argon2"
import { z } from "zod"

type IReturn = ErrorResponse | SuccessResponse<{ user: { id: string; name: string; email: string } }>

export async function signin(data: z.infer<typeof signinValidation>): Promise<IReturn> {
    const validate = signinValidation.safeParse(data)
    if (validate.error) return { success: false, message: "Bad Request" }
    try {
        const user = await client.user.findFirst({ where: { email: validate.data.email } })
        if (!user) return sendError("Email or Password is incorrect")
        if (!user.password) return sendError("Use different login method")
        const doesPassMatch = await argon.verify(user.password, validate.data.password)
        if (!doesPassMatch) return sendError("Email or Password is incorrect")
        await auth.createSession({ userId: user.id, expiresAt: new Date(Date.now() + 2592000000) })
        return { success: true, user: { id: user.id, email: user.email, name: user.name } }
    } catch (error) {
        return sendError(error)
    }
}
