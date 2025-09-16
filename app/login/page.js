"use client"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from 'next/image'
import googleicon from '@/public/google.svg'

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard")
        }
    }, [status, router])

    async function handleEmailSignIn(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const res = await signIn("email", { email })
            if (res?.error) {
                setError(res.error)
            } else {
                alert("Check your email for a login link!")
            }
        } catch (err) {
            setError("Failed to sign in")
        }
        setLoading(false)
    }

    return (
        <>
            <div className='flex flex-col items-center min-h-[90%] w-[33%] space-y-4 m-auto text-center text-gray-300  rounded-lg pt-15 font-bold'>
                <h3 className='text-3xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit</h3>
                <p className='text-5xs'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo nisi illum in praesentium dolor, laudantium atque tempora temporibus delectus rem consequatur at id sunt. At facilis accusantium similique tempore reprehenderit.</p>

                <div className="max-w-md w-full m-auto p-2 rounded shadow">
                    <button
                        onClick={() => signIn("google")}
                        className="w-full py-2 px-4 border border-gray-300 rounded-3xl hover:bg-gray-100 flex items-center justify-center space-x-4"
                    >
                        <Image src={googleicon} alt="Google" width={24} height={24} />
                        <span>Sign in with Google</span>
                    </button>


                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>

                    <form onSubmit={handleEmailSignIn} className="space-y-4">

                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            placeholder="Your email address"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-3xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-3xl hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Sign in with Email"}
                        </button>
                    </form>
                </div>
            </div >
        </>

    )
}