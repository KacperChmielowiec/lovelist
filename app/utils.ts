import {createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabase = createPagesBrowserClient();

export async function getUserId() {
    const session = supabase.auth.getSession();
    const token = (await session).data.session?.access_token;   
    const {data,error} = await supabase.auth.getUser(token);
    if (error || !data?.user){
        return null;
    }
    return data.user.id;
}

export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}