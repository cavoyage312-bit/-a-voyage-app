import { createSupabaseServerClient } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const cookieStore = cookies();

        // 1. Create a normal client to check the requester's identity
        const supabase = createSupabaseServerClient(cookieStore);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('API: Auth error or no user:', authError);
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // Check if the current user is an admin in the profiles table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('API: Profil introuvable ou erreur:', profileError);
            return NextResponse.json({ error: 'Erreur lors de la vérification des droits admin.' }, { status: 500 });
        }

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Interdit : Vous devez être administrateur' }, { status: 403 });
        }

        // 2. Parse request body
        const { email, password, full_name, role } = await request.json();

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
        }

        // 3. Create the user using the Service Role
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceKey || !url) {
            console.error('API: Config manquante - URL:', !!url, 'KEY:', !!serviceKey);
            return NextResponse.json({ error: 'Le serveur n\'est pas configuré correctement (Clé de service manquante)' }, { status: 500 });
        }

        const adminSupabase = createClient(url, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name }
        });

        if (createError) {
            console.error('API: Erreur de création Supabase:', createError);
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        // 4. Force update profile role
        if (newUser.user) {
            const { error: roleError } = await adminSupabase
                .from('profiles')
                .update({ role, full_name })
                .eq('id', newUser.user.id);

            if (roleError) {
                console.error('API: Erreur mise à jour rôle:', roleError);
                return NextResponse.json({ error: 'Utilisateur créé, mais le rôle n\'a pas pu être assigné.' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, user: newUser.user });

    } catch (e: any) {
        console.error('API CRASH CRITIQUE:', e);
        return NextResponse.json({
            error: 'Erreur Serveur Critique',
            details: e.message,
            stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
        }, { status: 500 });
    }
}
