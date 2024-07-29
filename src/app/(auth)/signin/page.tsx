"use client"

import { signin } from "@/actions/user/signin"
import Alert from "@/components/Alert"
import { Input } from "@/components/shadcn/ui/input"
import { signinValidation } from "@/validations/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@nextui-org/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaGithub } from "react-icons/fa"

export default function Page() {
    const [serverSentError, setServerSentError] = useState("")
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(signinValidation),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: signin,
        onSettled(data) {
            if (!data?.success) {
                setServerSentError(data?.message || "Something wen't wrong")
            }
        },
    })

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit((e) => mutate(e))} className="flex h-full w-full max-w-md flex-col gap-5 rounded-3xl border bg-white px-10 py-8 shadow-md">
                <h1 className="mx-auto text-2xl font-bold">Sign in</h1>
                {/* Email */}
                <div>
                    <span className="mb-2 block text-sm font-medium text-black/90">Email</span>
                    <Input {...register("email")} placeholder="mail@gmail.com" type="email" className="rounded-full" />
                    {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                </div>
                {/* Password */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-black/90">Password</span>
                        <Link href="" className="text-sm font-semibold text-blue-500">
                            Forgot password?
                        </Link>
                    </div>
                    <Input {...register("password")} placeholder="password" type="password" className="rounded-full" />
                    {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                </div>
                {serverSentError && <Alert className="rounded-full" message={serverSentError} variant="error" />}
                <div className="flex flex-col gap-3">
                    <Button isLoading={isPending} type="submit" className="h-9 rounded-full" color="primary">
                        Sign in
                    </Button>
                    <div className="flex items-center gap-3">
                        <hr className="w-full" />
                        <span className="text-center text-sm font-medium text-black/60">Or</span>
                        <hr className="w-full" />
                    </div>
                    <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=Ov23li2yPpt6UtR9agpF">
                        <Button startContent={<FaGithub size={18} />} isDisabled={isPending} type="button" className="h-9 w-full rounded-full border font-medium text-black/70" variant="light">
                            Login with Github
                        </Button>
                    </a>
                </div>
                <Link className="mx-auto text-sm font-medium text-blue-500" href="/signup">
                    Dont have an account?
                </Link>
            </form>
        </div>
    )
}
