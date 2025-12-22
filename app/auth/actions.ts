import { createClientServer } from "./clientServer";


export const userIsActive = async () => {
    const supabase = await createClientServer()
    const { data: { user } } = await supabase!.auth.getUser();
    return !!user?.email_confirmed_at
}


export async function SignIn(login: string, password: string) {
    const supabase = await createClientServer()
    return await supabase!.auth.signInWithPassword({ email: login, password: password })
}

export async function getUserId(): Promise<string | null> {
    const supabase = await createClientServer()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();
    return user?.id ?? null
}
